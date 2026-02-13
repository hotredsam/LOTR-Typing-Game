import { describe, it, expect } from 'vitest'
import { getRandomWord, getWordList } from './wordGenerator'

describe('wordGenerator', () => {
  it('getRandomWord returns a string', () => {
    const word = getRandomWord()
    expect(typeof word).toBe('string')
    expect(word.length).toBeGreaterThan(0)
  })

  it('getRandomWord returns only from fantasy terms', () => {
    const list = getWordList()
    for (let i = 0; i < 50; i++) {
      const word = getRandomWord()
      expect(list).toContain(word)
    }
  })

  it('getWordList returns non-empty array', () => {
    const list = getWordList()
    expect(Array.isArray(list)).toBe(true)
    expect(list.length).toBeGreaterThan(0)
  })

  it('getWordList contains only non-empty strings', () => {
    const list = getWordList()
    list.forEach((w) => {
      expect(typeof w).toBe('string')
      expect(w.length).toBeGreaterThan(0)
    })
  })

  it('getRandomWord can return any list member over many calls', () => {
    const list = getWordList()
    const seen = new Set<string>()
    for (let i = 0; i < list.length * 20; i++) {
      seen.add(getRandomWord())
    }
    list.forEach((w) => expect(seen.has(w)).toBe(true))
  })
})
