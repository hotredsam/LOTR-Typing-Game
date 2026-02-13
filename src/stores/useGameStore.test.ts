import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from './useGameStore'

describe('useGameStore', () => {
  beforeEach(() => {
    useGameStore.setState({
      menuStep: 'main',
      gamePhase: 'menu',
      score: 0,
      wpm: 0,
      accuracy: 0,
      activeWords: [],
      level: 1,
      isGameOver: false,
      combo: 0,
      comboMultiplier: 1,
    })
  })

  it('starts with initial state', () => {
    const state = useGameStore.getState()
    expect(state.gamePhase).toBe('menu')
    expect(state.score).toBe(0)
    expect(state.wpm).toBe(0)
    expect(state.accuracy).toBe(0)
    expect(state.activeWords).toEqual([])
    expect(state.level).toBe(1)
    expect(state.isGameOver).toBe(false)
    expect(state.combo).toBe(0)
    expect(state.comboMultiplier).toBe(1)
  })

  it('startGame sets phase to countdown then playing after countdown', () => {
    useGameStore.getState().startGame()
    expect(useGameStore.getState().gamePhase).toBe('countdown')
    expect(useGameStore.getState().isGameOver).toBe(false)
  })

  it('resetGame sets phase to playing', () => {
    useGameStore.getState().setGameOver(true)
    expect(useGameStore.getState().gamePhase).toBe('gameOver')
    useGameStore.getState().resetGame()
    expect(useGameStore.getState().gamePhase).toBe('playing')
  })

  it('addWord adds to activeWords', () => {
    useGameStore.getState().addWord({
      id: 'w1',
      text: 'dragon',
      x: 100,
      y: 50,
      speed: 80,
    })
    expect(useGameStore.getState().activeWords).toHaveLength(1)
    expect(useGameStore.getState().activeWords[0].text).toBe('dragon')
  })

  it('removeWord removes by id', () => {
    useGameStore.getState().addWord({ id: 'w1', text: 'a', x: 0, y: 0, speed: 50 })
    useGameStore.getState().addWord({ id: 'w2', text: 'b', x: 0, y: 0, speed: 50 })
    useGameStore.getState().removeWord('w1')
    expect(useGameStore.getState().activeWords).toHaveLength(1)
    expect(useGameStore.getState().activeWords[0].id).toBe('w2')
  })

  it('updateScore increases score', () => {
    useGameStore.getState().updateScore(10)
    expect(useGameStore.getState().score).toBe(10)
    useGameStore.getState().updateScore(5)
    expect(useGameStore.getState().score).toBe(15)
  })

  it('setStats updates wpm and accuracy', () => {
    useGameStore.getState().setStats(60, 95)
    expect(useGameStore.getState().wpm).toBe(60)
    expect(useGameStore.getState().accuracy).toBe(95)
  })

  it('setGameOver sets flag', () => {
    useGameStore.getState().setGameOver(true)
    expect(useGameStore.getState().isGameOver).toBe(true)
  })

  it('resetGame clears everything and sets phase to playing', () => {
    useGameStore.getState().addWord({ id: 'w1', text: 'x', x: 0, y: 0, speed: 50 })
    useGameStore.getState().updateScore(100)
    useGameStore.getState().setStats(50, 90)
    useGameStore.getState().setGameOver(true)
    useGameStore.getState().addCombo()
    useGameStore.getState().resetGame()
    const state = useGameStore.getState()
    expect(state.gamePhase).toBe('playing')
    expect(state.score).toBe(0)
    expect(state.wpm).toBe(0)
    expect(state.accuracy).toBe(0)
    expect(state.activeWords).toEqual([])
    expect(state.isGameOver).toBe(false)
    expect(state.combo).toBe(0)
    expect(state.comboMultiplier).toBe(1)
  })

  it('addCombo increases combo and comboMultiplier', () => {
    useGameStore.getState().addCombo()
    expect(useGameStore.getState().combo).toBe(1)
    expect(useGameStore.getState().comboMultiplier).toBeGreaterThanOrEqual(1)
    useGameStore.getState().addCombo()
    useGameStore.getState().addCombo()
    expect(useGameStore.getState().combo).toBe(3)
    expect(useGameStore.getState().comboMultiplier).toBeLessThanOrEqual(3)
  })

  it('resetCombo zeros combo and sets multiplier to 1', () => {
    useGameStore.getState().addCombo()
    useGameStore.getState().addCombo()
    useGameStore.getState().resetCombo()
    expect(useGameStore.getState().combo).toBe(0)
    expect(useGameStore.getState().comboMultiplier).toBe(1)
  })
})
