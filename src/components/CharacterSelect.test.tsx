import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CharacterSelect from './CharacterSelect'
import { useGameStore } from '../stores/useGameStore'

describe('CharacterSelect', () => {
  it('returns null when not in menu', () => {
    useGameStore.setState({ gamePhase: 'playing' })
    const { container } = render(<CharacterSelect />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when menu step is main', () => {
    useGameStore.setState({ gamePhase: 'menu', menuStep: 'main' })
    const { container } = render(<CharacterSelect />)
    expect(container.firstChild).toBeNull()
  })

  it('shows character options and Start Mission when menu step is character', () => {
    useGameStore.setState({ gamePhase: 'menu', menuStep: 'character' })
    render(<CharacterSelect />)
    expect(screen.getByText(/CHOOSE YOUR HERO/)).toBeInTheDocument()
    expect(screen.getByText('WARRIOR')).toBeInTheDocument()
    expect(screen.getByText('RANGER')).toBeInTheDocument()
    expect(screen.getByText('MAGE')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Start Mission/i })).toBeInTheDocument()
  })

  it('Start Mission is disabled until a character is selected', () => {
    useGameStore.setState({ gamePhase: 'menu', menuStep: 'character' })
    render(<CharacterSelect />)
    expect(screen.getByRole('button', { name: /Start Mission/i })).toBeDisabled()
  })

  it('calls startGame when character selected and Start Mission clicked', () => {
    const startGame = vi.fn()
    useGameStore.setState({ gamePhase: 'menu', menuStep: 'character', startGame })
    render(<CharacterSelect />)
    fireEvent.click(screen.getByText('WARRIOR'))
    fireEvent.click(screen.getByRole('button', { name: /Start Mission/i }))
    expect(startGame).toHaveBeenCalled()
  })

  it('Back button calls setMenuStep(main)', () => {
    const setMenuStep = vi.fn()
    useGameStore.setState({ gamePhase: 'menu', menuStep: 'character', setMenuStep })
    render(<CharacterSelect />)
    fireEvent.click(screen.getByRole('button', { name: /Back/i }))
    expect(setMenuStep).toHaveBeenCalledWith('main')
  })
})
