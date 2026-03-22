import { describe, it, expect } from 'vitest'
import { formatTemperature, formatWindDirection } from '../format'

describe('format', () => {
  describe('formatTemperature', () => {
    it('rounds and adds degree symbol', () => {
      expect(formatTemperature(22.7)).toBe('23°')
      expect(formatTemperature(22.3)).toBe('22°')
      expect(formatTemperature(0)).toBe('0°')
      expect(formatTemperature(-5.6)).toBe('-6°')
    })
  })

  describe('formatWindDirection', () => {
    it('converts degrees to compass direction', () => {
      expect(formatWindDirection(0)).toBe('N')
      expect(formatWindDirection(90)).toBe('E')
      expect(formatWindDirection(180)).toBe('S')
      expect(formatWindDirection(270)).toBe('W')
      expect(formatWindDirection(45)).toBe('NE')
      expect(formatWindDirection(135)).toBe('SE')
      expect(formatWindDirection(225)).toBe('SW')
      expect(formatWindDirection(315)).toBe('NW')
    })

    it('rounds to nearest compass direction', () => {
      expect(formatWindDirection(20)).toBe('N')
      expect(formatWindDirection(70)).toBe('E')
    })
  })
})
