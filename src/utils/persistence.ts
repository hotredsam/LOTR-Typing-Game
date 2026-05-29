const LAST_MODE_KEY = 'lotr_typing_last_mode';
const HIGH_SCORE_KEY = 'lotr_typing_high_score';
const LEADERBOARD_KEY = 'lotr_typing_leaderboard';
const ACHIEVEMENTS_KEY = 'lotr_typing_achievements';
const SETTINGS_KEY = 'lotr_typing_settings';
const MAX_LEADERBOARD = 5;
const MAX_WORD_HISTORY = 10;

export function loadHighScore(): number {
  try {
    const v = localStorage.getItem(HIGH_SCORE_KEY);
    return v != null ? Math.max(0, parseInt(v, 10)) : 0;
  } catch {
    return 0;
  }
}

export function saveHighScore(score: number): void {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(score));
  } catch {}
}

export function loadLeaderboard(): number[] {
  try {
    const v = localStorage.getItem(LEADERBOARD_KEY);
    if (!v) return [];
    const arr = JSON.parse(v);
    return Array.isArray(arr) ? arr.slice(0, MAX_LEADERBOARD).filter((n: unknown) => typeof n === 'number') : [];
  } catch {
    return [];
  }
}

export function saveToLeaderboard(score: number): number[] {
  const list = loadLeaderboard();
  list.push(score);
  list.sort((a, b) => b - a);
  const top = list.slice(0, MAX_LEADERBOARD);
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(top));
  } catch {}
  return top;
}

export function loadAchievements(): string[] {
  try {
    const v = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!v) return [];
    const arr = JSON.parse(v);
    return Array.isArray(arr) ? arr.filter((s: unknown) => typeof s === 'string') : [];
  } catch {
    return [];
  }
}

export function unlockAchievement(id: string, current: string[]): string[] {
  if (current.includes(id)) return current;
  const next = [...current, id];
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(next));
  } catch {}
  return next;
}

export interface ISettings {
  soundEnabled: boolean;
  colorTheme: string;
  timedDuration: number;
  volume: number;
  reducedMotion: boolean;
  maxLives: number;
  fontScale: number;
}

const DEFAULT_SETTINGS: ISettings = {
  soundEnabled: true,
  colorTheme: 'default',
  timedDuration: 60,
  volume: 60,
  reducedMotion: false,
  maxLives: 3,
  fontScale: 1,
};

/**
 * Loads settings, filling in any missing fields with defaults. This makes the
 * stored shape forward/backward compatible (a v1 blob missing newer keys still
 * loads cleanly rather than crashing or wiping the user's preferences).
 */
export function loadSettings(): ISettings {
  try {
    const v = localStorage.getItem(SETTINGS_KEY);
    if (!v) return { ...DEFAULT_SETTINGS };
    const o = JSON.parse(v) ?? {};
    return {
      soundEnabled: typeof o.soundEnabled === 'boolean' ? o.soundEnabled : DEFAULT_SETTINGS.soundEnabled,
      colorTheme: typeof o.colorTheme === 'string' ? o.colorTheme : DEFAULT_SETTINGS.colorTheme,
      timedDuration: typeof o.timedDuration === 'number' ? o.timedDuration : DEFAULT_SETTINGS.timedDuration,
      volume: typeof o.volume === 'number' ? clamp(o.volume, 0, 100) : DEFAULT_SETTINGS.volume,
      reducedMotion: typeof o.reducedMotion === 'boolean' ? o.reducedMotion : DEFAULT_SETTINGS.reducedMotion,
      maxLives: typeof o.maxLives === 'number' ? clamp(Math.round(o.maxLives), 1, 9) : DEFAULT_SETTINGS.maxLives,
      fontScale: typeof o.fontScale === 'number' ? clamp(o.fontScale, 0.75, 1.5) : DEFAULT_SETTINGS.fontScale,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

/** Clears all persisted progress: scores, leaderboard, achievements, stats. */
export function resetProgress(): void {
  try {
    [HIGH_SCORE_KEY, LEADERBOARD_KEY, ACHIEVEMENTS_KEY, 'lotr_typing_stats_v1'].forEach((k) =>
      localStorage.removeItem(k)
    );
  } catch {
    /* ignore */
  }
}

export function saveSettings(s: ISettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {}
}

const VALID_MODES = ['endless', 'timed', 'zen', 'hardcore'];

export function loadLastMode(): string {
  try {
    const v = localStorage.getItem(LAST_MODE_KEY);
    return v && VALID_MODES.includes(v) ? v : 'endless';
  } catch {
    return 'endless';
  }
}

export function saveLastMode(mode: string): void {
  try {
    localStorage.setItem(LAST_MODE_KEY, mode);
  } catch {
    /* ignore */
  }
}

export function addToWordHistory(word: string, current: string[]): string[] {
  const next = [word, ...current].slice(0, MAX_WORD_HISTORY);
  return next;
}
