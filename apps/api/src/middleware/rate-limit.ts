import type { Context, Next } from 'hono'

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 60 // 60 requests per minute per IP

export async function rateLimit(c: Context, next: Next) {
  const ip = c.req.header('cf-connecting-ip') ?? c.req.header('x-forwarded-for') ?? 'unknown'
  const now = Date.now()

  let entry = store.get(ip)

  if (!entry || now >= entry.resetAt) {
    entry = { count: 0, resetAt: now + WINDOW_MS }
    store.set(ip, entry)
  }

  entry.count++

  c.header('X-RateLimit-Limit', MAX_REQUESTS.toString())
  c.header('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS - entry.count).toString())
  c.header('X-RateLimit-Reset', Math.ceil(entry.resetAt / 1000).toString())

  if (entry.count > MAX_REQUESTS) {
    return c.json(
      { error: 'Too many requests. Please try again later.', status: 429 },
      429,
    )
  }

  await next()
}
