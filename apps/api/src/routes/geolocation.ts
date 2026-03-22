import { Hono } from 'hono'
import type { GeolocationResponse } from '@manta/shared'

export const geolocationRoutes = new Hono()

geolocationRoutes.get('/geolocation', (c) => {
  const cf = (c.req.raw as unknown as { cf?: IncomingRequestCfProperties }).cf

  const response: GeolocationResponse = {
    latitude: cf?.latitude ? parseFloat(cf.latitude as string) : 0,
    longitude: cf?.longitude ? parseFloat(cf.longitude as string) : 0,
    city: (cf?.city as string) ?? 'Unknown',
    country: (cf?.country as string) ?? 'Unknown',
  }

  return c.json(response)
})
