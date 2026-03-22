import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { RecentSearches } from '@/components/recent/RecentSearches'
import type { RecentSearch } from '@manta/shared'

const mockSearches: RecentSearch[] = [
  {
    id: '59.91-10.75',
    cityName: 'Oslo',
    country: 'Norway',
    latitude: 59.91,
    longitude: 10.75,
    temperature: 25,
    weatherCode: 0,
    isDay: true,
    searchedAt: '2025-06-01T12:00:00Z',
  },
  {
    id: '40.71--74.01',
    cityName: 'New York',
    country: 'United States',
    latitude: 40.71,
    longitude: -74.01,
    temperature: 17,
    weatherCode: 3,
    isDay: true,
    searchedAt: '2025-06-01T11:00:00Z',
  },
]

describe('RecentSearches', () => {
  it('renders nothing when searches are empty', () => {
    const { container } = render(<RecentSearches searches={[]} onSelect={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders search cards', () => {
    render(<RecentSearches searches={mockSearches} onSelect={vi.fn()} />)

    expect(screen.getByText('Oslo')).toBeInTheDocument()
    expect(screen.getByText('25°')).toBeInTheDocument()
    expect(screen.getByText('New York')).toBeInTheDocument()
    expect(screen.getByText('17°')).toBeInTheDocument()
  })

  it('renders section heading', () => {
    render(<RecentSearches searches={mockSearches} onSelect={vi.fn()} />)

    expect(screen.getByText('Recent searches')).toBeInTheDocument()
  })

  it('calls onSelect when a card is clicked', () => {
    const onSelect = vi.fn()
    render(<RecentSearches searches={mockSearches} onSelect={onSelect} />)

    screen.getByLabelText(/Oslo/).click()
    expect(onSelect).toHaveBeenCalledWith(mockSearches[0])
  })

  it('has accessible region label', () => {
    render(<RecentSearches searches={mockSearches} onSelect={vi.fn()} />)

    expect(screen.getByRole('region', { name: /recent city searches/i })).toBeInTheDocument()
  })
})
