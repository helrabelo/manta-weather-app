import { useUnits } from '@/context/UnitsContext'

interface UnitToggleProps {
  isDark?: boolean
}

export function UnitToggle({ isDark = false }: UnitToggleProps) {
  const { units, toggleUnits } = useUnits()

  const active = isDark ? 'text-gray-100 font-semibold' : 'text-gray-900 font-semibold'
  const inactive = isDark ? 'text-gray-400' : 'text-gray-400'

  return (
    <button
      onClick={toggleUnits}
      className={`flex items-center gap-0.5 text-sm cursor-pointer rounded-md px-2 py-1 transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
      aria-label={`Switch to ${units === 'metric' ? 'Fahrenheit' : 'Celsius'}`}
    >
      <span className={units === 'metric' ? active : inactive}>°C</span>
      <span className={isDark ? 'text-gray-500' : 'text-gray-300'}>/</span>
      <span className={units === 'imperial' ? active : inactive}>°F</span>
    </button>
  )
}
