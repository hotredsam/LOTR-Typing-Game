/**
 * Wire protocol for co-op multiplayer.
 *
 * The model is host-authoritative: the host runs the whole simulation and
 * broadcasts {@link NetSnapshot}s; the guest mirrors the field and forwards
 * keystrokes. Everything here is pure and serialisable so it can be unit
 * tested without a real network.
 */

import type { GamePhase } from '../types/game';

/** One falling word as seen on the wire. */
export interface NetWord {
  id: string;
  text: string;
  x: number;
  y: number;
  speed: number;
  /** Power-up trigger word? Used by the guest for the golden style. */
  power: boolean;
}

/** A player's typing cursor (which word, how many chars typed). */
export interface NetCursor {
  id: string | null;
  len: number;
}

/** Authoritative game state the host broadcasts to the guest. */
export interface NetSnapshot {
  phase: GamePhase;
  words: NetWord[];
  host: NetCursor;
  guest: NetCursor;
  score: number;
  combo: number;
  lives: number;
  level: number;
  wordsCompleted: number;
  countdownNumber: number;
  wpm: number;
  accuracy: number;
}

/** One-shot effects so the guest can play matching sound/juice. */
export type FxKind = 'complete' | 'miss' | 'powerup' | 'levelup' | 'gameover';

export type NetMessage =
  | { t: 'hello'; name: string }
  | { t: 'welcome'; v: number }
  | { t: 'key'; c: string }
  | { t: 'sync'; s: NetSnapshot }
  | { t: 'fx'; k: FxKind; combo?: number; label?: string }
  | { t: 'restart' }
  | { t: 'bye' };

/** Bumped if the wire format changes incompatibly. */
export const PROTOCOL_VERSION = 1;

/** Unambiguous alphabet: no 0/O/1/I/L to avoid mis-typed codes. */
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 5;

/** Generates a short, human-friendly join code (e.g. "GANDF"). */
export function generateJoinCode(rng: () => number = Math.random): string {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[Math.floor(rng() * CODE_ALPHABET.length)];
  }
  return code;
}

/**
 * Normalises user input into a canonical code: upper-cased, stripped of
 * separators, with common look-alike characters remapped onto the alphabet.
 */
export function normalizeJoinCode(input: string): string {
  return input
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .replace(/O/g, '0')
    .replace(/[IL]/g, '1')
    // Our alphabet has no 0/1, so fold those typos to visually-near letters.
    .replace(/0/g, 'Q')
    .replace(/1/g, 'J')
    .slice(0, CODE_LENGTH);
}

export function isValidJoinCode(code: string): boolean {
  if (code.length !== CODE_LENGTH) return false;
  return [...code].every((ch) => CODE_ALPHABET.includes(ch));
}

/** Derives the PeerJS peer id from a join code (namespaced to avoid clashes). */
export function peerIdForCode(code: string): string {
  return `lotr-typing-coop-${code}`;
}

export function encode(msg: NetMessage): string {
  return JSON.stringify(msg);
}

/** Safely parses a wire string, returning null if it isn't a known message. */
export function decode(raw: unknown): NetMessage | null {
  let obj: unknown = raw;
  if (typeof raw === 'string') {
    try {
      obj = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (!obj || typeof obj !== 'object') return null;
  const t = (obj as { t?: unknown }).t;
  switch (t) {
    case 'hello':
    case 'welcome':
    case 'key':
    case 'sync':
    case 'fx':
    case 'restart':
    case 'bye':
      return obj as NetMessage;
    default:
      return null;
  }
}
