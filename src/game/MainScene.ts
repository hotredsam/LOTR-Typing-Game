import Phaser from 'phaser';
import { useGameStore } from '../stores/useGameStore';
import { getWordByLevel } from '../utils/wordGenerator';
import { getWordCategory, WordCategory } from '../utils/wordGenerator';
import { InputHandler } from './InputHandler';
import { IWord } from '../types/game';
import { calculateStats, wordPoints, lengthBonus, speedBonus } from '../utils/scoring';
import { getDifficulty } from '../utils/difficultyManager';
import { playWordComplete, playCombo, playMiss, playTypingTick, playPowerUp, playLevelUp } from '../utils/sound';
import { rollPowerUp, PowerUp } from '../utils/powerups';

const PAD = 10;
const DANGER_Y = 540;
const FLOOR_Y = 600;

/** Colour of the un-typed word text, per category. */
const CATEGORY_COLOR: Record<WordCategory, string> = {
  character: '#8ed0ff',
  place: '#9be37f',
  creature: '#ff9b9b',
  item: '#ffd966',
  phrase: '#e6a3ff',
};

interface WordDisplay {
  container: Phaser.GameObjects.Container;
  panel: Phaser.GameObjects.Graphics;
  typedText: Phaser.GameObjects.Text;
  remainingText: Phaser.GameObjects.Text;
  width: number;
  category: WordCategory;
  powerUp: PowerUp | null;
}

export default class MainScene extends Phaser.Scene {
  private inputHandler!: InputHandler;
  private wordDisplays: Map<string, WordDisplay> = new Map();
  private spawnTimer!: Phaser.Time.TimerEvent;
  private camera: Phaser.Cameras.Scene2D.Camera | null = null;
  private dangerLine: Phaser.GameObjects.Graphics | null = null;

  private startTime: number = 0;
  private totalCharsTyped: number = 0;
  private correctCharsTyped: number = 0;
  private focusedWordId: string | null = null;
  private typedLength: number = 0;
  private countdownAccum: number = 0;
  private timedAccum: number = 0;
  private lastLevel: number = 1;

  // Power-up runtime state.
  private freezeUntil: number = 0;
  private slowUntil: number = 0;
  private doubleUntil: number = 0;
  private shieldActive: boolean = false;

  constructor() {
    super('MainScene');
  }

  create(): void {
    const { width, height } = this.scale;
    this.camera = this.cameras.main;
    this.startTime = Date.now();
    this.totalCharsTyped = 0;
    this.correctCharsTyped = 0;
    this.focusedWordId = null;
    this.typedLength = 0;
    this.lastLevel = 1;
    this.freezeUntil = 0;
    this.slowUntil = 0;
    this.doubleUntil = 0;
    this.shieldActive = false;

    this.drawParallaxBackground(width, height);
    this.drawDangerLine(width);

    if (!this.textures.exists('particle_gold')) {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0xffffff, 1);
      g.fillRect(0, 0, 4, 4);
      g.generateTexture('particle', 4, 4);
      g.destroy();
    }

    this.inputHandler = new InputHandler((char) => this.handleKeyPress(char));

    const difficulty = getDifficulty(0);
    this.spawnTimer = this.time.addEvent({
      delay: difficulty.spawnRate,
      callback: this.spawnWord,
      callbackScope: this,
      loop: true,
    });

