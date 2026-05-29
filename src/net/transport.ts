/**
 * Transport abstraction: a bidirectional message channel between two peers.
 *
 * The game logic talks to this interface, never to PeerJS directly, so the
 * netcode can be driven by an in-memory {@link LoopbackTransport} in tests and
 * by a real WebRTC data channel in the browser.
 */

import { NetMessage, decode, encode } from './protocol';

export interface Transport {
  send(msg: NetMessage): void;
  /** Register the handler for inbound messages. */
  onMessage(cb: (msg: NetMessage) => void): void;
  /** Fired once the channel is usable. */
  onOpen(cb: () => void): void;
  /** Fired when the channel closes (either side). */
  onClose(cb: () => void): void;
  /** Fired on a transport-level error (string reason). */
  onError(cb: (reason: string) => void): void;
  close(): void;
  readonly isOpen: boolean;
}

type MsgCb = (msg: NetMessage) => void;

/**
 * Two transports wired directly to each other in memory. Messages are
 * delivered on a microtask to mimic async network behaviour. Used by tests and
 * for a future local "hot-seat" mode.
 */
export class LoopbackTransport implements Transport {
  private peer: LoopbackTransport | null = null;
  private msgCb: MsgCb | null = null;
  private openCb: (() => void) | null = null;
  private closeCb: (() => void) | null = null;
  isOpen = false;

  static createPair(): [LoopbackTransport, LoopbackTransport] {
    const a = new LoopbackTransport();
    const b = new LoopbackTransport();
    a.peer = b;
    b.peer = a;
    // Open on the next microtask so handlers can be registered first.
    queueMicrotask(() => {
      a.markOpen();
      b.markOpen();
    });
    return [a, b];
  }

  private markOpen(): void {
    if (this.isOpen) return;
    this.isOpen = true;
    this.openCb?.();
  }

  send(msg: NetMessage): void {
    if (!this.peer || !this.peer.isOpen) return;
    // Round-trip through encode/decode to catch non-serialisable payloads,
    // exactly like the real data channel does.
    const wire = encode(msg);
    queueMicrotask(() => {
      const decoded = decode(wire);
      if (decoded) this.peer?.msgCb?.(decoded);
    });
  }

  onMessage(cb: MsgCb): void {
    this.msgCb = cb;
  }
  onOpen(cb: () => void): void {
    this.openCb = cb;
    if (this.isOpen) cb();
  }
  onClose(cb: () => void): void {
    this.closeCb = cb;
  }
  onError(_cb: (reason: string) => void): void {
    /* loopback never errors */
  }

  close(): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.closeCb?.();
    const peer = this.peer;
    this.peer = null;
    if (peer && peer.isOpen) peer.close();
  }
}
