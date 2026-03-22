export type WeatherCondition =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'freezing-rain'
  | 'snow'
  | 'showers'
  | 'thunderstorm'

interface WeatherCodeInfo {
  condition: WeatherCondition
  label: string
}

const WEATHER_CODE_MAP: Record<number, WeatherCodeInfo> = {
  0: { condition: 'clear', label: 'Clear sky' },
  1: { condition: 'clear', label: 'Mainly clear' },
  2: { condition: 'partly-cloudy', label: 'Partly cloudy' },
  3: { condition: 'cloudy', label: 'Overcast' },
  45: { condition: 'fog', label: 'Fog' },
  48: { condition: 'fog', label: 'Depositing rime fog' },
  51: { condition: 'drizzle', label: 'Light drizzle' },
  53: { condition: 'drizzle', label: 'Moderate drizzle' },
  55: { condition: 'drizzle', label: 'Dense drizzle' },
  56: { condition: 'freezing-rain', label: 'Light freezing drizzle' },
  57: { condition: 'freezing-rain', label: 'Dense freezing drizzle' },
  61: { condition: 'rain', label: 'Slight rain' },
  63: { condition: 'rain', label: 'Moderate rain' },
  65: { condition: 'rain', label: 'Heavy rain' },
  66: { condition: 'freezing-rain', label: 'Light freezing rain' },
  67: { condition: 'freezing-rain', label: 'Heavy freezing rain' },
  71: { condition: 'snow', label: 'Slight snow fall' },
  73: { condition: 'snow', label: 'Moderate snow fall' },
  75: { condition: 'snow', label: 'Heavy snow fall' },
  77: { condition: 'snow', label: 'Snow grains' },
  80: { condition: 'showers', label: 'Slight rain showers' },
  81: { condition: 'showers', label: 'Moderate rain showers' },
  82: { condition: 'showers', label: 'Violent rain showers' },
  85: { condition: 'snow', label: 'Slight snow showers' },
  86: { condition: 'snow', label: 'Heavy snow showers' },
  95: { condition: 'thunderstorm', label: 'Thunderstorm' },
  96: { condition: 'thunderstorm', label: 'Thunderstorm with slight hail' },
  99: { condition: 'thunderstorm', label: 'Thunderstorm with heavy hail' },
}

export function getWeatherInfo(code: number): WeatherCodeInfo {
  return WEATHER_CODE_MAP[code] ?? { condition: 'clear', label: 'Unknown' }
}

export function getWeatherLabel(code: number): string {
  return getWeatherInfo(code).label
}

export function getWeatherCondition(code: number): WeatherCondition {
  return getWeatherInfo(code).condition
}
