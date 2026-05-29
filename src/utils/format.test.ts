import { describe, it, expect } from 'vitest'
import { formatNumber, formatDuration, formatClock, ordinal } from './format'

describe('format', () => {
  it('formatNumber adds thousands separators', () => {
    expect(formatNumber(12345)).toBe('12,345')
    expect(formatNumber(0)).toBe('0')
  })

  it('formatDuration renders h/m/s', () => {
    expect(formatDuration(45000)).toBe('45s')
    expect(formatDuration(200000)).toBe('3m 20s')
    expect(formatDuration(3720000)).toBe('1h 02m')
  })

  it('formatClock renders M:SS', () => {
    expect(formatClock(65)).toBe('1:05')
    expect(formatClock(9)).toBe('0:09')
    expect(formatClock(-5)).toBe('0:00')
  })

  it('ordinal handles teens and units', () => {
    expect(ordinal(1)).toBe('1st')
    expect(ordinal(2)).toBe('2nd')
    expect(ordinal(3)).toBe('3rd')
    expect(ordinal(11)).toBe('11th')
    expect(ordinal(12)).toBe('12th')
    expect(ordinal(21)).toBe('21st')
  })
})
