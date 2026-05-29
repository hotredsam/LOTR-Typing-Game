import { describe, it, expect, vi } from 'vitest'
import {
  generateJoinCode,
  normalizeJoinCode,
  isValidJoinCode,
  peerIdForCode,
  encode,
  decode,
  NetSnapshot,
} from './protocol'
import { LoopbackTransport } from './transport'
import { NetSession } from './session'
import { useGameStore } from '../stores/useGameStore'

const tick = () => new Promise((r) => setTimeout(r, 0))

const snap: NetSnapshot = {
  phase: 'playing',
  words: [{ id: 'a', text: 'frodo', x: 100, y: 50, speed: 80, power: false }],
  host: { id: 'a', len: 2 },
  guest: { id: null, len: 0 },
  score: 120,
  combo: 3,
  lives: 3,
  level: 1,
  wordsCompleted: 4,
  countdownNumber: 0,
  wpm: 55,
  accuracy: 98,
}

describe('protocol', () => {
  it('generates valid 5-char codes', () => {
    for (let i = 0; i < 50; i++) expect(isValidJoinCode(generateJoinCode())).toBe(true)
  })

  it('a generated code survives normalization unchanged', () => {
    for (let i = 0; i < 50; i++) {
      const c = generateJoinCode()
      expect(normalizeJoinCode(c)).toBe(c)
    }
  })

  it('normalizes lowercase / spaces / dashes', () => {
    const c = generateJoinCode()
    const messy = ` ${c.toLowerCase().split('').join('-')} `
    expect(normalizeJoinCode(messy)).toBe(c)
  })

  it('rejects malformed codes', () => {
    expect(isValidJoinCode('ABC')).toBe(false)
    expect(isValidJoinCode('ABCDEF')).toBe(false)
    expect(isValidJoinCode('AB!CD')).toBe(false)
  })

  it('peer id is namespaced and stable', () => {
    expect(peerIdForCode('GANDF')).toBe('lotr-typing-coop-GANDF')
  })

  it('encode/decode round-trips known messages', () => {
    expect(decode(encode({ t: 'key', c: 'x' }))).toEqual({ t: 'key', c: 'x' })
    expect(decode(encode({ t: 'sync', s: snap }))).toEqual({ t: 'sync', s: snap })
  })

  it('decode rejects junk and unknown types', () => {
    expect(decode('not json')).toBeNull()
    expect(decode(JSON.stringify({ t: 'bogus' }))).toBeNull()
    expect(decode(null)).toBeNull()
  })
})

describe('LoopbackTransport + NetSession (host <-> guest)', () => {
  it('delivers guest keys to the host and snapshots to the guest', async () => {
    const [hostT, guestT] = LoopbackTransport.createPair()
    const host = new NetSession()
    const guest = new NetSession()

    const keysAtHost: string[] = []
    const snapsAtGuest: NetSnapshot[] = []

    host.attach(hostT, 'host', { onKey: (c) => keysAtHost.push(c) })
    guest.attach(guestT, 'guest', { onSnapshot: (s) => snapsAtGuest.push(s) })

    // Wait for the loopback channel to open.
    await new Promise((r) => setTimeout(r, 0))

    guest.sendKey('f')
    guest.sendKey('r')
    host.broadcast(snap, true)

    await new Promise((r) => setTimeout(r, 0))

    expect(keysAtHost).toEqual(['f', 'r'])
    expect(snapsAtGuest).toHaveLength(1)
    expect(snapsAtGuest[0].score).toBe(120)
  })

  it('throttles broadcasts but honors force', async () => {
    let clock = 1000
    const [hostT, guestT] = LoopbackTransport.createPair()
    const host = new NetSession(() => clock)
    const guest = new NetSession()
    const received: NetSnapshot[] = []
    host.attach(hostT, 'host')
    guest.attach(guestT, 'guest', { onSnapshot: (s) => received.push(s) })
    await new Promise((r) => setTimeout(r, 0))

    host.broadcast(snap) // first one passes
    host.broadcast(snap) // immediately after -> throttled
    clock += 100
    host.broadcast(snap) // enough time elapsed -> passes
    await new Promise((r) => setTimeout(r, 0))

    expect(received.length).toBe(2)
  })

  it('guest does not act on guest-only messages sent to a host role', async () => {
    const [hostT, guestT] = LoopbackTransport.createPair()
    const host = new NetSession()
    const guest = new NetSession()
    const hostSnaps: NetSnapshot[] = []
    // Host should ignore inbound 'sync' (only a guest applies snapshots).
    host.attach(hostT, 'host', { onSnapshot: (s) => hostSnaps.push(s) })
    guest.attach(guestT, 'guest')
    await new Promise((r) => setTimeout(r, 0))

    // Guest (incorrectly) broadcasts; host must not apply it.
    guest.broadcast(snap, true)
    await new Promise((r) => setTimeout(r, 0))
    expect(hostSnaps).toHaveLength(0)
  })

  it('a host snapshot maps onto the guest store (co-op data flow)', async () => {
    const [hostT, guestT] = LoopbackTransport.createPair()
    const host = new NetSession()
    const guest = new NetSession()
    host.attach(hostT, 'host')
    // Mirror what coopController does on the guest side.
    guest.attach(guestT, 'guest', {
      onSnapshot: (s) =>
        useGameStore.setState({
          gamePhase: s.phase,
          isGameOver: s.phase === 'gameOver',
          score: s.score,
          lives: s.lives,
          level: s.level,
          wordsCompleted: s.wordsCompleted,
        }),
    })
    await tick()

    host.broadcast({ ...snap, phase: 'playing', score: 777, lives: 2, level: 4, wordsCompleted: 9 }, true)
    await tick()

    const st = useGameStore.getState()
    expect(st.score).toBe(777)
    expect(st.lives).toBe(2)
    expect(st.level).toBe(4)
    expect(st.gamePhase).toBe('playing')
    expect(st.isGameOver).toBe(false)
  })

  it('close notifies the peer', async () => {
    const [hostT, guestT] = LoopbackTransport.createPair()
    const host = new NetSession()
    const guest = new NetSession()
    const onClose = vi.fn()
    host.attach(hostT, 'host')
    guest.attach(guestT, 'guest', { onClose })
    await new Promise((r) => setTimeout(r, 0))

    host.close()
    await new Promise((r) => setTimeout(r, 0))
    expect(onClose).toHaveBeenCalled()
  })
})
