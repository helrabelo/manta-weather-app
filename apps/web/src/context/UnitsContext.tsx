import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

export type Units = 'metric' | 'imperial'

interface UnitsContextValue {
  units: Units
  toggleUnits: () => void
}

const UnitsContext = createContext<UnitsContextValue>({
  units: 'metric',
  toggleUnits: () => {},
})

function getStoredUnits(): Units {
  try {
    const stored = localStorage.getItem('manta:units')
    return stored === 'imperial' ? 'imperial' : 'metric'
  } catch {
    return 'metric'
  }
}

export function UnitsProvider({ children }: { children: ReactNode }) {
  const [units, setUnits] = useState<Units>(getStoredUnits)

  const toggleUnits = useCallback(() => {
    setUnits((prev) => {
      const next = prev === 'metric' ? 'imperial' : 'metric'
      try {
        localStorage.setItem('manta:units', next)
      } catch {
        // localStorage unavailable
      }
      return next
    })
  }, [])

  return <UnitsContext.Provider value={{ units, toggleUnits }}>{children}</UnitsContext.Provider>
}

export function useUnits() {
  return useContext(UnitsContext)
}
