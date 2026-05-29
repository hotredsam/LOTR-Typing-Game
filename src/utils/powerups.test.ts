import { describe, it, expect } from 'vitest'
import {
  POWER_UPS,
  ALL_POWER_UPS,
  powerUpSpawnChance,
  rollPowerUp,
  powerUpForWord,
} from './powerups'

describe('powerups', () => {
  it('spawn chance grows with level and is capped', () => {
    expect(powerUpSpawnChance(0)).toBeCloseTo(0.02)
    expect(powerUpSpawnChance(100)).toBeLessThanOrEqual(0.12)
    expect(powerUpSpawnChance(5)).toBeGreaterThan(powerUpSpawnChance(1))
  })

  it('rollPowerUp returns null when rng exceeds chance', () => {
    expect(rollPowerUp(1, () => 0.99)).toBeNull()
  })

  it('rollPowerUp returns a power-up when rng is low', () => {
    const p = rollPowerUp(5, () => 0)
    expect(p).not.toBeNull()
    expect(ALL_POWER_UPS).toContain(p!)
  })

  it('powerUpForWord maps trigger words', () => {
    expect(powerUpForWord('phial')).toBe(POWER_UPS.freeze)
    expect(powerUpForWord('nope')).toBeNull()
  })

  it('every power-up has a unique trigger word', () => {
    const words = ALL_POWER_UPS.map((p) => p.word)
    expect(new Set(words).size).toBe(words.length)
  })
})
