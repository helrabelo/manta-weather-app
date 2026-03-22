import type { WeatherData, GeocodedCity } from '@manta/shared'

const WEATHER_API = 'https://api.open-meteo.com/v1/forecast'
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search'

interface OpenMeteoWeatherResponse {
  current: {
    temperature_2m: number
    relative_humidity_2m: number
    apparent_temperature: number
    is_day: number
    weather_code: number
    wind_speed_10m: number
    wind_direction_10m: number
  }
  timezone: string
}

interface OpenMeteoGeocodingResponse {
  results?: Array<{
    id: number
    name: string
    latitude: number
    longitude: number
    country: string
    country_code: string
    admin1?: string
    population?: number
  }>
}

export async function fetchWeather(latitude: number, longitude: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
    ].join(','),
    timezone: 'auto',
  })

  const res = await fetch(`${WEATHER_API}?${params}`)

  if (!res.ok) {
    throw new Error(`Weather API error: ${res.status}`)
  }

  const data: OpenMeteoWeatherResponse = await res.json()

  return {
    temperature: Math.round(data.current.temperature_2m),
    apparentTemperature: Math.round(data.current.apparent_temperature),
    humidity: data.current.relative_humidity_2m,
    weatherCode: data.current.weather_code,
    isDay: data.current.is_day === 1,
    windSpeed: Math.round(data.current.wind_speed_10m),
    windDirection: data.current.wind_direction_10m,
    timezone: data.timezone,
  }
}

export async function searchCities(
  query: string,
  count: number = 8,
): Promise<GeocodedCity[]> {
  const params = new URLSearchParams({
    name: query,
    count: count.toString(),
    language: 'en',
    format: 'json',
  })

  const res = await fetch(`${GEOCODING_API}?${params}`)

  if (!res.ok) {
    throw new Error(`Geocoding API error: ${res.status}`)
  }

  const data: OpenMeteoGeocodingResponse = await res.json()

  return (data.results ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country,
    countryCode: r.country_code,
    admin1: r.admin1,
    population: r.population,
  }))
}
