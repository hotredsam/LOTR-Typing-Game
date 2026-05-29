import { describe, it, expect, beforeEach } from 'vitest'
import {
  loadSettings,
  saveSettings,
  loadHighScore,
  saveHighScore,
  saveToLeaderboard,
  loadLeaderboard,
  unlockAchievement,
  loadAchievements,
  loadLastMode,
  saveLastMode,
  resetProgress,
} from './persistence'

describe('persistence', () => {
  beforeEach(() => localStorage.clear())

  it('returns default settings when nothing stored', () => {
    const s = loadSettings()
    expect(s.soundEnabled).toBe(true)
    expect(s.volume).toBe(60)
    expect(s.maxLives).toBe(3)
    expect(s.reducedMotion).toBe(false)
    expect(s.fontScale).toBe(1)
  })

  it('fills missing fields from an older stored shape (migration safety)', () => {
    // Simulate a v1 blob that predates the newer keys.
    localStorage.setItem('lotr_typing_settings', JSON.stringify({ soundEnabled: false, colorTheme: 'forest', timedDuration: 90 }))
    const s = loadSettings()
    expect(s.soundEnabled).toBe(false)
    expect(s.colorTheme).toBe('forest')
    expect(s.timedDuration).toBe(90)
    // Newer keys fall back to defaults rather than undefined.
    expect(s.volume).toBe(60)
    expect(s.maxLives).toBe(3)
  })

  it('clamps out-of-range numeric settings', () => {
    saveSettings({ soundEnabled: true, colorTheme: 'default', timedDuration: 60, volume: 999, reducedMotion: false, maxLives: 99, fontScale: 9 })
    const s = loadSettings()
    expect(s.volume).toBe(100)
    expect(s.maxLives).toBe(9)
    expect(s.fontScale).toBe(1.5)
  })

  it('persists high score and leaderboard', () => {
    saveHighScore(1234)
    expect(loadHighScore()).toBe(1234)
    saveToLeaderboard(500)
    saveToLeaderboard(900)
    expect(loadLeaderboard()[0]).toBe(900)
  })

  it('persists achievements without duplicates', () => {
    unlockAchievement('a', [])
    const after = unlockAchievement('a', loadAchievements())
    expect(after.filter((x) => x === 'a')).toHaveLength(1)
  })

  it('stores and validates the last game mode', () => {
    expect(loadLastMode()).toBe('endless')
    saveLastMode('hardcore')
    expect(loadLastMode()).toBe('hardcore')
    saveLastMode('not-a-mode')
    expect(loadLastMode()).toBe('endless')
  })

  it('resetProgress clears scores and achievements', () => {
    saveHighScore(999)
    unlockAchievement('a', [])
    resetProgress()
    expect(loadHighScore()).toBe(0)
    expect(loadAchievements()).toEqual([])
  })
})
