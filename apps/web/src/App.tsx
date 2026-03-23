import { useState, useCallback, useSyncExternalStore } from 'react'
import type { GeocodedCity, RecentSearch } from '@manta/shared'
import { AppShell } from '@/components/layout/AppShell'
import { CitySearch } from '@/components/search/CitySearch'
import { UnitToggle } from '@/components/UnitToggle'
import { WeatherDisplay } from '@/components/weather/WeatherDisplay'
import { RecentSearches } from '@/components/recent/RecentSearches'
import { WeatherSkeleton } from '@/components/ui/WeatherSkeleton'
import { ContentTransition } from '@/components/ui/ContentTransition'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useWeatherQuery } from '@/api/hooks/useWeather'
import { useRecentSearches } from '@/api/hooks/useRecentSearches'
import { getWeatherCondition } from '@/lib/weather-codes'

interface WeatherTheme {
  bg: string
  isDark: boolean
}

const darkMql = window.matchMedia('(prefers-color-scheme: dark)')
function subscribeDarkMode(cb: () => void) {
  darkMql.addEventListener('change', cb)
  return () => darkMql.removeEventListener('change', cb)
}
function usePrefersDark() {
  return useSyncExternalStore(subscribeDarkMode, () => darkMql.matches)
}

function getWeatherTheme(weatherCode: number | undefined, isDay: boolean | undefined, prefersDark: boolean): WeatherTheme {
  if (weatherCode == null || isDay == null) {
    return prefersDark
      ? { bg: 'bg-gray-900', isDark: true }
      : { bg: 'bg-gray-200', isDark: false }
  }

  const condition = getWeatherCondition(weatherCode)

  if (!isDay) return { bg: 'bg-gradient-to-b from-slate-800 to-slate-900', isDark: true }

  switch (condition) {
    case 'clear':
      return { bg: 'bg-gradient-to-b from-sky-300 to-sky-100', isDark: false }
    case 'partly-cloudy':
      return { bg: 'bg-gradient-to-b from-sky-300 to-gray-200', isDark: false }
    case 'cloudy':
      return { bg: 'bg-gradient-to-b from-gray-400 to-gray-300', isDark: false }
    case 'fog':
      return { bg: 'bg-gradient-to-b from-gray-400 to-gray-200', isDark: false }
    case 'drizzle':
    case 'rain':
    case 'freezing-rain':
    case 'showers':
      return { bg: 'bg-gradient-to-b from-slate-500 to-slate-400', isDark: true }
    case 'snow':
      return { bg: 'bg-gradient-to-b from-blue-200 to-gray-100', isDark: false }
    case 'thunderstorm':
      return { bg: 'bg-gradient-to-b from-slate-700 to-slate-500', isDark: true }
    default:
      return prefersDark
        ? { bg: 'bg-gray-900', isDark: true }
        : { bg: 'bg-gray-200', isDark: false }
  }
}

function getInitialFromUrl(): { coords: { latitude: number; longitude: number }; city: string } | null {
  const params = new URLSearchParams(window.location.search)
  const lat = params.get('lat')
  const lon = params.get('lon')
  const city = params.get('city')
  if (lat && lon && city) {
    const latitude = parseFloat(lat)
    const longitude = parseFloat(lon)
    if (!isNaN(latitude) && !isNaN(longitude)) {
      return { coords: { latitude, longitude }, city }
    }
  }
  return null
}

function updateUrl(city: string, latitude: number, longitude: number) {
  const url = new URL(window.location.href)
  url.searchParams.set('city', city)
  url.searchParams.set('lat', latitude.toFixed(4))
  url.searchParams.set('lon', longitude.toFixed(4))
  window.history.replaceState(null, '', url.toString())
}

function App() {
  const geo = useGeolocation()
  const urlState = getInitialFromUrl()
  const [selection, setSelection] = useState<{
    coords: { latitude: number; longitude: number }
    name: string
    previousName: string | null
  } | null>(urlState ? { coords: urlState.coords, name: urlState.city, previousName: null } : null)

  const activeCoords = selection?.coords ?? geo.coords
  const { data: weather, isLoading: weatherLoading, isError: weatherError, isPlaceholderData, dataUpdatedAt } = useWeatherQuery(activeCoords)
  const { recentSearches, addSearch } = useRecentSearches()

  const displayName = (isPlaceholderData
    ? (selection?.previousName ?? geo.city)
    : (selection?.name ?? geo.city)) ?? 'Your location'

  const transitionKey = (geo.isLoading || weatherLoading)
    ? 'loading'
    : weatherError
      ? 'error-weather'
      : (geo.error && !weather)
        ? 'error-geo'
        : `weather-${dataUpdatedAt}`

  const handleCitySelect = useCallback(
    async (city: GeocodedCity) => {
      setSelection((prev) => ({
        coords: { latitude: city.latitude, longitude: city.longitude },
        name: city.name,
        previousName: prev?.name ?? null,
      }))
      updateUrl(city.name, city.latitude, city.longitude)
      await addSearch(city)
    },
    [addSearch],
  )

  const handleRecentSelect = useCallback((search: RecentSearch) => {
    setSelection((prev) => ({
      coords: { latitude: search.latitude, longitude: search.longitude },
      name: search.cityName,
      previousName: prev?.name ?? null,
    }))
    updateUrl(search.cityName, search.latitude, search.longitude)
  }, [])

  const prefersDark = usePrefersDark()
  const theme = getWeatherTheme(weather?.weatherCode, weather?.isDay, prefersDark)

  return (
    <div className={`${theme.bg} transition-all duration-1000`}>
      <AppShell
        header={
          <>
            <div className="flex items-center gap-3">
              <h1 className={`text-lg font-bold select-none drop-shadow-sm ${theme.isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                MantaWeather
              </h1>
              <UnitToggle isDark={theme.isDark} />
            </div>
            <CitySearch onSelect={handleCitySelect} isDark={theme.isDark} />
          </>
        }
        main={
          <ContentTransition contentKey={transitionKey}>
            {geo.isLoading || weatherLoading ? (
              <WeatherSkeleton />
            ) : weatherError ? (
              <div className={`animate-fade-in text-center ${theme.isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <p className="text-lg font-medium mb-2">Unable to load weather</p>
                <p className="text-sm">Try searching for a city above</p>
              </div>
            ) : geo.error && !weather ? (
              <div className={`animate-fade-in text-center ${theme.isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <p className="text-lg font-medium mb-2">{geo.error}</p>
              </div>
            ) : weather ? (
              <WeatherDisplay weather={weather} cityName={displayName} isDark={theme.isDark} />
            ) : null}
          </ContentTransition>
        }
        footer={<RecentSearches searches={recentSearches} onSelect={handleRecentSelect} isDark={theme.isDark} />}
      />
    </div>
  )
}

export default App
