import type { WeatherData, GeocodedCity, HourlyForecast, DailyForecast } from '@manta/shared'

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
  hourly?: {
    time: string[]
    temperature_2m: number[]
    weather_code: number[]
    is_day: number[]
  }
  daily?: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    weather_code: number[]
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
    hourly: ['temperature_2m', 'weather_code', 'is_day'].join(','),
    daily: ['temperature_2m_max', 'temperature_2m_min', 'weather_code'].join(','),
    forecast_days: '7',
    timezone: 'auto',
  })

  const res = await fetch(`${WEATHER_API}?${params}`)

  if (!res.ok) {
    throw new Error(`Weather API error: ${res.status}`)
  }

  const data: OpenMeteoWeatherResponse = await res.json()

  // Build next 24 hours from the current hour
  const nowHour = new Date().toISOString().slice(0, 13)
  let hourly: HourlyForecast[] = []
  if (data.hourly) {
    const startIdx = data.hourly.time.findIndex((t) => t.slice(0, 13) >= nowHour)
    if (startIdx >= 0) {
      hourly = data.hourly.time.slice(startIdx, startIdx + 24).map((time, i) => ({
        time,
        temperature: Math.round(data.hourly!.temperature_2m[startIdx + i]),
        weatherCode: data.hourly!.weather_code[startIdx + i],
        isDay: data.hourly!.is_day[startIdx + i] === 1,
      }))
    }
  }

  let daily: DailyForecast[] = []
  if (data.daily) {
    daily = data.daily.time.map((date, i) => ({
      date,
      temperatureMax: Math.round(data.daily!.temperature_2m_max[i]),
      temperatureMin: Math.round(data.daily!.temperature_2m_min[i]),
      weatherCode: data.daily!.weather_code[i],
    }))
  }

  return {
    temperature: Math.round(data.current.temperature_2m),
    apparentTemperature: Math.round(data.current.apparent_temperature),
    humidity: data.current.relative_humidity_2m,
    weatherCode: data.current.weather_code,
    isDay: data.current.is_day === 1,
    windSpeed: Math.round(data.current.wind_speed_10m),
    windDirection: data.current.wind_direction_10m,
    timezone: data.timezone,
    hourly,
    daily,
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
