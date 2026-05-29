/**
 * NetSession — the seam between the game and a {@link Transport}.
 *
 * It is deliberately transport-agnostic and store-agnostic so it can be unit
 * tested with a LoopbackTransport. Higher layers (coopController) own the
 * PeerJS wiring and the Zustand store updates.
 */

import { Transport } from './transport';
import { NetMessage, NetSnapshot, FxKind } from './protocol';

export type NetRole = 'none' | 'host' | 'guest';

export interface SessionHandlers {
  /** Host only: guest pressed a key. */
  onKey?: (char: string) => void;
  /** Guest only: authoritative snapshot arrived. */
  onSnapshot?: (snap: NetSnapshot) => void;
  /** Guest only: one-shot effect to mirror (sound/juice). */
  onFx?: (kind: FxKind, info: { combo?: number; label?: string }) => void;
  /** Guest only: host asked for a fresh round. */
  onRestart?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (reason: string) => void;
}

/** Minimum ms between outbound snapshots (~15 Hz) to bound bandwidth. */
const SYNC_INTERVAL_MS = 66;

export class NetSession {
  role: NetRole = 'none';
  private transport: Transport | null = null;
  private handlers: SessionHandlers = {};
  private lastSyncAt = 0;
  private now: () => number;

  constructor(now: () => number = () => Date.now()) {
    this.now = now;
  }

  get isConnected(): boolean {
    return !!this.transport && this.transport.isOpen;
  }

  attach(transport: Transport, role: NetRole, handlers: SessionHandlers = {}): void {
    this.detach();
    this.transport = transport;
    this.role = role;
    this.handlers = handlers;

    transport.onMessage((msg) => this.handleMessage(msg));
    transport.onOpen(() => {
      if (role === 'guest') transport.send({ t: 'hello', name: 'guest' });
      this.handlers.onOpen?.();
    });
    transport.onClose(() => this.handlers.onClose?.());
    transport.onError((reason) => this.handlers.onError?.(reason));
  }

  detach(): void {
    this.transport = null;
    this.role = 'none';
    this.handlers = {};
    this.lastSyncAt = 0;
  }

  setHandlers(handlers: SessionHandlers): void {
    this.handlers = { ...this.handlers, ...handlers };
  }

  private handleMessage(msg: NetMessage): void {
    switch (msg.t) {
      case 'key':
        if (this.role === 'host') this.handlers.onKey?.(msg.c);
        break;
      case 'sync':
        if (this.role === 'guest') this.handlers.onSnapshot?.(msg.s);
        break;
      case 'fx':
        if (this.role === 'guest') this.handlers.onFx?.(msg.k, { combo: msg.combo, label: msg.label });
        break;
      case 'restart':
        if (this.role === 'guest') this.handlers.onRestart?.();
        break;
      case 'hello':
        if (this.role === 'host') this.transport?.send({ t: 'welcome', v: 1 });
        break;
      case 'bye':
        this.handlers.onClose?.();
        break;
    }
  }

  /** Guest → host: forward a keystroke. */
  sendKey(char: string): void {
    if (this.role !== 'guest') return;
    this.transport?.send({ t: 'key', c: char });
  }

  /** Host → guest: broadcast authoritative state (throttled). */
  broadcast(snapshot: NetSnapshot, force = false): void {
    if (this.role !== 'host' || !this.transport) return;
    const t = this.now();
    if (!force && t - this.lastSyncAt < SYNC_INTERVAL_MS) return;
    this.lastSyncAt = t;
    this.transport.send({ t: 'sync', s: snapshot });
  }

  /** Host → guest: one-shot effect (not throttled). */
  sendFx(kind: FxKind, info: { combo?: number; label?: string } = {}): void {
    if (this.role !== 'host') return;
    this.transport?.send({ t: 'fx', k: kind, ...info });
  }

  /** Host → guest: start a fresh round. */
  sendRestart(): void {
    if (this.role !== 'host') return;
    this.transport?.send({ t: 'restart' });
  }

  close(): void {
    try {
      this.transport?.send({ t: 'bye' });
    } catch {
      /* ignore */
    }
    this.transport?.close();
    this.detach();
  }
}

/** App-wide singleton used by the Phaser scene and React UI. */
export const netSession = new NetSession();
