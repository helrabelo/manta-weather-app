import { getWeatherCondition, getWeatherLabel } from '@/lib/weather-codes'
import {
  ClearDay,
  ClearNight,
  PartlyCloudy,
  Cloudy,
  Fog,
  Drizzle,
  Rain,
  Snow,
  Showers,
  Thunderstorm,
} from '@/icons'

interface WeatherIconProps {
  code: number
  isDay: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-28 h-28 sm:w-40 sm:h-40 md:w-52 md:h-52',
}

export function WeatherIcon({ code, isDay, className = '', size = 'lg' }: WeatherIconProps) {
  const condition = getWeatherCondition(code)
  const label = getWeatherLabel(code)
  const sizeClass = sizeClasses[size]
  const combinedClass = `${sizeClass} ${className}`

  const Icon = getIconComponent(condition, isDay)

  return (
    <div role="img" aria-label={label}>
      <Icon className={combinedClass} />
    </div>
  )
}

function getIconComponent(condition: string, isDay: boolean) {
  switch (condition) {
    case 'clear':
      return isDay ? ClearDay : ClearNight
    case 'partly-cloudy':
      return ({ className }: { className?: string }) => (
        <PartlyCloudy className={className} isDay={isDay} />
      )
    case 'cloudy':
      return Cloudy
    case 'fog':
      return Fog
    case 'drizzle':
      return Drizzle
    case 'rain':
    case 'freezing-rain':
      return Rain
    case 'snow':
      return Snow
    case 'showers':
      return Showers
    case 'thunderstorm':
      return Thunderstorm
    default:
      return isDay ? ClearDay : ClearNight
  }
}
