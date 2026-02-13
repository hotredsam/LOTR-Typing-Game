import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GameOver from './GameOver'
import { useGameStore } from '../stores/useGameStore'

describe('GameOver', () => {
  it('returns null when not game over', () => {
    useGameStore.setState({ isGameOver: false })
    const { container } = render(<GameOver />)
    expect(container.firstChild).toBeNull()
  })

  it('shows overlay and final score when game over', () => {
    useGameStore.setState({ isGameOver: true, score: 500 })
    render(<GameOver />)
    expect(screen.getByText('GAME OVER')).toBeInTheDocument()
    expect(screen.getByText(/FINAL SCORE:/)).toHaveTextContent('500')
    expect(screen.getByRole('button', { name: /RESTART \(R\)/i })).toBeInTheDocument()
  })

  it('calls resetGame when restart clicked', () => {
    const reset = vi.fn()
    useGameStore.setState({ isGameOver: true, resetGame: reset })
    render(<GameOver />)
    fireEvent.click(screen.getByRole('button', { name: /RESTART \(R\)/i }))
    expect(reset).toHaveBeenCalled()
  })
})
