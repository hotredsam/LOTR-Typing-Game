import { useGameStore } from '../stores/useGameStore';

/**
 * Handles keyboard input for the typing game.
 */
export class InputHandler {
  private callback: (char: string) => void;
  private onKeyDownBound: (event: KeyboardEvent) => void;

  constructor(callback: (char: string) => void) {
    this.callback = callback;
    this.onKeyDownBound = this.onKeyDown.bind(this);
    window.addEventListener('keydown', this.onKeyDownBound);
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' || event.key === 'p' || event.key === 'P') {
      const { gamePhase, togglePause } = useGameStore.getState();
      if (gamePhase === 'playing' || gamePhase === 'paused') {
        event.preventDefault();
        togglePause();
      }
      return;
    }
    if (event.key.length === 1) {
      this.callback(event.key);
    }
  }

  public cleanup(): void {
    window.removeEventListener('keydown', this.onKeyDownBound);
  }
}
