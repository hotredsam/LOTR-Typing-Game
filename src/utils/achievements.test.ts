import { describe, it, expect } from 'vitest'
import { ACHIEVEMENTS, checkAchievements, AchievementCheckState } from './achievements'

function base(overrides: Partial<AchievementCheckState> = {}): AchievementCheckState {
  return {
    wordsCompleted: 0,
    score: 0,
    bestCombo: 0,
    streak: 0,
    highScore: 0,
    gameMode: 'endless',
    timeRemaining: 0,
    level: 1,
    accuracy: 0,
    ...overrides,
  }
}

function unlockedBy(state: AchievementCheckState): string[] {
  const out: string[] = []
  checkAchievements(state, 0, (id) => out.push(id))
  return out
}

describe('achievements', () => {
  it('every achievement has id, name, description, icon', () => {
    ACHIEVEMENTS.forEach((a) => {
      expect(a.id).toBeTruthy()
      expect(a.name).toBeTruthy()
      expect(a.description).toBeTruthy()
      expect(a.icon).toBeTruthy()
    })
  })

  it('ids are unique', () => {
    const ids = ACHIEVEMENTS.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('unlocks first word and combos by threshold', () => {
    expect(unlockedBy(base({ wordsCompleted: 1 }))).toContain('first_word')
    expect(unlockedBy(base({ bestCombo: 25 }))).toContain('combo_25')
    expect(unlockedBy(base({ bestCombo: 4 }))).not.toContain('combo_5')
  })

  it('unlocks level and accuracy achievements', () => {
    expect(unlockedBy(base({ level: 10 }))).toContain('level_10')
    expect(unlockedBy(base({ wordsCompleted: 12, accuracy: 100 }))).toContain('flawless')
    expect(unlockedBy(base({ wordsCompleted: 5, accuracy: 100 }))).not.toContain('flawless')
  })

  it('mode-specific unlocks', () => {
    expect(unlockedBy(base({ gameMode: 'zen', wordsCompleted: 1 }))).toContain('zen_master')
    expect(unlockedBy(base({ gameMode: 'hardcore', score: 600 }))).toContain('hardcore_win')
    expect(unlockedBy(base({ gameMode: 'timed', timeRemaining: 5 }))).toContain('timed_win')
  })
})
