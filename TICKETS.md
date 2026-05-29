# 🗡️ LOTR Typing Game — Improvement Tickets

100 tickets to forge this game into something legendary. Focus areas: **Gameplay & Features** and **Polish & UX/UI**, plus a crazy-amazing **About** page.

Status legend: `[ ]` todo · `[x]` done

---

## EPIC A — The "About Middle-earth" Page (crazy amazing)

- [ ] #1  Create `About.tsx` overlay component wired into the menu (`menuStep: 'about'`)
- [ ] #2  Add an **ABOUT** button to the main menu
- [ ] #3  Animated glowing title with shimmering gold gradient
- [ ] #4  The One Ring inscription that fades in with an ember glow ("One Ring to rule them all…")
- [ ] #5  Animated starfield / floating-ember background behind the page
- [ ] #6  Live falling-word ticker showing LOTR words drifting in the backdrop
- [ ] #7  "The Fellowship" section — animated cards for each member
- [ ] #8  "Realms of Middle-earth" lore section with location blurbs
- [ ] #9  Personal stats panel (high score, words typed, games played, achievements)
- [ ] #10 Scroll-reveal animations as sections enter the viewport
- [ ] #11 Parallax depth on background layers as you scroll
- [ ] #12 Easter egg: type `mellon` to "speak friend and enter" (unlocks a surprise)
- [ ] #13 Easter egg: Konami code triggers a Balrog cameo
- [ ] #14 Tech-stack credits section with version badges
- [ ] #15 "How it's built" architecture blurb (Phaser + React hybrid)
- [ ] #16 Custom pixel scrollbar styling for the page
- [ ] #17 Smooth back-to-menu transition with fade
- [ ] #18 Fully keyboard-accessible (Esc closes, focus-visible rings)

## EPIC B — LOTR Word System

- [ ] #19 Replace generic fantasy words with categorized LOTR vocabulary
- [ ] #20 Category: Characters (frodo, gandalf, aragorn, legolas, gimli…)
- [ ] #21 Category: Places (mordor, rivendell, gondor, rohan, moria…)
- [ ] #22 Category: Creatures (balrog, nazgul, orc, ent, warg…)
- [ ] #23 Category: Items & artifacts (mithril, palantir, anduril, sting…)
- [ ] #24 Difficulty tiers (easy/medium/hard) by word length
- [ ] #25 Multi-word phrases for hard mode ("you shall not pass")
- [ ] #26 `getWordByLevel(level)` picks tier based on level
- [ ] #27 `getWordCategory(word)` for color-coding
- [ ] #28 Avoid immediate repeat of the same word
- [ ] #29 Keep backward-compatible `getRandomWord()` / `getWordList()`
- [ ] #30 Unit tests for the new word system

## EPIC C — Game Modes & Lives

- [ ] #31 Add a **lives** system (configurable, default 3)
- [ ] #32 A word reaching the bottom costs a life instead of instant game-over
- [ ] #33 Game over only when lives hit 0
- [ ] #34 Lives shown in the HUD as heart pips
- [ ] #35 New mode: **Zen** (no game over, relax & type)
- [ ] #36 New mode: **Hardcore** (a single mistake ends the run)
- [ ] #37 Game-mode picker on the character/start screen
- [ ] #38 Per-mode descriptions and theming
- [ ] #39 Mode is persisted as the last-played default
- [ ] #40 Auto-pause when the window loses focus
- [ ] #41 Resume countdown when unpausing from blur
- [ ] #42 Hardcore badge/indicator in HUD
- [ ] #43 Zen mode hides the danger-driven UI stress cues
- [ ] #44 Unit tests for lives + mode logic in the store

## EPIC D — Power-ups

- [ ] #45 Power-up framework (`utils/powerups.ts`) with typed effects
- [ ] #46 FREEZE — occasionally a special word freezes all words for 3s
- [ ] #47 Special power-up words render with a distinct golden style
- [ ] #48 Power-up spawn chance scales gently with level
- [ ] #49 On-screen banner when a power-up activates
- [ ] #50 Unit tests for power-up selection & timing

## EPIC E — Visual Polish & Juice

- [ ] #51 Color-code falling words by category
- [ ] #52 Combo escalates word/panel glow color
- [ ] #53 Floating "COMBO xN" callout on milestone combos
- [ ] #54 Level-up screen flash + banner
- [ ] #55 Pulsing danger line near the bottom of the play field
- [ ] #56 Words tint red as they approach the danger line
- [ ] #57 HUD score "pops" (scale pulse) when it increases
- [ ] #58 Animated combo meter bar in the HUD
- [ ] #59 Richer completion particle burst tuned by word length
- [ ] #60 Subtle vignette pulse on miss
- [ ] #61 Title screen ambient floating embers
- [ ] #62 Button hover/press micro-animations across menus
- [ ] #63 Two extra color themes (Mithril / Mordor)
- [ ] #64 Theme also recolors in-game background gradient
- [ ] #65 Smooth fade transitions between menu steps
- [ ] #66 Countdown numbers scale-bounce in
- [ ] #67 Game-over stats count up from zero
- [ ] #68 Consistent pixel-art focus outlines on all buttons

## EPIC F — Audio

- [ ] #69 Replace missing-mp3 playback with synthesized WebAudio SFX
- [ ] #70 Distinct tones: keypress, word-complete, combo, miss, game-over
- [ ] #71 Rising combo pitch as combo grows
- [ ] #72 Master volume setting (0–100%)
- [ ] #73 Respect the existing sound on/off toggle
- [ ] #74 Lazy-init AudioContext on first user gesture (autoplay policy)
- [ ] #75 Graceful no-op in test/jsdom environments
- [ ] #76 Unit tests for the audio module's guards

## EPIC G — Accessibility & UX

- [ ] #77 Reduced-motion setting that disables screen shake & heavy anim
- [ ] #78 High-contrast color theme
- [ ] #79 aria-labels on all menu buttons
- [ ] #80 Visible focus rings (keyboard navigation)
- [ ] #81 Respect `prefers-reduced-motion` by default
- [ ] #82 Larger, configurable in-game word font option
- [ ] #83 Pause overlay reachable & operable by keyboard
- [ ] #84 Color choices checked for colorblind legibility (category palette)

## EPIC H — Settings & Persistence

- [ ] #85 Volume slider in settings
- [ ] #86 Reduced-motion toggle in settings
- [ ] #87 Lives-count selector in settings
- [ ] #88 Extended lifetime stats (`utils/statistics.ts`): games, words, time
- [ ] #89 Persist & restore extended stats
- [ ] #90 "Reset progress" button (clears scores/achievements/stats)
- [ ] #91 Settings versioning/migration safety in persistence
- [ ] #92 Unit tests for settings + statistics persistence

## EPIC I — Achievements

- [ ] #93 ~12 new LOTR-flavored achievements
- [ ] #94 Toast notification when an achievement unlocks
- [ ] #95 Achievement progress reflected in the overlay (locked/unlocked)
- [ ] #96 "Speak Friend" achievement from the About easter egg
- [ ] #97 Unit tests for the expanded achievement checks

## EPIC J — Code Health, Tests & Docs

- [ ] #98 Add `npm run typecheck` + keep strict build green
- [ ] #99 Update README with new features, modes & screenshots blurb
- [ ] #100 Comprehensive test pass — all suites green
</content>
