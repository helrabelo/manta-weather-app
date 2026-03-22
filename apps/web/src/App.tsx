import { useState, useCallback, useSyncExternalStore } from 'react'
import type { GeocodedCity, RecentSearch } from '@manta/shared'
import { AppShell } from '@/components/layout/AppShell'
import { CitySearch } from '@/components/search/CitySearch'
import { WeatherDisplay } from '@/components/weather/WeatherDisplay'
import { RecentSearches } from '@/components/recent/RecentSearches'
import { WeatherSkeleton } from '@/components/ui/WeatherSkeleton'
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

function App() {
  const geo = useGeolocation()
  const [selectedCoords, setSelectedCoords] = useState<{ latitude: number; longitude: number } | null>(null)
  const [cityName, setCityName] = useState<string | null>(null)

  const activeCoords = selectedCoords ?? geo.coords
  const { data: weather, isLoading: weatherLoading, isError: weatherError } = useWeatherQuery(activeCoords)
  const { recentSearches, addSearch } = useRecentSearches()

  const displayName = cityName ?? geo.city ?? 'Your location'

  const handleCitySelect = useCallback(
    async (city: GeocodedCity) => {
      setSelectedCoords({ latitude: city.latitude, longitude: city.longitude })
      setCityName(city.name)
      await addSearch(city)
    },
    [addSearch],
  )

  const handleRecentSelect = useCallback((search: RecentSearch) => {
    setSelectedCoords({ latitude: search.latitude, longitude: search.longitude })
    setCityName(search.cityName)
  }, [])

  const prefersDark = usePrefersDark()
  const theme = getWeatherTheme(weather?.weatherCode, weather?.isDay, prefersDark)

  return (
    <div className={`${theme.bg} transition-all duration-1000`}>
      <AppShell
        header={
          <>
            <h1 className={`text-lg font-bold select-none drop-shadow-sm ${theme.isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              MantaWeather
            </h1>
            <CitySearch onSelect={handleCitySelect} isDark={theme.isDark} />
          </>
        }
        main={
          geo.isLoading || weatherLoading ? (
            <WeatherSkeleton />
          ) : weatherError ? (
            <div className={`text-center ${theme.isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <p className="text-lg font-medium mb-2">Unable to load weather</p>
              <p className="text-sm">Try searching for a city above</p>
            </div>
          ) : geo.error && !weather ? (
            <div className={`text-center ${theme.isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <p className="text-lg font-medium mb-2">{geo.error}</p>
            </div>
          ) : weather ? (
            <WeatherDisplay weather={weather} cityName={displayName} isDark={theme.isDark} />
          ) : null
        }
        footer={<RecentSearches searches={recentSearches} onSelect={handleRecentSelect} isDark={theme.isDark} />}
      />
    </div>
  )
}

export default App
