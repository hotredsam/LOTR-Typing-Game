/**
 * Sound effects hook. Call these when events happen; add actual audio later.
 * Place .mp3/.ogg in public/sounds/ and use Howler or Audio elements.
 */
let enabled = true;

export function setSoundEnabled(on: boolean): void {
  enabled = on;
}

export function playWordComplete(): void {
  if (!enabled) return;
  try {
    const a = new Audio('/sounds/word_complete.mp3');
    a.volume = 0.4;
    a.play().catch(() => {});
  } catch {
    // No audio file or not supported
  }
}

export function playCombo(): void {
  if (!enabled) return;
  try {
    const a = new Audio('/sounds/combo.mp3');
    a.volume = 0.35;
    a.play().catch(() => {});
  } catch {}
}

export function playGameOver(): void {
  if (!enabled) return;
  try {
    const a = new Audio('/sounds/game_over.mp3');
    a.volume = 0.5;
    a.play().catch(() => {});
  } catch {
    // JSDOM/test env may not implement Audio or play
  }
}

export function playMiss(): void {
  if (!enabled) return;
  try {
    const a = new Audio('/sounds/miss.mp3');
    a.volume = 0.2;
    a.play().catch(() => {});
  } catch {}
}

export function playTypingTick(): void {
  if (!enabled) return;
  try {
    const a = new Audio('/sounds/typing_tick.mp3');
    a.volume = 0.15;
    a.play().catch(() => {});
  } catch {}
}

let bgm: HTMLAudioElement | null = null;

export function playBgMusic(loop = true): void {
  if (!enabled) return;
  try {
    if (bgm) return;
    bgm = new Audio('/sounds/bgm.mp3');
    bgm.volume = 0.25;
    bgm.loop = loop;
    bgm.play().catch(() => {});
  } catch {}
}

export function stopBgMusic(): void {
  try {
    if (bgm) {
      bgm.pause();
      bgm.currentTime = 0;
      bgm = null;
    }
  } catch {}
}
