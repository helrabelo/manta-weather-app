import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { weatherRoutes } from './routes/weather'
import { geocodeRoutes } from './routes/geocode'
import { recentRoutes } from './routes/recent'
import { wsRoutes } from './routes/ws'
import { geolocationRoutes } from './routes/geolocation'
import { rateLimit } from './middleware/rate-limit'

export { WeatherStore } from './durable-objects/WeatherStore'

type Bindings = {
  WEATHER_STORE: DurableObjectNamespace
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/*', cors())
app.use('/api/*', rateLimit)

app.get('/api/health', (c) => c.json({ status: 'ok' }))

app.route('/api', weatherRoutes)
app.route('/api', geocodeRoutes)
app.route('/api', recentRoutes)
app.route('/api', wsRoutes)
app.route('/api', geolocationRoutes)

export default app
