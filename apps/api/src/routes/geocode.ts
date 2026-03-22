import { Hono } from 'hono'
import { searchCities } from '../services/open-meteo'

export const geocodeRoutes = new Hono()

geocodeRoutes.get('/geocode', async (c) => {
  const query = c.req.query('q')
  const count = c.req.query('count')

  if (!query || query.trim().length < 2) {
    return c.json({ error: 'q must be at least 2 characters', status: 400 }, 400)
  }

  const cities = await searchCities(query.trim(), count ? parseInt(count, 10) : 8)
  return c.json(cities)
})
