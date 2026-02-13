import Phaser from 'phaser';
import { useGameStore } from '../stores/useGameStore';
import { getRandomWord } from '../utils/wordGenerator';
import { InputHandler } from './InputHandler';
import { IWord } from '../types/game';
import { calculateStats, wordPoints, lengthBonus, speedBonus } from '../utils/scoring';
import { getDifficulty } from '../utils/difficultyManager';
import { playWordComplete, playCombo, playMiss, playTypingTick } from '../utils/sound';

const PAD = 10;

interface WordDisplay {
  container: Phaser.GameObjects.Container;
  panel: Phaser.GameObjects.Graphics;
  typedText: Phaser.GameObjects.Text;
  remainingText: Phaser.GameObjects.Text;
}

export default class MainScene extends Phaser.Scene {
  private inputHandler!: InputHandler;
  private wordDisplays: Map<string, WordDisplay> = new Map();
  private spawnTimer!: Phaser.Time.TimerEvent;
  private camera: Phaser.Cameras.Scene2D.Camera | null = null;

  private startTime: number = 0;
  private totalCharsTyped: number = 0;
  private correctCharsTyped: number = 0;
  private focusedWordId: string | null = null;
  private typedLength: number = 0;
  private countdownAccum: number = 0;
  private timedAccum: number = 0;

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

    this.drawParallaxBackground(width, height);

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

  private spawnWord(): void {
    const { gamePhase, isPaused } = useGameStore.getState();
    if (gamePhase !== 'playing' || isPaused) return;

    const { score } = useGameStore.getState();
    const difficulty = getDifficulty(score);

    if (this.spawnTimer.delay !== difficulty.spawnRate) {
      this.spawnTimer.reset({
        delay: difficulty.spawnRate,
        callback: this.spawnWord,
        callbackScope: this,
        loop: true,
      });
    }

    const wordText = getRandomWord();
    const id = Phaser.Utils.String.UUID();
    const x = Phaser.Math.Between(100, 700);
    const speed = Phaser.Math.Between(difficulty.minSpeed, difficulty.maxSpeed);
    const spawnedAt = Date.now();

    const wordData: IWord = { id, text: wordText, x, y: -50, speed, spawnedAt };
    useGameStore.getState().addWord(wordData);

    this.createWordDisplay(id, wordText, x, -50);
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

  private createWordDisplay(id: string, text: string, x: number, y: number): void {
    const baseStyle = {
      fontSize: '20px',
      fontFamily: '"Press Start 2P", monospace',
      padding: { x: PAD, y: PAD },
    };
    const typedPart = this.add
      .text(PAD, 0, '', { ...baseStyle, color: '#7bed9f' })
      .setOrigin(0, 0.5);
    const remainingPart = this.add
      .text(PAD, 0, text, { ...baseStyle, color: '#dfe6e9' })
      .setOrigin(0, 0.5);
    const totalW = Math.max(remainingPart.width + PAD * 2 + 60, 140);
    const panel = this.add
      .graphics()
      .fillStyle(0x2d3436, 0.95)
      .fillRoundedRect(-4, -18, totalW + 8, 36, 4)
      .lineStyle(2, 0x636e72)
      .strokeRoundedRect(-4, -18, totalW + 8, 36, 4);

    const container = this.add.container(x, y);
    container.add([panel, typedPart, remainingPart]);
    panel.setDepth(-0.5);
    typedPart.setDepth(0);
    remainingPart.setDepth(0);

    this.wordDisplays.set(id, { container, panel, typedText: typedPart, remainingText: remainingPart });
    this.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 200, from: 1.2 });
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
    const { activeWords, updateScore, setStats, setGameOver, isGameOver, gamePhase, addCombo, resetCombo, addWordsCompleted, addStreak, resetStreak, addWordToHistory, isPaused } = useGameStore.getState();
    if (isGameOver || gamePhase !== 'playing' || isPaused) return;

    this.totalCharsTyped++;

