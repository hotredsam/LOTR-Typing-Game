import { create } from 'zustand';
import { IGameState, IWord } from '../types/game';
import {
  loadHighScore,
  saveHighScore,
  loadLeaderboard,
  saveToLeaderboard,
  loadAchievements,
  unlockAchievement,
  loadSettings,
  saveSettings,
} from '../utils/persistence';

interface GameActions {
  addWord: (word: IWord) => void;
  removeWord: (id: string) => void;
  updateScore: (points: number) => void;
  setStats: (wpm: number, accuracy: number) => void;
  setGameOver: (isGameOver: boolean) => void;
  setGamePhase: (phase: IGameState['gamePhase']) => void;
  setMenuStep: (step: IGameState['menuStep']) => void;
  startGame: () => void;
  resetGame: () => void;
  addCombo: () => void;
  resetCombo: () => void;
  setHighScore: (score: number) => void;
  setWordsCompleted: (n: number) => void;
  addWordsCompleted: (n: number) => void;
  setBestCombo: (n: number) => void;
  setStreak: (n: number) => void;
  addStreak: () => void;
  resetStreak: () => void;
  setSelectedCharacterId: (id: string | null) => void;
  setPaused: (p: boolean) => void;
  togglePause: () => void;
  setGameMode: (mode: GameMode) => void;
  setTimeRemaining: (n: number) => void;
  tickTime: () => void;
  setCountdownNumber: (n: number) => void;
  setSoundEnabled: (on: boolean) => void;
  toggleSound: () => void;
  setColorTheme: (t: IGameState['colorTheme']) => void;
  addWordToHistory: (word: string) => void;
  unlockAchievement: (id: string) => void;
  setLeaderboard: (scores: number[]) => void;
  pushToLeaderboard: (score: number) => void;
  setDifficultyLabel: (l: IGameState['difficultyLabel']) => void;
  setFullscreen: (on: boolean) => void;
  toggleFullscreen: () => void;
  setTimedDuration: (sec: number) => void;
  hydrateFromStorage: () => void;
}

type GameMode = IGameState['gameMode'];

