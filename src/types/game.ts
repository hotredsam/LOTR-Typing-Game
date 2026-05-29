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
export type MenuStep =
  | 'main'
  | 'character'
  | 'howto'
  | 'credits'
  | 'settings'
  | 'achievements'
  | 'about'
  | 'multiplayer';
export type GameMode = 'endless' | 'timed' | 'zen' | 'hardcore' | 'coop';
export type ColorTheme = 'default' | 'forest' | 'dusk' | 'mithril' | 'mordor' | 'contrast';

export type NetRole = 'none' | 'host' | 'guest';
export type MpStatus = 'idle' | 'hosting' | 'connecting' | 'connected' | 'error' | 'closed';

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
  /** Remaining lives this session. */
  lives: number;
  /** Configured starting lives (settings). */
  maxLives: number;
  /** Master volume 0..100. */
  volume: number;
  /** Reduced-motion accessibility flag (disables shake/heavy anim). */
  reducedMotion: boolean;
  /** In-game word font scale (1 = default). */
  fontScale: number;
  /** Id of the most recently unlocked achievement (for toast). */
  lastUnlocked: string | null;
  /** Multiplayer co-op: this client's role. */
  netRole: NetRole;
  /** Multiplayer connection status. */
  mpStatus: MpStatus;
  /** Join code (host shows it, guest types it). */
  mpCode: string;
  /** Last multiplayer error message, if any. */
  mpError: string | null;
  /** Whether the partner is connected. */
  mpPartnerConnected: boolean;
  /** Wall-clock ms timestamp when the current round's play began (post-countdown). */
  playStartedAt: number;
}

export interface IGameConfig {
  initialSpeed: number;
  spawnRate: number;
  difficultyMultiplier: number;
}
