import { describe, it, expect } from 'vitest'
import {
  getRandomWord,
  getWordList,
  getWordByLevel,
  getWordsByTier,
  getWordCategory,
  tierForLevel,
  LOTR_WORDS,
} from './wordGenerator'

describe('wordGenerator', () => {
  it('getRandomWord returns a non-empty string', () => {
    const word = getRandomWord()
    expect(typeof word).toBe('string')
    expect(word.length).toBeGreaterThan(0)
  })

  it('getWordList returns a non-empty array of non-empty strings', () => {
    const list = getWordList()
    expect(Array.isArray(list)).toBe(true)
    expect(list.length).toBeGreaterThan(0)
    list.forEach((w) => {
      expect(typeof w).toBe('string')
      expect(w.length).toBeGreaterThan(0)
    })
  })

  it('tierForLevel ramps from easy to hard', () => {
    expect(tierForLevel(1)).toBe('easy')
    expect(tierForLevel(4)).toBe('medium')
    expect(tierForLevel(9)).toBe('hard')
  })

  it('easy tier words are short, hard tier includes phrases', () => {
    getWordsByTier('easy').forEach((w) => expect(w.length).toBeLessThanOrEqual(5))
    expect(getWordsByTier('hard').some((w) => w.includes(' '))).toBe(true)
  })

  it('getWordByLevel only returns words from the tier pool (or easier mix)', () => {
    for (let i = 0; i < 50; i++) {
      const w = getWordByLevel(1)
      expect(getWordsByTier('easy')).toContain(w)
    }
  })

  it('getWordCategory classifies known words', () => {
    expect(getWordCategory('frodo')).toBe('character')
    expect(getWordCategory('mordor')).toBe('place')
    expect(getWordCategory('balrog')).toBe('creature')
    expect(getWordCategory('mithril')).toBe('item')
    expect(getWordCategory('you shall not pass')).toBe('phrase')
  })

  it('avoids returning the same word twice in a row (best effort)', () => {
    let repeats = 0
    let prev = getWordByLevel(9)
    for (let i = 0; i < 200; i++) {
      const next = getWordByLevel(9)
      if (next === prev) repeats++
      prev = next
    }
    // With anti-repeat guard, consecutive duplicates should be rare/none.
    expect(repeats).toBeLessThan(5)
  })

  it('every category has entries', () => {
    ;(Object.keys(LOTR_WORDS) as (keyof typeof LOTR_WORDS)[]).forEach((cat) => {
      expect(LOTR_WORDS[cat].length).toBeGreaterThan(0)
    })
  })
})
