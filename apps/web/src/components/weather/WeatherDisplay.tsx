import type { WeatherData } from '@manta/shared'
import { WeatherIcon } from './WeatherIcon'
import { HourlyForecast } from './HourlyForecast'
import { DailyForecast } from './DailyForecast'
import { formatTemperature, formatWindSpeed, formatWindDirection } from '@/lib/format'
import { getWeatherLabel } from '@/lib/weather-codes'
import { useUnits } from '@/context/UnitsContext'

interface WeatherDisplayProps {
  weather: WeatherData
  cityName: string
  isDark?: boolean
}

export function WeatherDisplay({ weather, cityName, isDark = false }: WeatherDisplayProps) {
  const { units } = useUnits()
  const primary = isDark ? 'text-gray-100' : 'text-gray-900'
  const secondary = isDark ? 'text-gray-300' : 'text-gray-700'

  return (
    <div
      className="flex flex-col items-center justify-center gap-2"
      aria-live="polite"
      aria-label={`Current weather: ${Math.round(units === 'imperial' ? weather.temperature * 9 / 5 + 32 : weather.temperature)} degrees ${units === 'imperial' ? 'Fahrenheit' : 'Celsius'} in ${cityName}, ${getWeatherLabel(weather.weatherCode)}`}
    >
      <div className="animate-weather-enter" style={{ animationDelay: '0ms' }}>
        <WeatherIcon code={weather.weatherCode} isDay={weather.isDay} size="lg" />
      </div>

      <p className={`animate-weather-enter text-lg md:text-xl font-semibold drop-shadow-sm ${primary}`} style={{ animationDelay: '75ms' }}>
        {cityName}
      </p>

      <p
        className={`animate-weather-enter text-[clamp(5rem,15vw,10rem)] font-light leading-none tracking-tight drop-shadow-sm ${primary}`}
        style={{ fontVariantNumeric: 'tabular-nums', animationDelay: '150ms' }}
      >
        {formatTemperature(weather.temperature, units)}
      </p>

      <p className={`animate-weather-enter text-sm font-medium mb-4 ${secondary}`} style={{ animationDelay: '225ms' }}>
        {getWeatherLabel(weather.weatherCode)}
      </p>

      <div className={`animate-weather-enter flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm ${secondary}`} style={{ animationDelay: '300ms' }}>
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
          <span>{formatWindSpeed(weather.windSpeed, units)} {formatWindDirection(weather.windDirection)}</span>
        </div>

        <div className="flex items-center gap-1.5" title="Feels like">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" />
          </svg>
          <span>{formatTemperature(weather.apparentTemperature, units)}</span>
        </div>
      </div>

      {weather.hourly && weather.hourly.length > 0 && (
        <div className="animate-weather-enter w-full max-w-lg mt-6 -mx-4 px-4 sm:mx-0 sm:px-0" style={{ animationDelay: '400ms' }}>
          <HourlyForecast hours={weather.hourly} isDark={isDark} />
        </div>
      )}

      {weather.daily && weather.daily.length > 0 && (
        <div className="animate-weather-enter w-full max-w-lg mt-4" style={{ animationDelay: '500ms' }}>
          <DailyForecast days={weather.daily} isDark={isDark} />
        </div>
      )}
    </div>
  )
}