    this.events.on('shutdown', () => {
      this.inputHandler.cleanup();
      this.spawnTimer.destroy();
    });
  }

  private get reducedMotion(): boolean {
    return useGameStore.getState().reducedMotion;
  }

  private drawDangerLine(w: number): void {
    this.dangerLine = this.add.graphics().setDepth(-0.4);
    this.dangerLine.lineStyle(2, 0x8b2635, 0.5);
    this.dangerLine.beginPath();
    this.dangerLine.moveTo(0, DANGER_Y);
    this.dangerLine.lineTo(w, DANGER_Y);
    this.dangerLine.strokePath();
  }

  private spawnWord(): void {
    const store = useGameStore.getState();
    const { gamePhase, isPaused } = store;
    if (gamePhase !== 'playing' || isPaused) return;

    const { score, level } = store;
    const difficulty = getDifficulty(score);

    if (this.spawnTimer.delay !== difficulty.spawnRate) {
      this.spawnTimer.reset({
        delay: difficulty.spawnRate,
        callback: this.spawnWord,
        callbackScope: this,
        loop: true,
      });
    }

    // Decide whether this spawn is a power-up word.
    const powerUp = rollPowerUp(level);
    const wordText = powerUp ? powerUp.word : getWordByLevel(level);
    const id = Phaser.Utils.String.UUID();
    const measureWidth = Math.min(620, Math.max(140, wordText.length * 18));
    const x = Phaser.Math.Between(60, Math.max(80, 800 - measureWidth));
    const speed = Phaser.Math.Between(difficulty.minSpeed, difficulty.maxSpeed);
    const spawnedAt = Date.now();

    const wordData: IWord = { id, text: wordText, x, y: -50, speed, spawnedAt };
    useGameStore.getState().addWord(wordData);

    this.createWordDisplay(id, wordText, x, -50, powerUp);
  }

  private drawParallaxBackground(w: number, h: number): void {
    let depth = -3;
    if (this.textures.exists('bg_sky')) {
      const img = this.add.image(0, 0, 'bg_sky').setOrigin(0, 0).setDepth(depth++);
      img.setDisplaySize(w, (w / img.width) * img.height);
    } else {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillGradientStyle(0x1b2838, 0x1b2838, 0x0d2137, 0x0d2137, 1, 1, 1, 1);
      g.fillRect(0, 0, w, h);
      g.generateTexture('bg_sky_proc', w, h);
      g.destroy();
      this.add.image(0, 0, 'bg_sky_proc').setOrigin(0, 0).setDepth(depth++);
    }
    if (this.textures.exists('bg_far')) {
      const img = this.add.image(0, 0, 'bg_far').setOrigin(0, 0).setDepth(depth++);
      img.setDisplaySize(w, (w / img.width) * img.height);
    }
    if (this.textures.exists('bg_mid')) {
      const img = this.add.image(0, 0, 'bg_mid').setOrigin(0, 0).setDepth(depth++);
      img.setDisplaySize(w, (w / img.width) * img.height);
    }
    if (!this.textures.exists('bg_far') && !this.textures.exists('bg_mid')) {
      const hills = this.make.graphics({ x: 0, y: 0 });
      hills.fillStyle(0x16202a, 0.9);
      for (let i = 0; i < 8; i++) {
        const x = (i * 140) % (w + 200) - 100;
        hills.fillEllipse(x, h + 80, 280, 180);
      }
      hills.generateTexture('bg_hills', w, h);
      hills.destroy();
      this.add.image(0, 0, 'bg_hills').setOrigin(0, 0).setDepth(depth++);
    }
    if (this.textures.exists('ground_tile')) {
      const tile = this.textures.get('ground_tile').getSourceImage() as HTMLImageElement;
      const tw = tile.width;
      const th = tile.height;
      for (let x = 0; x < w + tw; x += tw) {
        this.add.image(x, h - th, 'ground_tile').setOrigin(0, 1).setDepth(-1);
      }
    } else {
      const ground = this.make.graphics({ x: 0, y: 0 });
      ground.fillStyle(0x2d4a3e, 1);
      ground.fillRect(0, h - 32, w, 40);
      ground.fillStyle(0x3d5a4a, 1);
      ground.fillRect(0, h - 28, w, 4);
      ground.generateTexture('bg_ground', w, h);
      ground.destroy();
      this.add.image(0, 0, 'bg_ground').setOrigin(0, 0).setDepth(-1);
    }
  }

  private createWordDisplay(id: string, text: string, x: number, y: number, powerUp: PowerUp | null): void {
    const fontScale = useGameStore.getState().fontScale || 1;
    const fontSize = `${Math.round(20 * fontScale)}px`;
    const category = getWordCategory(text);
    const remainingColor = powerUp ? '#fff6c0' : CATEGORY_COLOR[category];

    const baseStyle = {
      fontSize,
      fontFamily: '"Press Start 2P", monospace',
      padding: { x: PAD, y: PAD },
    };
    const typedPart = this.add.text(PAD, 0, '', { ...baseStyle, color: '#7bed9f' }).setOrigin(0, 0.5);
    const remainingPart = this.add.text(PAD, 0, text, { ...baseStyle, color: remainingColor }).setOrigin(0, 0.5);
    const totalW = Math.max(remainingPart.width + PAD * 2 + 60, 140);

    const panel = this.add.graphics();
    this.paintPanel(panel, totalW, powerUp ? powerUp.tint : 0x636e72, !!powerUp);

    const container = this.add.container(x, y);
    container.add([panel, typedPart, remainingPart]);
    panel.setDepth(-0.5);
    typedPart.setDepth(0);
    remainingPart.setDepth(0);

    this.wordDisplays.set(id, {
      container,
      panel,
      typedText: typedPart,
      remainingText: remainingPart,
      width: totalW,
      category,
      powerUp,
    });
    if (!this.reducedMotion) {
      this.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 200, from: 1.2 });
    }
  }

  private paintPanel(panel: Phaser.GameObjects.Graphics, totalW: number, strokeColor: number, glow: boolean): void {
    panel.clear();
    panel
      .fillStyle(0x2d3436, glow ? 0.98 : 0.95)
      .fillRoundedRect(-4, -18, totalW + 8, 36, 4)
      .lineStyle(glow ? 3 : 2, strokeColor, 1)
      .strokeRoundedRect(-4, -18, totalW + 8, 36, 4);
  }

  private updateWordDisplay(id: string, word: IWord, typedLen: number): void {
    const disp = this.wordDisplays.get(id);
    if (!disp) return;
    const typed = word.text.slice(0, typedLen);
    const remaining = word.text.slice(typedLen);
    disp.typedText.setText(typed);
    disp.remainingText.setText(remaining);
    disp.remainingText.setX(PAD + disp.typedText.width);
  }

  private handleKeyPress(char: string): void {
    const store = useGameStore.getState();
    const { activeWords, setStats, isGameOver, gamePhase, resetCombo, resetStreak, isPaused, gameMode } = store;
    if (isGameOver || gamePhase !== 'playing' || isPaused) return;

    this.totalCharsTyped++;

    const onMiss = () => {
      playMiss();
      resetCombo();
      resetStreak();
      this.flashWrong();
      if (gameMode === 'hardcore') this.endGame();
    };

    if (this.focusedWordId) {
      const word = activeWords.find((w) => w.id === this.focusedWordId!);
      if (!word) {
        this.focusedWordId = null;
        this.typedLength = 0;
        return;
      }
      const expected = word.text[this.typedLength];
      if (expected !== undefined && expected.toLowerCase() === char.toLowerCase()) {
        playTypingTick();
        this.correctCharsTyped++;
        this.typedLength++;
        this.updateWordDisplay(word.id, word, this.typedLength);
        if (this.typedLength >= word.text.length) this.completeWord(word);
      } else {
        onMiss();
      }
    } else {
      const matchedWord = activeWords.find((w) => w.text.toLowerCase().startsWith(char.toLowerCase()));
      if (matchedWord) {
        playTypingTick();
        this.focusedWordId = matchedWord.id;
        this.correctCharsTyped++;
        this.typedLength = 1;
        this.updateWordDisplay(matchedWord.id, matchedWord, 1);
        if (matchedWord.text.length === 1) this.completeWord(matchedWord);
      } else {
        onMiss();
      }
    }

    const stats = calculateStats(this.totalCharsTyped, this.correctCharsTyped, this.startTime, Date.now());
    setStats(stats.wpm, stats.accuracy);
  }

  private completeWord(word: IWord): void {
    const state = useGameStore.getState();
    const disp = this.wordDisplays.get(word.id);
    const lenBonus = lengthBonus(word.text.length);
    const spdBonus = word.spawnedAt != null ? speedBonus(Date.now() - word.spawnedAt) : 0;
    const doubling = Date.now() < this.doubleUntil ? 2 : 1;
    const points = wordPoints(word.text.length, state.comboMultiplier, lenBonus, spdBonus) * doubling;

    state.updateScore(points);
    state.addCombo();
    state.addWordsCompleted(1);
    state.addStreak();
    state.addWordToHistory(word.text);

    playWordComplete();
    const combo = useGameStore.getState().combo;
    if (combo > 1) playCombo(combo);
    if (combo > 1 && combo % 5 === 0) this.showComboCallout(combo);

    this.playWordCompleteEffect(word);
    this.showFloatingScore(word, points);
    this.screenShake();

    // Trigger power-up effects. Power-up status is decided at spawn time only —
    // we must NOT fall back to matching by text, because several trigger words
    // (ent, eagle, phial, mithril, silmaril) also appear as ordinary words.
    if (disp?.powerUp) this.activatePowerUp(disp.powerUp);

    this.removeWord(word.id);
    this.focusedWordId = null;
    this.typedLength = 0;
  }

  private activatePowerUp(power: PowerUp): void {
    const now = Date.now();
    useGameStore.getState().unlockAchievement('powerup');
    playPowerUp();
    switch (power.id) {
      case 'freeze':
        this.freezeUntil = now + power.durationMs;
        break;
      case 'slow':
        this.slowUntil = now + power.durationMs;
        break;
      case 'double':
        this.doubleUntil = now + power.durationMs;
        break;
      case 'shield':
        this.shieldActive = true;
        break;
      case 'clear':
        this.clearAllWords();
        break;
    }
    this.showPowerUpBanner(power.label);
  }

  private clearAllWords(): void {
    const ids = Array.from(this.wordDisplays.keys());
    ids.forEach((id) => {
      if (id === this.focusedWordId) {
        this.focusedWordId = null;
        this.typedLength = 0;
      }
      this.removeWord(id);
    });
  }

  private showPowerUpBanner(label: string): void {
    const t = this.add
      .text(400, 120, label, {
        fontSize: '16px',
        fontFamily: '"Press Start 2P", monospace',
        color: '#fff6c0',
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(200);
    this.tweens.add({ targets: t, y: 90, alpha: { from: 1, to: 0 }, duration: 1400, onComplete: () => t.destroy() });
  }

  private showComboCallout(combo: number): void {
    const t = this.add
      .text(400, 220, `COMBO x${combo}!`, {
        fontSize: '24px',
        fontFamily: '"Press Start 2P", monospace',
        color: '#ffd700',
      })
      .setOrigin(0.5)
      .setDepth(200);
    this.tweens.add({
      targets: t,
      scale: { from: 0.4, to: 1.2 },
      alpha: { from: 1, to: 0 },
      duration: 900,
      onComplete: () => t.destroy(),
    });
  }

  private screenShake(): void {
    if (!this.camera || this.reducedMotion) return;
    this.camera.shake(80, 0.002);
  }

  private flashWrong(): void {
    if (!this.camera || this.reducedMotion) return;
    this.camera.shake(30, 0.001);
    this.camera.flash(120, 90, 20, 20);
  }

  private showFloatingScore(word: IWord, points: number): void {
    const disp = this.wordDisplays.get(word.id);
    if (!disp) return;
    const text = this.add
      .text(disp.container.x, disp.container.y, `+${points}`, {
        fontSize: '16px',
        fontFamily: '"Press Start 2P", monospace',
        color: '#ffd700',
      })
      .setOrigin(0.5)
      .setDepth(100);
    this.tweens.add({ targets: text, y: text.y - 50, alpha: 0, duration: 800, onComplete: () => text.destroy() });
  }

  private playWordCompleteEffect(word: IWord): void {
    const disp = this.wordDisplays.get(word.id);
    if (!disp) return;
    const worldX = disp.container.x;
    const worldY = disp.container.y;
    const particleKey = this.textures.exists('particle_gold') ? 'particle_gold' : 'particle';
    // More particles for longer words.
    const quantity = Phaser.Math.Clamp(16 + word.text.length * 3, 16, 64);
    const emitter = this.add.particles(worldX, worldY, particleKey, {
      speed: { min: 80, max: 220 },
      scale: { start: 1.2, end: 0 },
      blendMode: 'ADD',
      lifespan: 600,
      tint: disp.powerUp ? disp.powerUp.tint : 0xffd700,
      gravityY: 180,
      quantity,
      emitting: false,
    });
    emitter.explode(quantity);
    this.time.delayedCall(1200, () => emitter.destroy());
  }

  private removeWord(id: string): void {
    useGameStore.getState().removeWord(id);
    const disp = this.wordDisplays.get(id);
    if (disp) {
      disp.container.destroy();
      this.wordDisplays.delete(id);
    }
    if (this.focusedWordId === id) {
      this.focusedWordId = null;
      this.typedLength = 0;
    }
  }

  /** Centralised game-over so every caller goes through one path. */
  private endGame(): void {
    useGameStore.getState().resetCombo();
    useGameStore.getState().resetStreak();
    useGameStore.getState().setGameOver(true);
  }

  /** A word fell past the floor. Returns true if the game ended. */
  private handleWordDropped(id: string): boolean {
    const store = useGameStore.getState();
    const mode = store.gameMode;

    // Zen mode never penalises a dropped word.
    if (mode === 'zen') {
      this.removeWord(id);
      return false;
    }
    // Shield absorbs the drop once.
    if (this.shieldActive) {
      this.shieldActive = false;
      this.showPowerUpBanner('SHIELD ABSORBED');
      this.removeWord(id);
      return false;
    }

    store.resetCombo();
    store.resetStreak();
    this.removeWord(id);

    if (mode === 'hardcore') {
      this.endGame();
      return true;
    }

    const remaining = store.loseLife();
    if (remaining <= 0) {
      this.endGame();
      return true;
    }
    if (this.camera && !this.reducedMotion) this.camera.flash(180, 120, 20, 20);
    return false;
  }

  update(_time: number, delta: number): void {
    const store = useGameStore.getState();
    const { activeWords, setGamePhase, setTimeRemaining, setCountdownNumber, gamePhase, gameMode, timedDuration } = store;
    if (store.isGameOver) return;

    if (gamePhase === 'countdown') {
      if (store.countdownNumber === 3) {
        this.wordDisplays.forEach((d) => d.container.destroy());
        this.wordDisplays.clear();
        this.focusedWordId = null;
        this.typedLength = 0;
        this.lastLevel = 1;
      }
      this.countdownAccum += delta;
      if (this.countdownAccum >= 1000) {
        this.countdownAccum = 0;
        const n = store.countdownNumber - 1;
        setCountdownNumber(n);
        if (n < 0) {
          setGamePhase('playing');
          if (gameMode === 'timed') setTimeRemaining(timedDuration);
          this.startTime = Date.now();
          this.totalCharsTyped = 0;
          this.correctCharsTyped = 0;
        }
      }
      return;
    }

    if (gamePhase !== 'playing' || store.isPaused) return;

    const dt = delta / 1000;
    const now = Date.now();

    // Level-up detection for flash + banner.
    if (store.level > this.lastLevel) {
      this.lastLevel = store.level;
      this.onLevelUp(store.level);
    }

    if (gameMode === 'timed') {
      this.timedAccum += delta;
      if (this.timedAccum >= 1000) {
        this.timedAccum = 0;
        store.tickTime();
        if (store.timeRemaining <= 0) this.endGame();
      }
    }

    const frozen = now < this.freezeUntil;
    const slowed = now < this.slowUntil;
    const speedFactor = frozen ? 0 : slowed ? 0.4 : 1;

    // Pulse the danger line.
    if (this.dangerLine && !this.reducedMotion) {
      this.dangerLine.setAlpha(0.35 + 0.25 * Math.abs(Math.sin(now / 300)));
    }

    for (const word of activeWords) {
      const disp = this.wordDisplays.get(word.id);
      if (disp) {
        word.y += word.speed * dt * speedFactor;
        disp.container.setPosition(word.x, word.y);
        // Tint the word red as it nears the danger line.
        if (word.y > DANGER_Y - 60 && !disp.powerUp) {
          const danger = Phaser.Math.Clamp((word.y - (DANGER_Y - 60)) / 120, 0, 1);
          disp.remainingText.setTint(Phaser.Display.Color.GetColor(255, Math.round(155 * (1 - danger)), Math.round(155 * (1 - danger))));
        }
      }

      if (word.y > FLOOR_Y) {
        if (this.handleWordDropped(word.id)) return;
      }
    }
  }

  private onLevelUp(level: number): void {
    playLevelUp();
    if (this.camera && !this.reducedMotion) this.camera.flash(220, 201, 162, 39);
    const t = this.add
      .text(400, 160, `LEVEL ${level}`, {
        fontSize: '20px',
        fontFamily: '"Press Start 2P", monospace',
        color: '#ffd700',
      })
      .setOrigin(0.5)
      .setDepth(200);
    this.tweens.add({
      targets: t,
      scale: { from: 0.5, to: 1.3 },
      alpha: { from: 1, to: 0 },
      duration: 1200,
      onComplete: () => t.destroy(),
    });
  }
}
