import { useState, useRef, useCallback, useEffect } from 'react'
import type { GeocodedCity } from '@manta/shared'
import { useGeocodeQuery } from '@/api/hooks/useGeocode'
import { CitySearchResults } from './CitySearchResults'

interface CitySearchProps {
  onSelect: (city: GeocodedCity) => void
  isDark?: boolean
}

export function CitySearch({ onSelect, isDark = false }: CitySearchProps) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listboxRef = useRef<HTMLUListElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const { data: cities = [], isLoading, isError } = useGeocodeQuery(debouncedQuery, {
    enabled: isOpen,
  })

  useEffect(() => {
    clearTimeout(debounceRef.current)
    if (query.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        setDebouncedQuery(query.trim())
        setIsOpen(true)
      }, 300)
    } else {
      setDebouncedQuery('')
      setIsOpen(false)
    }
    return () => clearTimeout(debounceRef.current)
  }, [query])

  const handleSelect = useCallback(
    (city: GeocodedCity) => {
      onSelect(city)
      setQuery('')
      setDebouncedQuery('')
      setIsOpen(false)
      setActiveIndex(-1)
      inputRef.current?.blur()
    },
    [onSelect],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || cities.length === 0) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setActiveIndex((prev) => (prev < cities.length - 1 ? prev + 1 : 0))
          break
        case 'ArrowUp':
          e.preventDefault()
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : cities.length - 1))
          break
        case 'Enter':
          e.preventDefault()
          if (activeIndex >= 0 && activeIndex < cities.length) {
            handleSelect(cities[activeIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          setIsOpen(false)
          setActiveIndex(-1)
          inputRef.current?.blur()
          break
      }
    },
    [isOpen, cities, activeIndex, handleSelect],
  )

  const handleBlur = useCallback(() => {
    // Delay to allow click events on results to fire
    setTimeout(() => setIsOpen(false), 200)
  }, [])

  const activeDescendant = activeIndex >= 0 ? `city-option-${activeIndex}` : undefined

  const inputClasses = isDark
    ? 'bg-white/10 text-gray-100 placeholder:text-gray-400 border-white/15'
    : 'bg-white/90 text-gray-900 placeholder:text-gray-500 border-gray-300'

  return (
    <div className="relative w-full max-w-xs">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="city-search-listbox"
          aria-activedescendant={activeDescendant}
          aria-autocomplete="list"
          aria-label="Search for a city"
          placeholder="Search city..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActiveIndex(-1)
          }}
          onFocus={() => {
            if (debouncedQuery.length >= 2) setIsOpen(true)
          }}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`w-full rounded-lg backdrop-blur-sm px-4 py-2.5 pr-10 text-sm border shadow-sm outline-none focus:ring-2 focus:ring-blue-400/50 transition-shadow ${inputClasses}`}
        />
        <div className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>
          {isLoading ? (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
          )}
        </div>
      </div>

      {isOpen && (
        <CitySearchResults
          ref={listboxRef}
          cities={cities}
          isLoading={isLoading}
          isError={isError}
          activeIndex={activeIndex}
          onSelect={handleSelect}
          query={debouncedQuery}
        />
      )}
    </div>
  )
}
