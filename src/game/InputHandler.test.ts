import { describe, it, expect, vi, afterEach } from 'vitest'
import { InputHandler } from './InputHandler'

describe('InputHandler', () => {
  let handler: InputHandler
  let callback: ReturnType<typeof vi.fn>

  afterEach(() => {
    handler?.cleanup()
  })

  it('calls callback on single-char keydown', () => {
    callback = vi.fn()
    handler = new InputHandler(callback)
    const ev = new KeyboardEvent('keydown', { key: 'a', bubbles: true })
    window.dispatchEvent(ev)
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith('a')
  })

  it('does not call callback on special keys', () => {
    callback = vi.fn()
    handler = new InputHandler(callback)
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift', bubbles: true }))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }))
    expect(callback).not.toHaveBeenCalled()
  })

  it('calls callback for digits and letters', () => {
    callback = vi.fn()
    handler = new InputHandler(callback)
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '5', bubbles: true }))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Z', bubbles: true }))
    expect(callback).toHaveBeenCalledWith('5')
    expect(callback).toHaveBeenCalledWith('Z')
  })

  it('cleanup removes listener', () => {
    callback = vi.fn()
    handler = new InputHandler(callback)
    handler.cleanup()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'x', bubbles: true }))
    expect(callback).not.toHaveBeenCalled()
  })
})
