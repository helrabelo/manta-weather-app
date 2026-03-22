import { useQuery, keepPreviousData } from '@tanstack/react-query'
import type { WeatherData } from '@manta/shared'
import { apiGet } from '../client'
import { weatherKeys } from '../keys'

export function useWeatherQuery(coords: { latitude: number; longitude: number } | null) {
  return useQuery({
    queryKey: weatherKeys.current(coords?.latitude ?? 0, coords?.longitude ?? 0),
    queryFn: () =>
      apiGet<WeatherData>('/api/weather', {
        lat: coords!.latitude.toString(),
        lon: coords!.longitude.toString(),
      }),
    enabled: !!coords,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  })
}
