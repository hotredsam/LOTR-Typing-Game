/**
 * Asset paths for sprites and images.
 * Replace these with pixel-art assets when available (e.g. from image_gen_agent).
 */
export const ASSETS = {
  /** Hero sprite (placeholder path; integrate pixel art when ready). */
  HERO: '/assets/hero.png',
  /** Enemy / word sprites (placeholder). */
  ENEMIES: {
    BASIC: '/assets/enemy_basic.png',
    FAST: '/assets/enemy_fast.png',
  },
  /** Background layers for parallax (placeholder). */
  BACKGROUNDS: {
    FAR: '/assets/bg_far.png',
    MID: '/assets/bg_mid.png',
    NEAR: '/assets/bg_near.png',
  },
} as const
