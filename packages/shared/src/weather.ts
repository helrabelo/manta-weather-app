export interface WeatherData {
  temperature: number
  apparentTemperature: number
  humidity: number
  weatherCode: number
  isDay: boolean
  windSpeed: number
  windDirection: number
  timezone: string
}

export interface GeocodedCity {
  id: number
  name: string
  latitude: number
  longitude: number
  country: string
  countryCode: string
  admin1?: string
  population?: number
}
