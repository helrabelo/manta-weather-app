import { describe, it, expect } from 'vitest'
import { getWeatherInfo, getWeatherLabel, getWeatherCondition } from '../weather-codes'

describe('weather-codes', () => {
  describe('getWeatherInfo', () => {
    it('returns clear sky for code 0', () => {
      const info = getWeatherInfo(0)
      expect(info.condition).toBe('clear')
      expect(info.label).toBe('Clear sky')
    })

    it('returns partly cloudy for code 2', () => {
      const info = getWeatherInfo(2)
      expect(info.condition).toBe('partly-cloudy')
      expect(info.label).toBe('Partly cloudy')
    })

    it('returns rain for code 63', () => {
      const info = getWeatherInfo(63)
      expect(info.condition).toBe('rain')
      expect(info.label).toBe('Moderate rain')
    })

    it('returns thunderstorm for code 95', () => {
      const info = getWeatherInfo(95)
      expect(info.condition).toBe('thunderstorm')
    })

    it('returns snow for code 71', () => {
      const info = getWeatherInfo(71)
      expect(info.condition).toBe('snow')
    })

    it('returns clear as fallback for unknown code', () => {
      const info = getWeatherInfo(999)
      expect(info.condition).toBe('clear')
      expect(info.label).toBe('Unknown')
    })
  })

  describe('getWeatherLabel', () => {
    it('returns the label string', () => {
      expect(getWeatherLabel(0)).toBe('Clear sky')
      expect(getWeatherLabel(65)).toBe('Heavy rain')
    })
  })

  describe('getWeatherCondition', () => {
    it('returns the condition string', () => {
      expect(getWeatherCondition(0)).toBe('clear')
      expect(getWeatherCondition(3)).toBe('cloudy')
      expect(getWeatherCondition(45)).toBe('fog')
    })
  })
})
