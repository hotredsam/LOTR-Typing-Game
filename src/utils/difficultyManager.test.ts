import { describe, it, expect } from 'vitest'
import { getDifficulty } from './difficultyManager'

describe('getDifficulty', () => {
  it('returns spawnRate, minSpeed, maxSpeed', () => {
    const d = getDifficulty(0)
    expect(d).toHaveProperty('spawnRate')
    expect(d).toHaveProperty('minSpeed')
    expect(d).toHaveProperty('maxSpeed')
    expect(typeof d.spawnRate).toBe('number')
    expect(typeof d.minSpeed).toBe('number')
    expect(typeof d.maxSpeed).toBe('number')
  })

  it('at score 0 has base values', () => {
    const d = getDifficulty(0)
    expect(d.spawnRate).toBe(2000)
    expect(d.minSpeed).toBe(50)
    expect(d.maxSpeed).toBe(100)
  })

  it('increases speed as score increases', () => {
    const d0 = getDifficulty(0)
    const d500 = getDifficulty(500)
    const d1000 = getDifficulty(1000)
    expect(d500.minSpeed).toBeGreaterThan(d0.minSpeed)
    expect(d500.maxSpeed).toBeGreaterThan(d0.maxSpeed)
    expect(d1000.minSpeed).toBeGreaterThan(d500.minSpeed)
    expect(d1000.maxSpeed).toBeGreaterThan(d500.maxSpeed)
  })

  it('decreases spawn rate as score increases', () => {
    const d0 = getDifficulty(0)
    const d500 = getDifficulty(500)
    expect(d500.spawnRate).toBeLessThan(d0.spawnRate)
  })

  it('spawn rate does not go below 500', () => {
    const d = getDifficulty(100000)
    expect(d.spawnRate).toBeGreaterThanOrEqual(500)
  })
})
