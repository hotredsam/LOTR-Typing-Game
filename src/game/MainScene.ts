import Phaser from 'phaser';
import { useGameStore } from '../stores/useGameStore';
import { getWordByLevel } from '../utils/wordGenerator';
import { getWordCategory, WordCategory } from '../utils/wordGenerator';
import { InputHandler } from './InputHandler';
import { IWord } from '../types/game';
import { calculateStats, wordPoints, lengthBonus, speedBonus } from '../utils/scoring';
import { getDifficulty } from '../utils/difficultyManager';
import { playWordComplete, playCombo, playMiss, playTypingTick, playPowerUp, playLevelUp } from '../utils/sound';
import { rollPowerUp, powerUpForWord, PowerUp } from '../utils/powerups';
import { netSession } from '../net/session';
import { mpRuntime } from '../net/runtime';
import { NetSnapshot, NetWord, NetCursor, FxKind } from '../net/protocol';

type Who = 'host' | 'guest';
const TYPED_COLOR_LOCAL = '#7bed9f';
const TYPED_COLOR_PARTNER = '#7bd1ff';

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
  /** The full word text (kept so the guest mirror can re-render typed state). */
  text: string;
  /** Base colour of the un-typed text (category or power-up), for restoring after tint. */
  baseColor: string;
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
  // Second typing cursor for the co-op guest (host-authoritative).
  private guestFocusedWordId: string | null = null;
  private guestTypedLength: number = 0;
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
    this.guestFocusedWordId = null;
    this.guestTypedLength = 0;
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

    // A guest forwards every keystroke to the host; everyone else types locally.
    this.inputHandler = new InputHandler((char) => {
      if (this.netRole === 'guest') netSession.sendKey(char);
      else this.handleKeyPress(char, 'host');
    });

    // Co-op runtime bridge: host processes the guest's remote keystrokes; guest
    // mirrors one-shot effects and round restarts driven by the host.
    mpRuntime.onGuestKey = (char) => this.handleKeyPress(char, 'guest');
    mpRuntime.onFx = (kind, info) => this.playRemoteFx(kind, info);
    mpRuntime.onRestart = () => this.clearAllWords();

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
      mpRuntime.onGuestKey = null;
      mpRuntime.onFx = null;
      mpRuntime.onRestart = null;
    });
  }

  private get reducedMotion(): boolean {
    return useGameStore.getState().reducedMotion;
  }

  private get netRole(): 'none' | 'host' | 'guest' {
    return useGameStore.getState().netRole;
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
    // The host is authoritative for spawning; the guest only mirrors.
    if (this.netRole === 'guest') return;

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

    // Clamp x using the real measured panel width so long phrases never overflow.
    const disp = this.wordDisplays.get(id);
    if (disp) {
      const clampedX = Math.max(PAD, Math.min(x, 800 - disp.width - PAD));
      if (clampedX !== x) {
        wordData.x = clampedX;
        disp.container.x = clampedX;
      }
    }
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
      text,
      baseColor: remainingColor,
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

  private updateWordDisplay(id: string, typedLen: number, color: string = TYPED_COLOR_LOCAL): void {
    const disp = this.wordDisplays.get(id);
    if (!disp) return;
    const len = Math.max(0, Math.min(typedLen, disp.text.length));
    disp.typedText.setColor(color);
    disp.typedText.setText(disp.text.slice(0, len));
    disp.remainingText.setText(disp.text.slice(len));
    disp.remainingText.setX(PAD + disp.typedText.width);
    // Restore the base colour and drop any danger tint so a repositioned word
    // (slow/freeze, or a guest snapshot) never keeps a stale red colour.
    disp.remainingText.setColor(disp.baseColor);
    disp.remainingText.clearTint();
  }

  private cursorFor(who: Who): NetCursor {
    return who === 'host'
      ? { id: this.focusedWordId, len: this.typedLength }
      : { id: this.guestFocusedWordId, len: this.guestTypedLength };
  }

  private setCursor(who: Who, id: string | null, len: number): void {
    if (who === 'host') {
      this.focusedWordId = id;
      this.typedLength = len;
    } else {
      this.guestFocusedWordId = id;
      this.guestTypedLength = len;
    }
  }

  /**
   * Processes a keystroke for a player. `who` is 'host' for the local player
   * (also used in single-player) and 'guest' for the remote co-op player whose
   * keys the host replays. Only the host ever runs this — guests forward keys.
   */
  private handleKeyPress(char: string, who: Who = 'host'): void {
    const store = useGameStore.getState();
    const { activeWords, setStats, isGameOver, gamePhase, resetCombo, resetStreak, isPaused, gameMode } = store;
    if (isGameOver || gamePhase !== 'playing' || isPaused) return;
    if (this.netRole === 'guest') return; // safety: guests don't run scoring

    this.totalCharsTyped++;

    const color = who === 'host' ? TYPED_COLOR_LOCAL : TYPED_COLOR_PARTNER;
    const cur = this.cursorFor(who);
    const otherId = who === 'host' ? this.guestFocusedWordId : this.focusedWordId;

    const onMiss = () => {
      playMiss();
      resetCombo();
      resetStreak();
      this.flashWrong();
      this.broadcastFx('miss');
      if (gameMode === 'hardcore') this.endGame();
    };

    if (cur.id) {
      const word = activeWords.find((w) => w.id === cur.id);
      if (!word) {
        this.setCursor(who, null, 0);
        return;
      }
      const expected = word.text[cur.len];
      if (expected !== undefined && expected.toLowerCase() === char.toLowerCase()) {
        playTypingTick();
        this.correctCharsTyped++;
        const newLen = cur.len + 1;
        this.setCursor(who, word.id, newLen);
        this.updateWordDisplay(word.id, newLen, color);
        if (newLen >= word.text.length) this.completeWord(word, who);
      } else {
        onMiss();
      }
    } else {
      // Don't grab the word the other player is already typing.
      const matchedWord = activeWords.find(
        (w) => w.id !== otherId && w.text.toLowerCase().startsWith(char.toLowerCase())
      );
      if (matchedWord) {
        playTypingTick();
        this.correctCharsTyped++;
        this.setCursor(who, matchedWord.id, 1);
        this.updateWordDisplay(matchedWord.id, 1, color);
        if (matchedWord.text.length === 1) this.completeWord(matchedWord, who);
      } else {
        onMiss();
      }
    }

    const stats = calculateStats(this.totalCharsTyped, this.correctCharsTyped, this.startTime, Date.now());
    setStats(stats.wpm, stats.accuracy);
  }

  private completeWord(word: IWord, who: Who = 'host'): void {
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
    this.broadcastFx('complete', { combo });

    this.playWordCompleteEffect(word);
    this.showFloatingScore(word, points);
    this.screenShake();

    // Trigger power-up effects. Power-up status is decided at spawn time only —
    // we must NOT fall back to matching by text, because several trigger words
    // (ent, eagle, phial, mithril, silmaril) also appear as ordinary words.
    if (disp?.powerUp) this.activatePowerUp(disp.powerUp);

    this.removeWord(word.id);
    this.setCursor(who, null, 0);
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
    this.broadcastFx('powerup', { label: power.label });
  }

  private clearAllWords(): void {
    // removeWord() clears any cursor pointing at the destroyed word.
    Array.from(this.wordDisplays.keys()).forEach((id) => this.removeWord(id));
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
    if (this.guestFocusedWordId === id) {
      this.guestFocusedWordId = null;
      this.guestTypedLength = 0;
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
    if (this.netRole === 'guest') {
      this.guestUpdate();
      return;
    }
    this.hostUpdate(delta);
    if (this.netRole === 'host' && netSession.isConnected) {
      netSession.broadcast(this.buildSnapshot());
    }
  }

  private hostUpdate(delta: number): void {
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
          useGameStore.setState({ playStartedAt: Date.now() });
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
        // Tint the word red as it nears the danger line; clear it once safe.
        if (word.y > DANGER_Y - 60 && !disp.powerUp) {
          const danger = Phaser.Math.Clamp((word.y - (DANGER_Y - 60)) / 120, 0, 1);
          disp.remainingText.setTint(Phaser.Display.Color.GetColor(255, Math.round(155 * (1 - danger)), Math.round(155 * (1 - danger))));
        } else {
          disp.remainingText.clearTint();
        }
      }

      if (word.y > FLOOR_Y) {
        if (this.handleWordDropped(word.id)) return;
      }
    }
  }

  private onLevelUp(level: number): void {
    playLevelUp();
    this.broadcastFx('levelup');
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

  // ----- Co-op multiplayer -----

  private broadcastFx(kind: FxKind, info: { combo?: number; label?: string } = {}): void {
    if (this.netRole === 'host') netSession.sendFx(kind, info);
  }

  /** Host: serialise the authoritative state for the guest to mirror. */
  private buildSnapshot(): NetSnapshot {
    const s = useGameStore.getState();
    const words: NetWord[] = [];
    this.wordDisplays.forEach((disp, id) => {
      words.push({
        id,
        text: disp.text,
        x: disp.container.x,
        y: disp.container.y,
        speed: 0,
        power: !!disp.powerUp,
      });
    });
    return {
      phase: s.gamePhase,
      words,
      host: { id: this.focusedWordId, len: this.typedLength },
      guest: { id: this.guestFocusedWordId, len: this.guestTypedLength },
      score: s.score,
      combo: s.combo,
      bestCombo: s.bestCombo,
      streak: s.streak,
      lives: Number.isFinite(s.lives) ? s.lives : 99,
      level: s.level,
      wordsCompleted: s.wordsCompleted,
      countdownNumber: s.countdownNumber,
      wpm: s.wpm,
      accuracy: s.accuracy,
      difficultyLabel: s.difficultyLabel,
    };
  }

  /** Guest: reconcile the rendered field to the latest authoritative snapshot. */
  private guestUpdate(): void {
    const snap = mpRuntime.latestSnapshot;
    if (!snap) return;

    const ids = new Set(snap.words.map((w) => w.id));
    for (const id of Array.from(this.wordDisplays.keys())) {
      if (!ids.has(id)) {
        this.wordDisplays.get(id)!.container.destroy();
        this.wordDisplays.delete(id);
      }
    }

    for (const w of snap.words) {
      let disp = this.wordDisplays.get(w.id);
      if (!disp) {
        this.createWordDisplay(w.id, w.text, w.x, w.y, w.power ? powerUpForWord(w.text) : null);
        disp = this.wordDisplays.get(w.id)!;
      }
      disp.container.setPosition(w.x, w.y);
      this.updateWordDisplay(w.id, 0); // clear, cursors re-applied below
    }

    // On the guest's screen the local player is the "guest" cursor (green) and
    // the host is the partner (blue).
    this.applyCursor(snap.guest, TYPED_COLOR_LOCAL);
    this.applyCursor(snap.host, TYPED_COLOR_PARTNER);
  }

  private applyCursor(cursor: NetCursor, color: string): void {
    if (!cursor.id) return;
    if (!this.wordDisplays.has(cursor.id)) return;
    this.updateWordDisplay(cursor.id, cursor.len, color);
  }

  /** Guest: play the one-shot effects the host emits. */
  private playRemoteFx(kind: FxKind, info: { combo?: number; label?: string }): void {
    switch (kind) {
      case 'complete':
        playWordComplete();
        if (info.combo && info.combo > 1) {
          playCombo(info.combo);
          if (info.combo % 5 === 0) this.showComboCallout(info.combo);
        }
        break;
      case 'miss':
        playMiss();
        this.flashWrong();
        break;
      case 'powerup':
        playPowerUp();
        if (info.label) this.showPowerUpBanner(info.label);
        break;
      case 'levelup':
        playLevelUp();
        if (this.camera && !this.reducedMotion) this.camera.flash(220, 201, 162, 39);
        break;
      case 'gameover':
        break;
    }
  }
}
