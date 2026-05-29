/**
 * Mutable bridge between the netcode and the Phaser scene.
 *
 * Kept in its own module (no store / no PeerJS imports) so both the
 * coopController and MainScene can depend on it without creating an import
 * cycle. The scene assigns the callbacks; the controller invokes them.
 */

import type { NetSnapshot, FxKind } from './protocol';

export interface MpRuntime {
  /** Latest authoritative snapshot (guest reads this every frame). */
  latestSnapshot: NetSnapshot | null;
  /** Host: invoked when the guest presses a key. */
  onGuestKey: ((char: string) => void) | null;
  /** Guest: invoked for one-shot effects (sound/juice). */
  onFx: ((kind: FxKind, info: { combo?: number; label?: string }) => void) | null;
  /** Guest: invoked when the host starts a fresh round. */
  onRestart: (() => void) | null;
}

export const mpRuntime: MpRuntime = {
  latestSnapshot: null,
  onGuestKey: null,
  onFx: null,
  onRestart: null,
};

export function resetMpRuntime(): void {
  mpRuntime.latestSnapshot = null;
  mpRuntime.onGuestKey = null;
  mpRuntime.onFx = null;
  mpRuntime.onRestart = null;
}
