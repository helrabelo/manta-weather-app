import type { DailyForecast as DailyForecastData } from '@manta/shared'
import { WeatherIcon } from './WeatherIcon'
import { formatTemperature } from '@/lib/format'
import { getWeatherLabel } from '@/lib/weather-codes'
import { useUnits } from '@/context/UnitsContext'

interface DailyForecastProps {
  days: DailyForecastData[]
  isDark?: boolean
}

function formatDay(dateStr: string, index: number): string {
  if (index === 0) return 'Today'
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString([], { weekday: 'short' })
}

export function DailyForecast({ days, isDark = false }: DailyForecastProps) {
  const { units } = useUnits()
  const primary = isDark ? 'text-gray-100' : 'text-gray-900'
  const secondary = isDark ? 'text-gray-400' : 'text-gray-500'

  if (!days.length) return null

  return (
    <div className="w-full">
      <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${secondary}`}>7-day forecast</h3>
      <div className="flex flex-col gap-1">
        {days.map((day, i) => (
          <div
            key={day.date}
            className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg ${
              i === 0
                ? isDark ? 'bg-white/10' : 'bg-black/5'
                : ''
            }`}
          >
            <span className={`text-sm w-10 sm:w-12 flex-shrink-0 ${primary}`}>
              {formatDay(day.date, i)}
            </span>
            <WeatherIcon code={day.weatherCode} isDay={true} size="sm" />
            <span className={`text-xs flex-1 truncate hidden sm:inline ${secondary}`} title={getWeatherLabel(day.weatherCode)}>
              {getWeatherLabel(day.weatherCode)}
            </span>
            <div className="flex gap-2 text-sm flex-shrink-0" style={{ fontVariantNumeric: 'tabular-nums' }}>
              <span className={primary}>{formatTemperature(day.temperatureMax, units)}</span>
              <span className={secondary}>{formatTemperature(day.temperatureMin, units)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
