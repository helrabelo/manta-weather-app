import type { Units } from '@/context/UnitsContext'

function celsiusToFahrenheit(c: number): number {
  return c * 9 / 5 + 32
}

function kmhToMph(kmh: number): number {
  return kmh * 0.621371
}

export function formatTemperature(temp: number, units: Units = 'metric'): string {
  const value = units === 'imperial' ? celsiusToFahrenheit(temp) : temp
  return `${Math.round(value)}°`
}

export function formatWindSpeed(speed: number, units: Units = 'metric'): string {
  if (units === 'imperial') {
    return `${Math.round(kmhToMph(speed))} mph`
  }
  return `${Math.round(speed)} km/h`
}

export function formatWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(degrees / 45) % 8
  return directions[index]
}
