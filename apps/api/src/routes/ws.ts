import { Hono } from 'hono'

type Bindings = {
  WEATHER_STORE: DurableObjectNamespace
}

export const wsRoutes = new Hono<{ Bindings: Bindings }>()

wsRoutes.get('/ws', async (c) => {
  if (c.req.header('Upgrade') !== 'websocket') {
    return c.json({ error: 'Expected WebSocket upgrade', status: 426 }, 426)
  }

  const id = c.env.WEATHER_STORE.idFromName('global')
  const stub = c.env.WEATHER_STORE.get(id)

  return stub.fetch(new Request('https://do/ws', {
    headers: c.req.raw.headers,
  }))
})
