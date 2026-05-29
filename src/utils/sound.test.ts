import { describe, it, expect } from 'vitest'
import {
  setSoundEnabled,
  setMasterVolume,
  getMasterVolume,
  playTypingTick,
  playWordComplete,
  playCombo,
  playMiss,
  playGameOver,
  playPowerUp,
  playLevelUp,
  unlockAudio,
} from './sound'

describe('sound', () => {
  it('clamps master volume to 0..1', () => {
    setMasterVolume(2)
    expect(getMasterVolume()).toBe(1)
    setMasterVolume(-1)
    expect(getMasterVolume()).toBe(0)
    setMasterVolume(0.5)
    expect(getMasterVolume()).toBe(0.5)
  })

  it('all SFX are safe no-ops in jsdom (no throw)', () => {
    setSoundEnabled(true)
    expect(() => {
      unlockAudio()
      playTypingTick()
      playWordComplete()
      playCombo(5)
      playMiss()
      playGameOver()
      playPowerUp()
      playLevelUp()
    }).not.toThrow()
  })

  it('does nothing when disabled', () => {
    setSoundEnabled(false)
    expect(() => playWordComplete()).not.toThrow()
    setSoundEnabled(true)
  })
})
