import { useQuery } from '@tanstack/react-query'
import type { GeolocationResponse } from '@manta/shared'
import { apiGet } from '@/api/client'

interface GeolocationData {
  coords: { latitude: number; longitude: number }
  city: string | null
  source: 'browser' | 'ip'
}

export function useGeolocation() {
  const { data, isLoading, error } = useQuery<GeolocationData>({
    queryKey: ['geolocation'],
    queryFn: async () => {
      // Try browser geolocation first
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
            enableHighAccuracy: false,
            maximumAge: 10 * 60 * 1000,
          })
        })
        return {
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          city: null,
          source: 'browser' as const,
        }
      } catch {
        // Browser geolocation failed, try IP fallback
      }

      // IP-based fallback via CF worker
      const geo = await apiGet<GeolocationResponse>('/api/geolocation')
      if (geo.latitude && geo.longitude) {
        return {
          coords: { latitude: geo.latitude, longitude: geo.longitude },
          city: geo.city,
          source: 'ip' as const,
        }
      }

      throw new Error('Unable to detect location. Please search for a city.')
    },
    staleTime: Infinity,
    retry: false,
  })

  return {
    coords: data?.coords ?? null,
    city: data?.city ?? null,
    isLoading,
    error: error instanceof Error ? error.message : null,
    source: data?.source ?? null,
  }
}
