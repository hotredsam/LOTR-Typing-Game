import { describe, it, expect } from 'vitest'

/**
 * Pure typing logic for tests: given current typed length and the next key,
 * returns whether it was correct, and the new typed length (or -1 if word completed).
 */
function applyKey(word: string, typedLength: number, key: string): { correct: boolean; nextTypedLength: number } {
  const expected = word[typedLength]
  if (expected === undefined) return { correct: false, nextTypedLength: typedLength }
  if (expected.toLowerCase() === key.toLowerCase()) {
    const next = typedLength + 1
    return { correct: true, nextTypedLength: next >= word.length ? -1 : next }
  }
  return { correct: false, nextTypedLength: typedLength }
}

describe('typingLogic', () => {
  it('first correct char advances typed length', () => {
    const r = applyKey('dragon', 0, 'd')
    expect(r.correct).toBe(true)
    expect(r.nextTypedLength).toBe(1)
  })

  it('wrong char does not advance', () => {
    const r = applyKey('dragon', 0, 'x')
    expect(r.correct).toBe(false)
    expect(r.nextTypedLength).toBe(0)
  })

  it('last correct char returns -1 (word complete)', () => {
    const r = applyKey('dragon', 5, 'n')
    expect(r.correct).toBe(true)
    expect(r.nextTypedLength).toBe(-1)
  })

  it('case insensitive match', () => {
    const r = applyKey('Dragon', 0, 'd')
    expect(r.correct).toBe(true)
    expect(r.nextTypedLength).toBe(1)
  })

  it('full word sequence completes', () => {
    const word = 'elf'
    let len = 0
    for (const key of ['e', 'l', 'f']) {
      const r = applyKey(word, len, key)
      expect(r.correct).toBe(true)
      len = r.nextTypedLength
    }
    expect(len).toBe(-1)
  })
})
