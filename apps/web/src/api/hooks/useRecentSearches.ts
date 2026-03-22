import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import type { RecentSearch, GeocodedCity, WSMessage } from '@manta/shared'
import { apiGet, apiPost } from '../client'
import { weatherKeys } from '../keys'
import { useWebSocket } from '@/hooks/useWebSocket'

export function useRecentSearches() {
  const queryClient = useQueryClient()

  const { data: recentSearches = [], isLoading } = useQuery({
    queryKey: weatherKeys.recent(),
    queryFn: () => apiGet<RecentSearch[]>('/api/recent'),
  })

  const handleWsMessage = useCallback(
    (raw: unknown) => {
      const msg = raw as WSMessage
      if (msg.type === 'recent:initial' || msg.type === 'recent:update') {
        queryClient.setQueryData(weatherKeys.recent(), msg.payload)
      }
    },
    [queryClient],
  )

  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const apiBase = import.meta.env.VITE_API_URL
  const wsUrl = apiBase
    ? `${wsProtocol}//${new URL(apiBase).host}/api/ws`
    : `${wsProtocol}//${window.location.host}/api/ws`

  const { status: wsStatus } = useWebSocket(wsUrl, { onMessage: handleWsMessage })

  useEffect(() => {
    if (wsStatus === 'connected') {
      queryClient.invalidateQueries({ queryKey: weatherKeys.recent() })
    }
  }, [wsStatus, queryClient])

  const addSearch = useCallback(
    async (city: GeocodedCity) => {
      const result = await apiPost<RecentSearch>('/api/recent', {
        cityName: city.name,
        country: city.country,
        latitude: city.latitude,
        longitude: city.longitude,
      })
      // Optimistically update if WS is not connected
      if (wsStatus !== 'connected') {
        queryClient.setQueryData(weatherKeys.recent(), (old: RecentSearch[] = []) => {
          const filtered = old.filter((r) => r.id !== result.id)
          return [result, ...filtered].slice(0, 20)
        })
      }
      return result
    },
    [queryClient, wsStatus],
  )

  return { recentSearches, addSearch, isLoading, wsStatus }
}
