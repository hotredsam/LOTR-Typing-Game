/**
 * Data structures for the typing game.
 */

export interface IWord {
  id: string;
  text: string;
  x: number;
  y: number;
  speed: number;
  /** When word was spawned (for speed bonus). */
  spawnedAt?: number;
}

export type GamePhase = 'menu' | 'playing' | 'paused' | 'gameOver' | 'countdown';
export type MenuStep = 'main' | 'character' | 'howto' | 'credits' | 'settings' | 'achievements';
export type GameMode = 'endless' | 'timed';
export type ColorTheme = 'default' | 'forest' | 'dusk';

export interface IGameState {
  menuStep: MenuStep;
  gamePhase: GamePhase;
  score: number;
  wpm: number;
  accuracy: number;
  activeWords: IWord[];
  level: number;
  isGameOver: boolean;
  combo: number;
  comboMultiplier: number;
  /** All-time best score (persisted). */
  highScore: number;
  /** Words completed this session. */
  wordsCompleted: number;
  /** Best combo this session. */
  bestCombo: number;
  /** Consecutive words without miss (streak). */
  streak: number;
  /** Selected character id. */
  selectedCharacterId: string | null;
  /** Pause flag. */
  isPaused: boolean;
  /** Game mode. */
  gameMode: GameMode;
  /** Timed mode: seconds left. */
  timeRemaining: number;
  /** Countdown before play: 3, 2, 1. */
  countdownNumber: number;
  /** Sound enabled. */
  soundEnabled: boolean;
  /** Color theme. */
  colorTheme: ColorTheme;
  /** Last N words completed (for history). */
  wordHistory: string[];
  /** Unlocked achievement ids. */
  achievements: string[];
  /** Top 5 local scores. */
  leaderboard: number[];
  /** Difficulty label. */
  difficultyLabel: 'EASY' | 'MEDIUM' | 'HARD' | 'INSANE';
  /** Fullscreen. */
  isFullscreen: boolean;
  /** Timer mode duration in seconds. */
  timedDuration: number;
}

export interface IGameConfig {
  initialSpeed: number;
  spawnRate: number;
  difficultyMultiplier: number;
}
