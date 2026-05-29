/**
 * Co-op multiplayer controller (browser-only orchestration).
 *
 * Generates/validates join codes, drives the PeerJS handshake, attaches the
 * {@link netSession}, and mirrors connection + authoritative state into the
 * Zustand store and the {@link mpRuntime} bridge consumed by the Phaser scene.
 */

import { useGameStore } from '../stores/useGameStore';
import { netSession } from './session';
import { hostPeer, joinPeer, PeerHandle } from './peerTransport';
import { mpRuntime, resetMpRuntime } from './runtime';
import { generateJoinCode, isValidJoinCode, normalizeJoinCode, friendlyError, NetSnapshot } from './protocol';
import { loadLastMode } from '../utils/persistence';
import type { GameMode, IGameState } from '../types/game';

let handle: PeerHandle | null = null;

function store() {
  return useGameStore.getState();
}

/** Pushes an authoritative snapshot into the store so the guest HUD updates. */
function applySnapshot(snap: NetSnapshot): void {
  mpRuntime.latestSnapshot = snap;
  useGameStore.setState({
    gamePhase: snap.phase,
    isGameOver: snap.phase === 'gameOver',
    score: snap.score,
    combo: snap.combo,
    bestCombo: snap.bestCombo,
    streak: snap.streak,
    lives: snap.lives,
    level: snap.level,
    wordsCompleted: snap.wordsCompleted,
    countdownNumber: snap.countdownNumber,
    wpm: snap.wpm,
    accuracy: snap.accuracy,
    difficultyLabel: snap.difficultyLabel as IGameState['difficultyLabel'],
  });
}

function wireGuestHandlers(): void {
  netSession.setHandlers({
    onSnapshot: applySnapshot,
    onFx: (kind, info) => mpRuntime.onFx?.(kind, info),
    onRestart: () => mpRuntime.onRestart?.(),
    onClose: () => store().setMultiplayer({ mpStatus: 'closed', mpPartnerConnected: false }),
    onError: (reason) => store().setMultiplayer({ mpStatus: 'error', mpError: reason }),
  });
}

function wireHostHandlers(): void {
  netSession.setHandlers({
    onKey: (char) => mpRuntime.onGuestKey?.(char),
    onClose: () => store().setMultiplayer({ mpStatus: 'closed', mpPartnerConnected: false }),
    onError: (reason) => store().setMultiplayer({ mpStatus: 'error', mpError: reason }),
  });
}

/** Host a new co-op game; returns the join code to share. */
export async function hostCoop(): Promise<string> {
  await leaveCoop();
  const code = generateJoinCode();
  store().setMultiplayer({ netRole: 'host', mpStatus: 'hosting', mpCode: code, mpError: null, mpPartnerConnected: false });
  useGameStore.setState({ gameMode: 'coop' });

  handle = hostPeer(code);
  handle.peer.on('error', (err) => store().setMultiplayer({ mpStatus: 'error', mpError: String(err) }));
  try {
    const transport = await handle.transport;
    netSession.attach(transport, 'host');
    wireHostHandlers();
    store().setMultiplayer({ mpStatus: 'connected', mpPartnerConnected: true });
  } catch (err) {
    store().setMultiplayer({ mpStatus: 'error', mpError: String(err) });
  }
  return code;
}

/** Join an existing co-op game by its code. */
export async function joinCoop(rawCode: string): Promise<void> {
  const code = normalizeJoinCode(rawCode);
  if (!isValidJoinCode(code)) {
    store().setMultiplayer({ netRole: 'guest', mpStatus: 'error', mpError: 'INVALID CODE', mpCode: code });
    return;
  }
  await leaveCoop();
  store().setMultiplayer({ netRole: 'guest', mpStatus: 'connecting', mpCode: code, mpError: null, mpPartnerConnected: false });
  useGameStore.setState({ gameMode: 'coop' });

  handle = joinPeer(code);
  handle.peer.on('error', (err) =>
    store().setMultiplayer({ mpStatus: 'error', mpError: friendlyError(String(err)) })
  );
  try {
    const transport = await handle.transport;
    netSession.attach(transport, 'guest');
    wireGuestHandlers();
    store().setMultiplayer({ mpStatus: 'connected', mpPartnerConnected: true });
  } catch (err) {
    store().setMultiplayer({ mpStatus: 'error', mpError: friendlyError(String(err)) });
  }
}

/** Tear down any active session and reset multiplayer state. */
export async function leaveCoop(): Promise<void> {
  try {
    netSession.close();
  } catch {
    /* ignore */
  }
  if (handle) {
    handle.destroy();
    handle = null;
  }
  resetMpRuntime();
  store().setMultiplayer({ netRole: 'none', mpStatus: 'idle', mpCode: '', mpError: null, mpPartnerConnected: false });
  // Restore the player's last solo mode so 'coop' doesn't leak into single-player.
  useGameStore.setState({ gameMode: loadLastMode() as GameMode });
}
