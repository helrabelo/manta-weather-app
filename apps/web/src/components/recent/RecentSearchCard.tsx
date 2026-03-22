import type { CSSProperties } from 'react'
import type { RecentSearch } from '@manta/shared'
import { WeatherIcon } from '@/components/weather/WeatherIcon'
import { formatTemperature } from '@/lib/format'

interface RecentSearchCardProps {
  search: RecentSearch
  onSelect: (search: RecentSearch) => void
  isDark?: boolean
  style?: CSSProperties
}

export function RecentSearchCard({ search, onSelect, isDark = false, style }: RecentSearchCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(search)}
      className={`flex items-center justify-between gap-3 min-w-[160px] md:min-w-[180px] snap-start rounded-xl backdrop-blur-sm px-4 py-3 shadow-sm transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 animate-slide-in ${
        isDark
          ? 'bg-white/10 border border-white/15 hover:bg-white/15'
          : 'bg-white/80 border border-gray-300/60 hover:bg-white/95'
      }`}
      style={style}
      aria-label={`${search.cityName}: ${Math.round(search.temperature)} degrees`}
    >
      <div className="text-left">
        <p className={`text-sm font-semibold truncate max-w-[100px] ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
          {search.cityName}
        </p>
        <p
          className={`text-lg font-light ${isDark ? 'text-gray-200' : 'text-gray-800'}`}
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {formatTemperature(search.temperature)}
        </p>
      </div>
      <WeatherIcon code={search.weatherCode} isDay={search.isDay} size="sm" />
    </button>
  )
}
