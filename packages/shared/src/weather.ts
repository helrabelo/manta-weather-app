export interface WeatherData {
  temperature: number
  apparentTemperature: number
  humidity: number
  weatherCode: number
  isDay: boolean
  windSpeed: number
  windDirection: number
  timezone: string
  hourly?: HourlyForecast[]
  daily?: DailyForecast[]
}

export interface HourlyForecast {
  time: string
  temperature: number
  weatherCode: number
  isDay: boolean
}

export interface DailyForecast {
  date: string
  temperatureMax: number
  temperatureMin: number
  weatherCode: number
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
