import type { RecentSearch, WSMessage } from '@manta/shared'

export class WeatherStore implements DurableObject {
  private state: DurableObjectState

  constructor(state: DurableObjectState) {
    this.state = state
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/ws') {
      if (request.headers.get('Upgrade') !== 'websocket') {
        return new Response('Expected WebSocket', { status: 426 })
      }

      const pair = new WebSocketPair()
      this.state.acceptWebSocket(pair[1])

      const recent = await this.getRecentSearches()
      const msg: WSMessage = { type: 'recent:initial', payload: recent }
      pair[1].send(JSON.stringify(msg))

      return new Response(null, { status: 101, webSocket: pair[0] })
    }

    if (url.pathname === '/recent' && request.method === 'GET') {
      const recent = await this.getRecentSearches()
      return Response.json(recent)
    }

    if (url.pathname === '/recent' && request.method === 'POST') {
      const search = (await request.json()) as RecentSearch
      await this.addRecentSearch(search)
      return Response.json(search)
    }

    if (url.pathname === '/cache' && request.method === 'GET') {
      const key = url.searchParams.get('key')
      if (!key) return Response.json(null)
      const cached = await this.state.storage.get<string>(key)
      return Response.json(cached ? JSON.parse(cached) : null)
    }

    if (url.pathname === '/cache' && request.method === 'PUT') {
      const { key, data, ttl } = (await request.json()) as {
        key: string
        data: unknown
        ttl: number
      }
      await this.state.storage.put(key, JSON.stringify({ data, expiresAt: Date.now() + ttl }))
      return Response.json({ ok: true })
    }

    return new Response('Not found', { status: 404 })
  }

  async webSocketMessage(_ws: WebSocket, _message: string | ArrayBuffer): Promise<void> {
    // Clients don't send messages in this protocol — they only receive updates
  }

  async webSocketClose(ws: WebSocket, _code: number, _reason: string, _wasClean: boolean) {
    ws.close()
  }

  async webSocketError(ws: WebSocket, _error: unknown) {
    ws.close()
  }

  private async getRecentSearches(): Promise<RecentSearch[]> {
    const recent = await this.state.storage.get<RecentSearch[]>('recent:searches')
    return recent ?? []
  }

  private async addRecentSearch(search: RecentSearch): Promise<void> {
    const recent = await this.getRecentSearches()
    const filtered = recent.filter((r) => r.id !== search.id)
    const updated = [search, ...filtered].slice(0, 20)
    await this.state.storage.put('recent:searches', updated)
    this.broadcastRecentSearches(updated)
  }

  private broadcastRecentSearches(searches: RecentSearch[]): void {
    const msg: WSMessage = { type: 'recent:update', payload: searches }
    const data = JSON.stringify(msg)
    for (const ws of this.state.getWebSockets()) {
      try {
        ws.send(data)
      } catch {
        // Client disconnected, will be cleaned up
      }
    }
  }
}
