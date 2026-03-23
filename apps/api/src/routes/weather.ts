import { Hono } from 'hono'
import { fetchWeather } from '../services/open-meteo'

type Bindings = {
  WEATHER_STORE: DurableObjectNamespace
}

const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

export const weatherRoutes = new Hono<{ Bindings: Bindings }>()

weatherRoutes.get('/weather', async (c) => {
  const lat = c.req.query('lat')
  const lon = c.req.query('lon')

  if (!lat || !lon) {
    return c.json({ error: 'lat and lon are required', status: 400 }, 400)
  }

  const latitude = parseFloat(lat)
  const longitude = parseFloat(lon)

  if (isNaN(latitude) || isNaN(longitude)) {
    return c.json({ error: 'lat and lon must be valid numbers', status: 400 }, 400)
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return c.json({ error: 'lat must be between -90 and 90, lon between -180 and 180', status: 400 }, 400)
  }

  // Round to 2 decimal places for cache key stability
  const cacheKey = `cache:weather:${latitude.toFixed(2)}:${longitude.toFixed(2)}`

  // Check DO cache
  const id = c.env.WEATHER_STORE.idFromName('global')
  const stub = c.env.WEATHER_STORE.get(id)
  const cacheUrl = new URL('https://do/cache')
  cacheUrl.searchParams.set('key', cacheKey)
  const cacheRes = await stub.fetch(cacheUrl.toString())
  const cached = await cacheRes.json() as { data: unknown; expiresAt: number } | null

  const now = Date.now()
  const isStale = cached && cached.expiresAt <= now
  const isFresh = cached && cached.expiresAt > now

  if (isFresh) {
    return c.json(cached.data)
  }

  // Stale or miss — try to fetch fresh data
  try {
    const weather = await fetchWeather(latitude, longitude)

    await stub.fetch(new Request('https://do/cache', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: cacheKey, data: weather, ttl: CACHE_TTL }),
    }))

    return c.json(weather)
  } catch (err) {
    // If we have stale data and the API failed, serve stale
    if (isStale) {
      return c.json(cached.data)
    }
    throw err
  }
})
