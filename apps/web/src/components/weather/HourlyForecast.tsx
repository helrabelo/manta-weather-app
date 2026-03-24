import type { HourlyForecast as HourlyForecastData } from '@manta/shared'
import { WeatherIcon } from './WeatherIcon'
import { formatTemperature } from '@/lib/format'
import { useUnits } from '@/context/UnitsContext'

interface HourlyForecastProps {
  hours: HourlyForecastData[]
  isDark?: boolean
}

function formatHour(isoTime: string): string {
  const date = new Date(isoTime)
  return date.toLocaleTimeString([], { hour: 'numeric', hour12: true })
}

export function HourlyForecast({ hours, isDark = false }: HourlyForecastProps) {
  const { units } = useUnits()
  const primary = isDark ? 'text-gray-100' : 'text-gray-900'
  const secondary = isDark ? 'text-gray-400' : 'text-gray-500'

  if (!hours.length) return null

  return (
    <div className="w-full">
      <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${secondary}`}>Next 24 hours</h3>
      <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-2">
        {hours.map((hour, i) => (
          <div
            key={hour.time}
            className={`flex flex-col items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg flex-shrink-0 ${
              i === 0
                ? isDark ? 'bg-white/10' : 'bg-black/5'
                : ''
            }`}
          >
            <span className={`text-xs ${i === 0 ? primary : secondary}`}>
              {i === 0 ? 'Now' : formatHour(hour.time)}
            </span>
            <WeatherIcon code={hour.weatherCode} isDay={hour.isDay} size="sm" />
            <span className={`text-sm font-medium ${primary}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
              {formatTemperature(hour.temperature, units)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
