import { useState, useEffect } from 'react'
import type { GeolocationResponse } from '@manta/shared'
import { apiGet } from '@/api/client'

interface GeolocationState {
  coords: { latitude: number; longitude: number } | null
  city: string | null
  isLoading: boolean
  error: string | null
  source: 'browser' | 'ip' | null
}

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    city: null,
    isLoading: true,
    error: null,
    source: null,
  })

  useEffect(() => {
    let cancelled = false

    async function detectLocation() {
      // Try browser geolocation first
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
            enableHighAccuracy: false,
            maximumAge: 10 * 60 * 1000,
          })
        })

        if (cancelled) return

        setState({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          city: null,
          isLoading: false,
          error: null,
          source: 'browser',
        })
        return
      } catch {
        // Browser geolocation failed, try IP fallback
      }

      // IP-based fallback via CF worker
      try {
        const geo = await apiGet<GeolocationResponse>('/api/geolocation')

        if (cancelled) return

        if (geo.latitude && geo.longitude) {
          setState({
            coords: { latitude: geo.latitude, longitude: geo.longitude },
            city: geo.city,
            isLoading: false,
            error: null,
            source: 'ip',
          })
          return
        }
      } catch {
        // IP fallback also failed
      }

      if (!cancelled) {
        setState({
          coords: null,
          city: null,
          isLoading: false,
          error: 'Unable to detect location. Please search for a city.',
          source: null,
        })
      }
    }

    detectLocation()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
