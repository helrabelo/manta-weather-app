import type { CSSProperties } from 'react'
import type { RecentSearch } from '@manta/shared'
import { WeatherIcon } from '@/components/weather/WeatherIcon'
import { formatTemperature } from '@/lib/format'

interface RecentSearchCardProps {
  search: RecentSearch
  onSelect: (search: RecentSearch) => void
  style?: CSSProperties
}

export function RecentSearchCard({ search, onSelect, style }: RecentSearchCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(search)}
      className="flex items-center justify-between gap-3 min-w-[160px] md:min-w-[180px] snap-start rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm px-4 py-3 border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 animate-slide-in"
      style={style}
      aria-label={`${search.cityName}: ${Math.round(search.temperature)} degrees`}
    >
      <div className="text-left">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate max-w-[100px]">
          {search.cityName}
        </p>
        <p
          className="text-lg font-light text-gray-700 dark:text-gray-300"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {formatTemperature(search.temperature)}
        </p>
      </div>
      <WeatherIcon code={search.weatherCode} isDay={search.isDay} size="sm" />
    </button>
  )
}
