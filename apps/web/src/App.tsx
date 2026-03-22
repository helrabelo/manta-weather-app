import { useState, useCallback } from 'react'
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

function getBackgroundClass(weatherCode?: number, isDay?: boolean): string {
  if (weatherCode == null || isDay == null) return 'bg-gray-200 dark:bg-gray-900'

  const condition = getWeatherCondition(weatherCode)

  if (!isDay) return 'bg-gradient-to-b from-slate-800 to-slate-900'

  switch (condition) {
    case 'clear':
      return 'bg-gradient-to-b from-sky-200 to-sky-100'
    case 'partly-cloudy':
      return 'bg-gradient-to-b from-sky-200 to-gray-200'
    case 'cloudy':
      return 'bg-gradient-to-b from-gray-300 to-gray-200'
    case 'fog':
      return 'bg-gradient-to-b from-gray-300 to-gray-100'
    case 'drizzle':
    case 'rain':
    case 'freezing-rain':
    case 'showers':
      return 'bg-gradient-to-b from-slate-400 to-slate-300'
    case 'snow':
      return 'bg-gradient-to-b from-blue-100 to-gray-100'
    case 'thunderstorm':
      return 'bg-gradient-to-b from-slate-600 to-slate-400'
    default:
      return 'bg-gray-200 dark:bg-gray-900'
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

  const bgClass = getBackgroundClass(weather?.weatherCode, weather?.isDay)

  return (
    <div className={`${bgClass} transition-all duration-1000`}>
      <AppShell
        header={
          <>
            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200 select-none">
              MantaWeather
            </h1>
            <CitySearch onSelect={handleCitySelect} />
          </>
        }
        main={
          geo.isLoading || weatherLoading ? (
            <WeatherSkeleton />
          ) : weatherError ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg mb-2">Unable to load weather</p>
              <p className="text-sm">Try searching for a city above</p>
            </div>
          ) : geo.error && !weather ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg mb-2">{geo.error}</p>
            </div>
          ) : weather ? (
            <WeatherDisplay weather={weather} cityName={displayName} />
          ) : null
        }
        footer={<RecentSearches searches={recentSearches} onSelect={handleRecentSelect} />}
      />
    </div>
  )
}

export default App
