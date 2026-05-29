# TESTING — Local Verification Guide

A step-by-step plan for verifying the LOTR Typing Game locally. Written so a local
**Claude Code** session (or a human) can execute it end-to-end and report results.
Work top to bottom; each section says **what to run/do** and **what "pass" looks like**.

## 0. Prerequisites

- Node.js 18+ and npm 9+.
- Install dependencies once:
  ```bash
  npm install
  ```

---

## 1. Automated checks (must all pass)

Run from the repo root:

```bash
npm run typecheck   # tsc --noEmit  → no output
npm run lint        # eslint src    → no output / no errors
npm run test:run    # vitest run    → all suites green
npm run build       # tsc && vite build → "✓ built", only the Phaser chunk-size warning
```

**Pass:** typecheck clean, lint clean, **all tests pass** (currently 106), build succeeds.
The only acceptable build warning is the Phaser bundle "chunks larger than 500 kB" note.

> A local agent can capture each command's exit code; any non-zero (other than the
> benign chunk-size warning) is a failure to report.

---

## 2. Run the app

```bash
npm run dev
```

Open http://localhost:5173. The main menu should appear with animated embers and a
shimmering title. (Pixel font "Press Start 2P" loads from Google Fonts — needs network.)

---

## 3. Solo gameplay checklist

Pick **BEGIN MISSION → choose a hero → pick a mode → START**.

- [ ] Words fall; typing the first letter "locks" a word, finishing it scores points.
- [ ] Combo multiplier rises; a **COMBO xN** callout appears on milestones (every 5).
- [ ] Words turn **red** as they near the danger line, and the red **clears** if a
      `slow`/`freeze` power-up pushes them back up (regression check for the tint bug).
- [ ] **Power-ups**: completing a golden special word triggers Freeze/Slow/Clear/Shield/
      Double with a banner. Completing an ordinary word that happens to share a name
      (e.g. "ent", "eagle", "mithril") must **NOT** trigger a power-up (regression check).
- [ ] **Lives**: a dropped word costs a heart (HUD pips); game over at 0.
- [ ] **Modes**: Endless (lives), Timed (clock), Zen (no game over), Hardcore (1 mistake ends).
- [ ] **Level up**: flash + "LEVEL n" banner as score climbs.
- [ ] **Long phrases** (level 7+) stay fully on-screen (no right-edge overflow).
- [ ] **Pause**: Esc/P pauses and resumes; switching browser tabs auto-pauses (solo only).
- [ ] **Game over**: score counts up from zero; leaderboard + last words shown; R restarts.

## 4. Menus, settings, accessibility

- [ ] **Settings**: volume slider changes SFX loudness; theme buttons recolor the
      background (try Mithril/Mordor/Contrast); lives selector; word-size; **Reset progress**
      (double-click to confirm) clears high score/leaderboard/achievements.
- [ ] **Reduced motion** ON: screen shake/flash and heavy animations stop. Also verify the
      OS-level `prefers-reduced-motion` is respected by default.
- [ ] **Achievements** overlay: progress bar + locked/unlocked icons.
- [ ] **About** page: animated title, Ring inscription fades in, Fellowship/Realms,
      personal stats. Easter eggs: type **`mellon`** (unlocks "Speak Friend" + toast);
      Konami code (↑↑↓↓←→←→ B A) shows a Balrog cameo. Esc returns to menu.
- [ ] Keyboard nav: Tab moves between buttons with a visible gold focus ring.

## 5. Co-op multiplayer (two browsers)

> Requires internet — co-op uses PeerJS's public signaling broker over WebRTC.
> If your environment blocks it, note that and rely on the automated net tests in
> `src/net/net.test.ts` (loopback) for the sync logic.

1. Open the app in **two** browser windows (A and B; can be different machines / a PC and a Mac).
2. In A: **CO-OP MULTIPLAYER → Create Game**. Copy the 5-letter code.
3. In B: **CO-OP MULTIPLAYER → Join**, enter the code → A shows "FRIEND CONNECTED".
4. In A: **Start Co-op**.

Verify:
- [ ] Both windows show the **same falling words** in sync.
- [ ] Each player's typing is a **different color** (yours green, partner's blue).
- [ ] **Score and lives are shared** and identical on both screens.
- [ ] Sounds/effects mirror to the guest (completes, power-ups, level-ups).
- [ ] **Game over** happens on both; host's **Play Again** restarts both via a countdown.
- [ ] **Disconnect**: close one window mid-game → the other shows a
      **"PARTNER DISCONNECTED → Return to Menu"** banner (no soft-lock).
- [ ] Invalid join code shows a friendly error ("NO GAME WITH THAT CODE").

## 6. Visual assets (after art is uploaded)

Assets are optional; the game renders procedurally without them and upgrades when present.

- Place files in `public/assets/<category>/` exactly as named in `assetsneeded.md`.
- [ ] With assets present: backgrounds/sprites/particles render; the game still runs.
- [ ] With a file missing/renamed: it falls back to the procedural version (no crash,
      a 404 for that asset in the Network tab is expected and harmless).

---

## 7. Reporting

For each section, report **pass/fail**, the command output or a screenshot for visuals,
and repro steps for any failure. Automated checks (Section 1) are the gate; manual
sections are confidence checks. The same four commands run in CI
(`.github/workflows/ci.yml`) on every push/PR.
</content>