    if (this.focusedWordId) {
      const word = activeWords.find((w) => w.id === this.focusedWordId!);
      if (!word) {
        this.focusedWordId = null;
        this.typedLength = 0;
        return;
      }
      const expected = word.text[this.typedLength];
      const isLastChar = this.typedLength === word.text.length - 1;
      if (expected !== undefined && expected.toLowerCase() === char.toLowerCase()) {
        playTypingTick();
        this.correctCharsTyped++;
        this.typedLength++;
        this.updateWordDisplay(word.id, word, this.typedLength);
        if (isLastChar || this.typedLength === word.text.length) {
          const state = useGameStore.getState();
          const lenBonus = lengthBonus(word.text.length);
          const spdBonus = word.spawnedAt != null ? speedBonus(Date.now() - word.spawnedAt) : 0;
          const points = wordPoints(word.text.length, state.comboMultiplier, lenBonus, spdBonus);
          updateScore(points);
          addCombo();
          addWordsCompleted(1);
          addStreak();
          addWordToHistory(word.text);
          playWordComplete();
          if (useGameStore.getState().combo > 1) playCombo();
          this.playWordCompleteEffect(word);
          this.showFloatingScore(word, points);
          this.screenShake();
          this.removeWord(word.id);
          this.focusedWordId = null;
          this.typedLength = 0;
        }
      } else {
        playMiss();
        resetCombo();
        resetStreak();
        this.screenShakeWrong();
      }
    } else {
      const matchedWord = activeWords.find((w) => w.text.toLowerCase().startsWith(char.toLowerCase()));
      if (matchedWord) {
        playTypingTick();
        this.focusedWordId = matchedWord.id;
        this.correctCharsTyped++;
        this.typedLength = 1;
        this.updateWordDisplay(matchedWord.id, matchedWord, 1);
        if (matchedWord.text.length === 1) {
          const state = useGameStore.getState();
          const lenBonus = lengthBonus(matchedWord.text.length);
          const spdBonus = matchedWord.spawnedAt != null ? speedBonus(Date.now() - matchedWord.spawnedAt) : 0;
          const points = wordPoints(matchedWord.text.length, state.comboMultiplier, lenBonus, spdBonus);
          updateScore(points);
          addCombo();
          addWordsCompleted(1);
          addStreak();
          addWordToHistory(matchedWord.text);
          playWordComplete();
          if (useGameStore.getState().combo > 1) playCombo();
          this.playWordCompleteEffect(matchedWord);
          this.showFloatingScore(matchedWord, points);
          this.screenShake();
          this.removeWord(matchedWord.id);
          this.focusedWordId = null;
          this.typedLength = 0;
        }
      } else {
        playMiss();
        resetCombo();
        resetStreak();
        this.screenShakeWrong();
      }
    }

    const stats = calculateStats(this.totalCharsTyped, this.correctCharsTyped, this.startTime, Date.now());
    setStats(stats.wpm, stats.accuracy);
  }

  private screenShake(): void {
    if (!this.camera) return;
    this.camera.shake(80, 0.002);
  }

  private screenShakeWrong(): void {
    if (!this.camera) return;
    this.camera.shake(30, 0.001);
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
    this.tweens.add({
      targets: text,
      y: text.y - 50,
      alpha: 0,
      duration: 800,
      onComplete: () => text.destroy(),
    });
  }

  private playWordCompleteEffect(word: IWord): void {
    const disp = this.wordDisplays.get(word.id);
    if (!disp) return;
    const worldX = disp.container.x;
    const worldY = disp.container.y;
    const particleKey = this.textures.exists('particle_gold') ? 'particle_gold' : 'particle';
    const emitter = this.add.particles(worldX, worldY, particleKey, {
      speed: { min: 80, max: 220 },
      scale: { start: 1.2, end: 0 },
      blendMode: 'ADD',
      lifespan: 600,
      tint: 0xffd700,
      gravityY: 180,
      quantity: 28,
      emitting: false,
    });
    emitter.explode(28);
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

  update(_time: number, delta: number): void {
    const store = useGameStore.getState();
    const { activeWords, setGameOver, setGamePhase, setTimeRemaining, setCountdownNumber, gamePhase, gameMode, timedDuration, resetCombo, resetStreak } = store;
    if (store.isGameOver) return;

    if (gamePhase === 'countdown') {
      if (store.countdownNumber === 3) {
        this.wordDisplays.forEach((d) => d.container.destroy());
        this.wordDisplays.clear();
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

    if (gameMode === 'timed') {
      this.timedAccum += delta;
      if (this.timedAccum >= 1000) {
        this.timedAccum = 0;
        store.tickTime();
        if (store.timeRemaining <= 0) setGameOver(true);
      }
    }

    activeWords.forEach((word) => {
      const disp = this.wordDisplays.get(word.id);
      if (disp) {
        word.y += word.speed * dt;
        disp.container.setPosition(word.x, word.y);
      }

      if (word.y > 600) {
        resetCombo();
        resetStreak();
        setGameOver(true);
      }
    });
  }
}
