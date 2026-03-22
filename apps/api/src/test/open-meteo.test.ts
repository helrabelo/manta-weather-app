import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchWeather, searchCities } from '../services/open-meteo'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('open-meteo service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchWeather', () => {
    it('fetches weather data and transforms response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          current: {
            temperature_2m: 22.4,
            relative_humidity_2m: 65,
            apparent_temperature: 20.1,
            is_day: 1,
            weather_code: 2,
            wind_speed_10m: 12.3,
            wind_direction_10m: 180,
          },
          timezone: 'Europe/Oslo',
        }),
      })

      const result = await fetchWeather(59.91, 10.75)

      expect(result).toEqual({
        temperature: 22,
        apparentTemperature: 20,
        humidity: 65,
        weatherCode: 2,
        isDay: true,
        windSpeed: 12,
        windDirection: 180,
        timezone: 'Europe/Oslo',
      })

      expect(mockFetch).toHaveBeenCalledOnce()
      const url = mockFetch.mock.calls[0][0] as string
      expect(url).toContain('api.open-meteo.com')
      expect(url).toContain('latitude=59.91')
      expect(url).toContain('longitude=10.75')
    })

    it('throws on API error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      await expect(fetchWeather(0, 0)).rejects.toThrow('Weather API error: 500')
    })
  })

  describe('searchCities', () => {
    it('searches cities and transforms response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            {
              id: 3143244,
              name: 'Oslo',
              latitude: 59.91,
              longitude: 10.75,
              country: 'Norway',
              country_code: 'NO',
              admin1: 'Oslo',
              population: 580000,
            },
          ],
        }),
      })

      const result = await searchCities('Oslo')

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        id: 3143244,
        name: 'Oslo',
        latitude: 59.91,
        longitude: 10.75,
        country: 'Norway',
        countryCode: 'NO',
        admin1: 'Oslo',
        population: 580000,
      })
    })

    it('returns empty array when no results', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

      const result = await searchCities('xyznotacity')
      expect(result).toEqual([])
    })

    it('throws on API error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
      })

      await expect(searchCities('test')).rejects.toThrow('Geocoding API error: 400')
    })
  })
})
