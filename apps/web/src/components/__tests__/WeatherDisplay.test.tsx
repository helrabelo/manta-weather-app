import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { WeatherDisplay } from '@/components/weather/WeatherDisplay'
import type { WeatherData } from '@manta/shared'

const mockWeather: WeatherData = {
  temperature: 22,
  apparentTemperature: 20,
  humidity: 65,
  weatherCode: 2,
  isDay: true,
  windSpeed: 12,
  windDirection: 180,
  timezone: 'Europe/Oslo',
}

describe('WeatherDisplay', () => {
  it('renders city name and temperature', () => {
    render(<WeatherDisplay weather={mockWeather} cityName="Oslo" />)

    expect(screen.getByText('Oslo')).toBeInTheDocument()
    expect(screen.getByText('22°')).toBeInTheDocument()
  })

  it('renders weather details', () => {
    render(<WeatherDisplay weather={mockWeather} cityName="Oslo" />)

    expect(screen.getByText('65%')).toBeInTheDocument()
    expect(screen.getByText('12 km/h S')).toBeInTheDocument()
    expect(screen.getByText('20°')).toBeInTheDocument()
  })

  it('renders weather condition label', () => {
    render(<WeatherDisplay weather={mockWeather} cityName="Oslo" />)

    expect(screen.getByText('Partly cloudy')).toBeInTheDocument()
  })

  it('has accessible aria-label with full context', () => {
    render(<WeatherDisplay weather={mockWeather} cityName="Oslo" />)

    const region = screen.getByLabelText(/Current weather: 22 degrees Celsius in Oslo, Partly cloudy/i)
    expect(region).toBeInTheDocument()
  })

  it('renders weather icon with correct label', () => {
    render(<WeatherDisplay weather={mockWeather} cityName="Oslo" />)

    expect(screen.getByRole('img', { name: 'Partly cloudy' })).toBeInTheDocument()
  })
})
