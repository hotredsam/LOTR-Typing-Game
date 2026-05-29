/**
 * Power-up framework. Special words occasionally spawn; completing one triggers
 * a timed effect. Kept pure & framework-agnostic so it is easy to unit test.
 */

export type PowerUpId = 'freeze' | 'clear' | 'slow' | 'shield' | 'double';

export interface PowerUp {
  id: PowerUpId;
  /** Short label shown in the activation banner. */
  label: string;
  /** The trigger word that spawns this power-up. */
  word: string;
  /** Effect duration in ms (0 = instant effect). */
  durationMs: number;
  /** Tint colour (hex) for the special word panel. */
  tint: number;
}

export const POWER_UPS: Record<PowerUpId, PowerUp> = {
  freeze: { id: 'freeze', label: 'FROZEN BY THE PHIAL', word: 'phial', durationMs: 3000, tint: 0x7fd8ff },
  slow: { id: 'slow', label: 'TIME OF THE ENTS', word: 'ent', durationMs: 5000, tint: 0x9be37f },
  clear: { id: 'clear', label: 'THE EAGLES ARE COMING', word: 'eagle', durationMs: 0, tint: 0xffe27f },
  shield: { id: 'shield', label: 'MITHRIL SHIELD', word: 'mithril', durationMs: 0, tint: 0xc0d8ff },
  double: { id: 'double', label: 'DOUBLE SCORE', word: 'silmaril', durationMs: 8000, tint: 0xffb3ff },
};

export const ALL_POWER_UPS: PowerUp[] = Object.values(POWER_UPS);

/**
 * Probability that a given spawn should be a power-up. Scales gently with level
 * and is capped so the field never floods with specials.
 */
export function powerUpSpawnChance(level: number): number {
  return Math.min(0.12, 0.02 + level * 0.01);
}

/**
 * Decides whether a spawn should be a power-up and, if so, which one.
 * `rng` is injectable for deterministic tests (defaults to Math.random).
 */
export function rollPowerUp(level: number, rng: () => number = Math.random): PowerUp | null {
  if (rng() > powerUpSpawnChance(level)) return null;
  const idx = Math.floor(rng() * ALL_POWER_UPS.length) % ALL_POWER_UPS.length;
  return ALL_POWER_UPS[idx];
}

/** Look up a power-up by its trigger word, if any. */
export function powerUpForWord(word: string): PowerUp | null {
  return ALL_POWER_UPS.find((p) => p.word === word) ?? null;
}
