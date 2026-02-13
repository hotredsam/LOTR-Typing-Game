import Phaser from 'phaser';

/**
 * Optional asset list. Place images in public/assets/ (or copy from outputs/agent_deliverables).
 * Load fails gracefully (404) so the game runs without them.
 */
const OPTIONAL_ASSETS: { key: string; path: string }[] = [
  { key: 'hero', path: '/assets/sprites/hero_32x32.png' },
  { key: 'hero_attack', path: '/assets/sprites/hero_attack_32x32.png' },
  { key: 'hero_hurt', path: '/assets/sprites/hero_hurt_32x32.png' },
  { key: 'enemy_basic', path: '/assets/sprites/enemy_basic_24x24.png' },
  { key: 'enemy_fast', path: '/assets/sprites/enemy_fast_24x24.png' },
  { key: 'enemy_armored', path: '/assets/sprites/enemy_armored_32x32.png' },
  { key: 'enemy_mage', path: '/assets/sprites/enemy_mage_24x24.png' },
  { key: 'enemy_boss', path: '/assets/sprites/enemy_boss_64x64.png' },
  { key: 'bg_far', path: '/assets/backgrounds/bg_far_256x128.png' },
  { key: 'bg_mid', path: '/assets/backgrounds/bg_mid_256x160.png' },
  { key: 'bg_near', path: '/assets/backgrounds/bg_near_256x96.png' },
  { key: 'bg_sky', path: '/assets/backgrounds/bg_sky_256x128.png' },
  { key: 'panel', path: '/assets/ui/panel_32x32.png' },
  { key: 'button', path: '/assets/ui/button_128x32.png' },
  { key: 'frame', path: '/assets/ui/frame_64x64.png' },
  { key: 'particle_gold', path: '/assets/particles/particle_gold_8x8.png' },
  { key: 'particle_red', path: '/assets/particles/particle_red_8x8.png' },
  { key: 'particle_white', path: '/assets/particles/particle_white_8x8.png' },
  { key: 'icon_score', path: '/assets/icons/icon_score_16x16.png' },
  { key: 'icon_wpm', path: '/assets/icons/icon_wpm_16x16.png' },
  { key: 'icon_combo', path: '/assets/icons/icon_combo_16x16.png' },
  { key: 'ground_tile', path: '/assets/tiles/ground_32x32.png' },
  { key: 'rock_tile', path: '/assets/tiles/rock_32x32.png' },
];

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    OPTIONAL_ASSETS.forEach(({ key, path }) => {
      this.load.image(key, path);
    });
  }

  create(): void {
    this.load.on('loaderror', (file: Phaser.Loader.File) => {
      // Optional assets; ignore 404
    });
    this.scene.start('MainScene');
  }
}