export const useGameStore = create<IGameState & GameActions>((set, get) => ({
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
  highScore: 0,
  wordsCompleted: 0,
  bestCombo: 0,
  streak: 0,
  selectedCharacterId: null,
  isPaused: false,
  gameMode: 'endless',
  timeRemaining: 0,
  countdownNumber: 0,
  soundEnabled: true,
  colorTheme: 'default',
  wordHistory: [],
  achievements: [],
  leaderboard: [],
  difficultyLabel: 'EASY',
  isFullscreen: false,
  timedDuration: 60,

  addWord: (word) =>
    set((state) => ({ activeWords: [...state.activeWords, word] })),

  removeWord: (id) =>
    set((state) => ({
      activeWords: state.activeWords.filter((w) => w.id !== id),
    })),

  updateScore: (points) =>
    set((state) => {
      const score = state.score + points;
      const highScore = score > state.highScore ? score : state.highScore;
      const level = 1 + Math.floor(score / 500);
      const difficultyLabel =
        level >= 10 ? 'INSANE' : level >= 5 ? 'HARD' : level >= 2 ? 'MEDIUM' : 'EASY';
      if (score > state.highScore) saveHighScore(score);
      return { score, highScore, level, difficultyLabel };
    }),

  setStats: (wpm, accuracy) => set(() => ({ wpm, accuracy })),

  setGameOver: (isGameOver) =>
    set((state) => ({
      isGameOver,
      gamePhase: isGameOver ? 'gameOver' : 'playing',
    })),

  setGamePhase: (gamePhase) => set(() => ({ gamePhase })),

  startGame: () =>
    set((state) => ({
      gamePhase: 'countdown',
      isGameOver: false,
      isPaused: false,
      countdownNumber: 3,
      score: 0,
      activeWords: [],
      wordsCompleted: 0,
      bestCombo: 0,
      streak: 0,
      combo: 0,
      comboMultiplier: 1,
      wpm: 0,
      accuracy: 0,
      level: 1,
      timeRemaining: state.gameMode === 'timed' ? state.timedDuration : 0,
      wordHistory: [],
    })),

  setMenuStep: (menuStep) => set(() => ({ menuStep })),

  addCombo: () =>
    set((state) => {
      const combo = state.combo + 1;
      const comboMultiplier = Math.min(3, 1 + combo * 0.1);
      const bestCombo = Math.max(state.bestCombo, combo);
      return { combo, comboMultiplier, bestCombo };
    }),

  resetCombo: () => set(() => ({ combo: 0, comboMultiplier: 1 })),

  setHighScore: (score) => {
    saveHighScore(score);
    set(() => ({ highScore: score }));
  },

  setWordsCompleted: (n) => set(() => ({ wordsCompleted: n })),
  addWordsCompleted: (n) => set((state) => ({ wordsCompleted: state.wordsCompleted + n })),
  setBestCombo: (n) => set(() => ({ bestCombo: n })),
  setStreak: (n) => set(() => ({ streak: n })),
  addStreak: () => set((state) => ({ streak: state.streak + 1 })),
  resetStreak: () => set(() => ({ streak: 0 })),

  setSelectedCharacterId: (id) => set(() => ({ selectedCharacterId: id })),
  setPaused: (p) => set(() => ({ isPaused: p, gamePhase: p ? 'paused' : 'playing' })),
  togglePause: () =>
    set((state) => {
      const p = !state.isPaused;
      return { isPaused: p, gamePhase: p ? 'paused' : 'playing' };
    }),

  setGameMode: (gameMode) => set(() => ({ gameMode })),
  setTimeRemaining: (n) => set(() => ({ timeRemaining: n })),
  tickTime: () => set((state) => ({ timeRemaining: Math.max(0, state.timeRemaining - 1) })),
  setCountdownNumber: (n) => set(() => ({ countdownNumber: n })),

  setSoundEnabled: (on) => {
    set(() => ({ soundEnabled: on }));
    saveSettings({ ...loadSettings(), soundEnabled: on });
  },
  toggleSound: () =>
    set((state) => {
      const on = !state.soundEnabled;
      saveSettings({ ...loadSettings(), soundEnabled: on });
      return { soundEnabled: on };
    }),

  setColorTheme: (colorTheme) => {
    set(() => ({ colorTheme }));
    saveSettings({ ...loadSettings(), colorTheme });
  },
  addWordToHistory: (word) =>
    set((state) => ({
      wordHistory: [word, ...state.wordHistory].slice(0, 10),
    })),

  unlockAchievement: (id) =>
    set((state) => {
      if (state.achievements.includes(id)) return state;
      const achievements = unlockAchievement(id, state.achievements);
      return { achievements };
    }),

  setLeaderboard: (leaderboard) => set(() => ({ leaderboard })),
  pushToLeaderboard: (score) =>
    set(() => ({ leaderboard: saveToLeaderboard(score) })),

  setDifficultyLabel: (difficultyLabel) => set(() => ({ difficultyLabel })),
  setFullscreen: (isFullscreen) => set(() => ({ isFullscreen })),
  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
  setTimedDuration: (timedDuration) => {
    set(() => ({ timedDuration }));
    saveSettings({ ...loadSettings(), timedDuration });
  },

  hydrateFromStorage: () =>
    set(() => {
      const s = loadSettings();
      return {
        highScore: loadHighScore(),
        leaderboard: loadLeaderboard(),
        achievements: loadAchievements(),
        soundEnabled: s.soundEnabled,
        colorTheme: s.colorTheme as IGameState['colorTheme'],
        timedDuration: s.timedDuration,
      };
    }),

  resetGame: () =>
    set((state) => ({
      gamePhase: 'playing',
      menuStep: 'main',
      score: 0,
      wpm: 0,
      accuracy: 0,
      activeWords: [],
      level: 1,
      isGameOver: false,
      combo: 0,
      comboMultiplier: 1,
      wordsCompleted: 0,
      bestCombo: 0,
      streak: 0,
      isPaused: false,
      timeRemaining: state.gameMode === 'timed' ? state.timedDuration : 0,
      wordHistory: [],
    })),
}));
