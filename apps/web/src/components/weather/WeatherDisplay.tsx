import type { WeatherData } from '@manta/shared'
import { WeatherIcon } from './WeatherIcon'
import { formatTemperature, formatWindDirection } from '@/lib/format'
import { getWeatherLabel } from '@/lib/weather-codes'

interface WeatherDisplayProps {
  weather: WeatherData
  cityName: string
}

export function WeatherDisplay({ weather, cityName }: WeatherDisplayProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2"
      aria-live="polite"
      aria-label={`Current weather: ${Math.round(weather.temperature)} degrees Celsius in ${cityName}, ${getWeatherLabel(weather.weatherCode)}`}
    >
      <WeatherIcon code={weather.weatherCode} isDay={weather.isDay} size="lg" />

      <p className="text-lg md:text-xl font-medium text-gray-800 dark:text-gray-200">
        {cityName}
      </p>

      <p
        className="text-[clamp(5rem,15vw,10rem)] font-extralight leading-none tracking-tight text-gray-900 dark:text-gray-100"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {formatTemperature(weather.temperature)}
      </p>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {getWeatherLabel(weather.weatherCode)}
      </p>

      <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1.5" title="Humidity">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
          </svg>
          <span>{weather.humidity}%</span>
        </div>

        <div className="flex items-center gap-1.5" title="Wind">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{weather.windSpeed} km/h {formatWindDirection(weather.windDirection)}</span>
        </div>

        <div className="flex items-center gap-1.5" title="Feels like">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" />
          </svg>
          <span>{formatTemperature(weather.apparentTemperature)}</span>
        </div>
      </div>
    </div>
  )
}
