import { forwardRef } from 'react'
import type { GeocodedCity } from '@manta/shared'

interface CitySearchResultsProps {
  cities: GeocodedCity[]
  isLoading: boolean
  isError: boolean
  activeIndex: number
  onSelect: (city: GeocodedCity) => void
  query: string
}

export const CitySearchResults = forwardRef<HTMLUListElement, CitySearchResultsProps>(
  function CitySearchResults({ cities, isLoading, isError, activeIndex, onSelect, query }, ref) {
    if (isLoading) {
      return (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-50">
          <p className="text-sm text-gray-400 text-center">Searching...</p>
        </div>
      )
    }

    if (isError) {
      return (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-50">
          <p className="text-sm text-red-400 text-center">Failed to search. Try again.</p>
        </div>
      )
    }

    if (query && cities.length === 0) {
      return (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-50">
          <p className="text-sm text-gray-400 text-center">No cities found</p>
        </div>
      )
    }

    if (cities.length === 0) return null

    return (
      <ul
        ref={ref}
        id="city-search-listbox"
        role="listbox"
        className="absolute top-full left-0 right-0 mt-1 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50 max-h-64 overflow-y-auto"
      >
        {cities.map((city, index) => (
          <li
            key={city.id}
            id={`city-option-${index}`}
            role="option"
            aria-selected={index === activeIndex}
            className={`px-4 py-2.5 cursor-pointer text-sm transition-colors ${
              index === activeIndex
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
            onMouseDown={(e) => {
              e.preventDefault()
              onSelect(city)
            }}
          >
            <span className="font-medium">{city.name}</span>
            <span className="text-gray-400 ml-1.5">
              {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
            </span>
          </li>
        ))}
      </ul>
    )
  },
)
