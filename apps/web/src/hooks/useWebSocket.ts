import { useEffect, useRef, useState, useCallback } from 'react'

type WSStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

interface UseWebSocketOptions {
  onMessage: (data: unknown) => void
  reconnectInterval?: number
  maxRetries?: number
}

export function useWebSocket(url: string, options: UseWebSocketOptions) {
  const { onMessage, reconnectInterval = 3000, maxRetries = 5 } = options
  const [status, setStatus] = useState<WSStatus>('disconnected')
  const wsRef = useRef<WebSocket | null>(null)
  const retriesRef = useRef(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const onMessageRef = useRef(onMessage)
  onMessageRef.current = onMessage

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    setStatus('connecting')
    const ws = new WebSocket(url)

    ws.onopen = () => {
      setStatus('connected')
      retriesRef.current = 0
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string)
        onMessageRef.current(data)
      } catch {
        // Ignore malformed messages
      }
    }

    ws.onclose = () => {
      setStatus('disconnected')
      wsRef.current = null

      if (retriesRef.current < maxRetries) {
        const delay = reconnectInterval * Math.pow(2, retriesRef.current)
        retriesRef.current++
        timeoutRef.current = setTimeout(connect, delay)
      }
    }

    ws.onerror = () => {
      setStatus('error')
      ws.close()
    }

    wsRef.current = ws
  }, [url, reconnectInterval, maxRetries])

  useEffect(() => {
    connect()

    return () => {
      clearTimeout(timeoutRef.current)
      wsRef.current?.close()
      wsRef.current = null
    }
  }, [connect])

  const send = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data))
    }
  }, [])

  return { status, send }
}
