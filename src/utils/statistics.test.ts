import { describe, it, expect, beforeEach } from 'vitest'
import { EMPTY_STATS, loadStats, saveStats, recordGame, resetStats } from './statistics'

describe('statistics', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads empty stats by default', () => {
    expect(loadStats()).toEqual(EMPTY_STATS)
  })

  it('records a game into lifetime totals', () => {
    const after = recordGame({ words: 10, score: 200, timeMs: 30000, wpm: 40, combo: 6 }, EMPTY_STATS)
    expect(after.gamesPlayed).toBe(1)
    expect(after.totalWords).toBe(10)
    expect(after.totalScore).toBe(200)
    expect(after.bestWpm).toBe(40)
    expect(after.bestCombo).toBe(6)
  })

  it('accumulates across games and keeps bests', () => {
    recordGame({ words: 5, score: 100, timeMs: 1000, wpm: 30, combo: 3 })
    const second = recordGame({ words: 7, score: 50, timeMs: 2000, wpm: 20, combo: 9 })
    expect(second.gamesPlayed).toBe(2)
    expect(second.totalWords).toBe(12)
    expect(second.bestWpm).toBe(30)
    expect(second.bestCombo).toBe(9)
  })

  it('persists and reloads', () => {
    saveStats({ ...EMPTY_STATS, totalWords: 42 })
    expect(loadStats().totalWords).toBe(42)
  })

  it('resetStats clears storage', () => {
    saveStats({ ...EMPTY_STATS, totalWords: 99 })
    resetStats()
    expect(loadStats()).toEqual(EMPTY_STATS)
  })

  it('ignores negative deltas', () => {
    const after = recordGame({ words: -5, score: -100, timeMs: -1, wpm: 10, combo: 2 }, EMPTY_STATS)
    expect(after.totalWords).toBe(0)
    expect(after.totalScore).toBe(0)
    expect(after.totalTimeMs).toBe(0)
  })
})
