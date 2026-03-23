import { Hono } from 'hono'
import type { AddRecentSearchRequest } from '@manta/shared'
import { fetchWeather } from '../services/open-meteo'

type Bindings = {
  WEATHER_STORE: DurableObjectNamespace
}

export const recentRoutes = new Hono<{ Bindings: Bindings }>()

recentRoutes.get('/recent', async (c) => {
  const id = c.env.WEATHER_STORE.idFromName('global')
  const stub = c.env.WEATHER_STORE.get(id)
  const res = await stub.fetch(new Request('https://do/recent'))
  const recent = await res.json()
  return c.json(recent)
})

recentRoutes.post('/recent', async (c) => {
  const body = await c.req.json<AddRecentSearchRequest>()

  if (!body.cityName || !body.country || body.latitude == null || body.longitude == null) {
    return c.json({ error: 'cityName, country, latitude, and longitude are required', status: 400 }, 400)
  }

  if (body.latitude < -90 || body.latitude > 90 || body.longitude < -180 || body.longitude > 180) {
    return c.json({ error: 'latitude must be between -90 and 90, longitude between -180 and 180', status: 400 }, 400)
  }

  // Fetch current weather for this city
  const weather = await fetchWeather(body.latitude, body.longitude)

  const search = {
    id: `${body.latitude.toFixed(4)}-${body.longitude.toFixed(4)}`,
    cityName: body.cityName,
    country: body.country,
    latitude: body.latitude,
    longitude: body.longitude,
    temperature: weather.temperature,
    weatherCode: weather.weatherCode,
    isDay: weather.isDay,
    searchedAt: new Date().toISOString(),
  }

  const doId = c.env.WEATHER_STORE.idFromName('global')
  const stub = c.env.WEATHER_STORE.get(doId)
  await stub.fetch(new Request('https://do/recent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(search),
  }))

  return c.json(search)
})
