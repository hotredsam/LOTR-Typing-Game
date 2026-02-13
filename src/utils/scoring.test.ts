import { describe, it, expect } from 'vitest'
import { calculateStats, wordPoints, lengthBonus, speedBonus } from './scoring'

describe('calculateStats', () => {
  it('returns zeros when time diff is zero', () => {
    const t = 1000
    expect(calculateStats(0, 0, t, t)).toEqual({ wpm: 0, accuracy: 0, rawWpm: 0 })
    expect(calculateStats(10, 5, t, t)).toEqual({ wpm: 0, accuracy: 0, rawWpm: 0 })
  })

  it('returns zero accuracy when no chars typed', () => {
    const result = calculateStats(0, 0, 0, 60000)
    expect(result.accuracy).toBe(0)
    expect(result.wpm).toBe(0)
    expect(result.rawWpm).toBe(0)
  })

  it('calculates accuracy as correct/typed * 100', () => {
    const start = 0
    const end = 60000
    expect(calculateStats(10, 10, start, end).accuracy).toBe(100)
    expect(calculateStats(10, 5, start, end).accuracy).toBe(50)
    expect(calculateStats(4, 3, start, end).accuracy).toBe(75)
  })

  it('calculates WPM from correct chars (5 chars = 1 word)', () => {
    const start = 0
    const end = 60000 // 1 minute
    // 60 correct chars in 1 min = 12 words
    expect(calculateStats(60, 60, start, end).wpm).toBe(12)
    // 30 correct in 1 min = 6 words
    expect(calculateStats(30, 30, start, end).wpm).toBe(6)
  })

  it('scales WPM with time (2 min same chars = half WPM)', () => {
    const start = 0
    const oneMin = 60000
    const twoMin = 120000
    const r1 = calculateStats(60, 60, start, oneMin)
    const r2 = calculateStats(60, 60, start, twoMin)
    expect(r1.wpm).toBe(12)
    expect(r2.wpm).toBe(6)
  })

  it('rawWpm uses all typed chars', () => {
    const start = 0
    const end = 60000
    const result = calculateStats(60, 30, start, end)
    expect(result.rawWpm).toBe(12)
    expect(result.wpm).toBe(6)
  })

  it('handles sub-minute duration', () => {
    const start = 0
    const end = 30000 // 30 sec
    const result = calculateStats(30, 30, start, end)
    expect(result.wpm).toBe(12)
  })
})

describe('wordPoints, lengthBonus, speedBonus', () => {
  it('wordPoints uses length, combo, and bonuses', () => {
    expect(wordPoints(5, 1, 0, 0)).toBe(50)
    expect(wordPoints(5, 2, 5, 10)).toBe(115)
  })
  it('lengthBonus gives 0 for short words', () => {
    expect(lengthBonus(4)).toBe(0)
    expect(lengthBonus(6)).toBe(10)
  })
  it('speedBonus decays over 3s', () => {
    expect(speedBonus(0)).toBe(20)
    expect(speedBonus(3000)).toBe(0)
    expect(speedBonus(1500)).toBeGreaterThan(0)
  })
})
