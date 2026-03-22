import { useQuery } from '@tanstack/react-query'
import type { GeocodedCity } from '@manta/shared'
import { apiGet } from '../client'
import { weatherKeys } from '../keys'

export function useGeocodeQuery(query: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: weatherKeys.geocode(query),
    queryFn: () => apiGet<GeocodedCity[]>('/api/geocode', { q: query }),
    enabled: (options?.enabled ?? true) && query.trim().length >= 2,
    staleTime: 60 * 60 * 1000,
  })
}
