/**
 * Concrete {@link Transport} backed by a PeerJS WebRTC DataConnection.
 *
 * This is the browser-only path; it is intentionally thin so the testable
 * netcode in protocol/session/transport stays free of PeerJS. WebRTC is
 * supported by Chrome, Edge, Firefox and Safari on both Windows and macOS, so
 * a PC host and a Mac guest (or vice-versa) connect the same way.
 */

import Peer, { DataConnection } from 'peerjs';
import { Transport } from './transport';
import { NetMessage, decode, encode, peerIdForCode } from './protocol';

class DataConnTransport implements Transport {
  isOpen = false;
  private msgCb: ((m: NetMessage) => void) | null = null;
  private openCb: (() => void) | null = null;
  private closeCb: (() => void) | null = null;
  private errorCb: ((r: string) => void) | null = null;

  constructor(private conn: DataConnection) {
    conn.on('data', (data) => {
      const msg = decode(data as unknown);
      if (msg) this.msgCb?.(msg);
    });
    conn.on('open', () => {
      this.isOpen = true;
      this.openCb?.();
    });
    conn.on('close', () => {
      this.isOpen = false;
      this.closeCb?.();
    });
    conn.on('error', (err) => this.errorCb?.(String(err)));
    if (conn.open) {
      this.isOpen = true;
    }
  }

  send(msg: NetMessage): void {
    if (!this.conn.open) return;
    try {
      this.conn.send(encode(msg));
    } catch {
      /* connection may have dropped mid-send */
    }
  }
  onMessage(cb: (m: NetMessage) => void): void {
    this.msgCb = cb;
  }
  onOpen(cb: () => void): void {
    this.openCb = cb;
    if (this.isOpen) cb();
  }
  onClose(cb: () => void): void {
    this.closeCb = cb;
  }
  onError(cb: (r: string) => void): void {
    this.errorCb = cb;
  }
  close(): void {
    try {
      this.conn.close();
    } catch {
      /* ignore */
    }
    this.isOpen = false;
  }
}

export interface PeerHandle {
  peer: Peer;
  /** Resolves to a Transport once a DataConnection is open. */
  transport: Promise<Transport>;
  destroy(): void;
}

/** Host: claim the peer id derived from `code` and wait for a guest. */
export function hostPeer(code: string): PeerHandle {
  const peer = new Peer(peerIdForCode(code));
  const transport = new Promise<Transport>((resolve, reject) => {
    peer.on('connection', (conn) => {
      const t = new DataConnTransport(conn);
      const finish = () => resolve(t);
      if (conn.open) finish();
      else conn.on('open', finish);
    });
    peer.on('error', (err) => reject(err));
  });
  return { peer, transport, destroy: () => peer.destroy() };
}

/** Guest: connect to the host's peer id derived from `code`. */
export function joinPeer(code: string): PeerHandle {
  const peer = new Peer();
  const transport = new Promise<Transport>((resolve, reject) => {
    peer.on('open', () => {
      const conn = peer.connect(peerIdForCode(code), { reliable: true });
      const t = new DataConnTransport(conn);
      const finish = () => resolve(t);
      if (conn.open) finish();
      else conn.on('open', finish);
    });
    peer.on('error', (err) => reject(err));
  });
  return { peer, transport, destroy: () => peer.destroy() };
}
