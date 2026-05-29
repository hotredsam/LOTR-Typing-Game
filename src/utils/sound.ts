/**
 * Synthesized sound effects via the Web Audio API.
 *
 * The project ships no audio files, so instead of trying to play missing mp3s
 * we generate short tones at runtime. Everything degrades gracefully to a no-op
 * when Web Audio is unavailable (e.g. jsdom in tests).
 */

let enabled = true;
let masterVolume = 0.6; // 0..1
let ctx: AudioContext | null = null;

export function setSoundEnabled(on: boolean): void {
  enabled = on;
  if (!on) stopBgMusic();
}

/** volume is 0..1 (the settings UI works in 0..100 and divides by 100). */
export function setMasterVolume(volume: number): void {
  masterVolume = Math.max(0, Math.min(1, volume));
}

export function getMasterVolume(): number {
  return masterVolume;
}

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    try {
      ctx = new AC();
    } catch {
      return null;
    }
  }
  // Resume if the browser suspended it before a user gesture.
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

/** Call once on the first user gesture to satisfy autoplay policies. */
export function unlockAudio(): void {
  getCtx();
}

interface ToneOpts {
  freq: number;
  durationMs: number;
  type?: OscillatorType;
  gain?: number;
  /** End frequency for a glide (defaults to freq = no glide). */
  endFreq?: number;
}

function tone({ freq, durationMs, type = 'square', gain = 0.2, endFreq }: ToneOpts): void {
  if (!enabled) return;
  const audio = getCtx();
  if (!audio) return;
  try {
    const osc = audio.createOscillator();
    const g = audio.createGain();
    const now = audio.currentTime;
    const dur = durationMs / 1000;
    const peak = gain * masterVolume;

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (endFreq && endFreq !== freq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), now + dur);
    }

    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak), now + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(g).connect(audio.destination);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  } catch {
    /* ignore audio errors */
  }
}

export function playTypingTick(): void {
  tone({ freq: 660, durationMs: 40, type: 'square', gain: 0.05 });
}

export function playWordComplete(): void {
  tone({ freq: 523, endFreq: 784, durationMs: 120, type: 'triangle', gain: 0.18 });
}

/** Combo chime — pitch rises with the combo count. */
export function playCombo(combo = 1): void {
  const base = 600 + Math.min(combo, 20) * 35;
  tone({ freq: base, endFreq: base * 1.5, durationMs: 140, type: 'sine', gain: 0.16 });
}

export function playMiss(): void {
  tone({ freq: 200, endFreq: 90, durationMs: 160, type: 'sawtooth', gain: 0.14 });
}

export function playGameOver(): void {
  tone({ freq: 330, endFreq: 110, durationMs: 600, type: 'sawtooth', gain: 0.22 });
}

export function playPowerUp(): void {
  tone({ freq: 440, endFreq: 1320, durationMs: 280, type: 'triangle', gain: 0.2 });
}

export function playLevelUp(): void {
  tone({ freq: 523, endFreq: 1046, durationMs: 220, type: 'square', gain: 0.18 });
}

// Background music is intentionally a no-op without an audio asset, but the API
// is kept for callers and future asset wiring.
export function playBgMusic(_loop = true): void {
  /* no bgm asset shipped */
}

export function stopBgMusic(): void {
  /* no bgm asset shipped */
}
