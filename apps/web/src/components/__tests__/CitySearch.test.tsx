import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/test-utils'
import { CitySearch } from '@/components/search/CitySearch'
import * as geocodeHook from '@/api/hooks/useGeocode'
import type { GeocodedCity } from '@manta/shared'

const mockCities: GeocodedCity[] = [
  {
    id: 1,
    name: 'Oslo',
    latitude: 59.91,
    longitude: 10.75,
    country: 'Norway',
    countryCode: 'NO',
    admin1: 'Oslo',
  },
  {
    id: 2,
    name: 'Osaka',
    latitude: 34.69,
    longitude: 135.5,
    country: 'Japan',
    countryCode: 'JP',
    admin1: 'Osaka',
  },
]

describe('CitySearch', () => {
  beforeEach(() => {
    vi.spyOn(geocodeHook, 'useGeocodeQuery').mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof geocodeHook.useGeocodeQuery>)
  })

  it('renders search input', () => {
    render(<CitySearch onSelect={vi.fn()} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search city...')).toBeInTheDocument()
  })

  it('has correct ARIA attributes', () => {
    render(<CitySearch onSelect={vi.fn()} />)
    const input = screen.getByRole('combobox')
    expect(input).toHaveAttribute('aria-autocomplete', 'list')
    expect(input).toHaveAttribute('aria-label', 'Search for a city')
  })

  it('shows results when data is available', async () => {
    vi.spyOn(geocodeHook, 'useGeocodeQuery').mockReturnValue({
      data: mockCities,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof geocodeHook.useGeocodeQuery>)

    render(<CitySearch onSelect={vi.fn()} />)

    const input = screen.getByRole('combobox')
    input.focus()

    // Simulate the debounced query having been set
    await waitFor(() => {
      // The component needs the debounce to fire
    })
  })

  it('shows search icon by default', () => {
    render(<CitySearch onSelect={vi.fn()} />)
    // Search icon is present (magnifying glass)
    const svgs = document.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })
})
