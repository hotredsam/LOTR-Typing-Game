/**
 * Lifetime statistics, persisted to localStorage. Separate from per-session
 * state so totals accumulate across every game played.
 */

const STATS_KEY = 'lotr_typing_stats_v1';

export interface ILifetimeStats {
  gamesPlayed: number;
  totalWords: number;
  totalScore: number;
  totalTimeMs: number;
  bestWpm: number;
  bestCombo: number;
}

export const EMPTY_STATS: ILifetimeStats = {
  gamesPlayed: 0,
  totalWords: 0,
  totalScore: 0,
  totalTimeMs: 0,
  bestWpm: 0,
  bestCombo: 0,
};

export function loadStats(): ILifetimeStats {
  try {
    const v = localStorage.getItem(STATS_KEY);
    if (!v) return { ...EMPTY_STATS };
    const o = JSON.parse(v) as Partial<ILifetimeStats>;
    return {
      gamesPlayed: numOr(o.gamesPlayed, 0),
      totalWords: numOr(o.totalWords, 0),
      totalScore: numOr(o.totalScore, 0),
      totalTimeMs: numOr(o.totalTimeMs, 0),
      bestWpm: numOr(o.bestWpm, 0),
      bestCombo: numOr(o.bestCombo, 0),
    };
  } catch {
    return { ...EMPTY_STATS };
  }
}

export function saveStats(stats: ILifetimeStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    /* storage unavailable */
  }
}

export interface IGameResult {
  words: number;
  score: number;
  timeMs: number;
  wpm: number;
  combo: number;
}

/** Folds a finished game's result into the lifetime totals and persists it. */
export function recordGame(result: IGameResult, prev: ILifetimeStats = loadStats()): ILifetimeStats {
  const next: ILifetimeStats = {
    gamesPlayed: prev.gamesPlayed + 1,
    totalWords: prev.totalWords + Math.max(0, result.words),
    totalScore: prev.totalScore + Math.max(0, result.score),
    totalTimeMs: prev.totalTimeMs + Math.max(0, result.timeMs),
    bestWpm: Math.max(prev.bestWpm, result.wpm),
    bestCombo: Math.max(prev.bestCombo, result.combo),
  };
  saveStats(next);
  return next;
}

export function resetStats(): void {
  try {
    localStorage.removeItem(STATS_KEY);
  } catch {
    /* ignore */
  }
}

function numOr(v: unknown, fallback: number): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
