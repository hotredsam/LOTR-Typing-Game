import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MainMenu from './MainMenu'
import { useGameStore } from '../stores/useGameStore'

describe('MainMenu', () => {
  it('returns null when not in menu', () => {
    useGameStore.setState({ gamePhase: 'playing' })
    const { container } = render(<MainMenu />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when menu step is character', () => {
    useGameStore.setState({ gamePhase: 'menu', menuStep: 'character' })
    const { container } = render(<MainMenu />)
    expect(container.firstChild).toBeNull()
  })

  it('shows title and Begin Mission when menu step is main', () => {
    useGameStore.setState({ gamePhase: 'menu', menuStep: 'main' })
    render(<MainMenu />)
    expect(screen.getByText(/FANTASY TYPING/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Begin Mission/i })).toBeInTheDocument()
  })

  it('calls setMenuStep(character) when Begin Mission clicked', () => {
    const setMenuStep = vi.fn()
    useGameStore.setState({ gamePhase: 'menu', menuStep: 'main', setMenuStep })
    render(<MainMenu />)
    fireEvent.click(screen.getByRole('button', { name: /Begin Mission/i }))
    expect(setMenuStep).toHaveBeenCalledWith('character')
  })
})
