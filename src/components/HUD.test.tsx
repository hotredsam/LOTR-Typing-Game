import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HUD from './HUD'
import { useGameStore } from '../stores/useGameStore'

describe('HUD', () => {
  it('renders score, wpm, accuracy, level', () => {
    useGameStore.setState({ score: 100, wpm: 45, accuracy: 92, level: 2 })
    render(<HUD />)
    expect(screen.getByText(/SCORE:/)).toBeInTheDocument()
    expect(screen.getByText(/100/)).toBeInTheDocument()
    expect(screen.getByText(/WPM:/)).toBeInTheDocument()
    expect(screen.getByText(/45/)).toBeInTheDocument()
    expect(screen.getByText(/ACC:/)).toBeInTheDocument()
    expect(screen.getByText(/92%/)).toBeInTheDocument()
    expect(screen.getByText(/LV:/)).toBeInTheDocument()
    expect(document.body.textContent).toMatch(/LV:\s*2/)
  })
})
