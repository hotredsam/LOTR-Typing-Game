# 🗡️ LOTR Typing Game — Improvement Tickets

100 tickets to forge this game into something legendary. Focus areas: **Gameplay & Features** and **Polish & UX/UI**, plus a crazy-amazing **About** page.

Status legend: `[ ]` todo · `[x]` done

---

## EPIC A — The "About Middle-earth" Page (crazy amazing)

- [x] #1  Create `About.tsx` overlay component wired into the menu (`menuStep: 'about'`)
- [x] #2  Add an **ABOUT** button to the main menu
- [x] #3  Animated glowing title with shimmering gold gradient
- [x] #4  The One Ring inscription that fades in with an ember glow ("One Ring to rule them all…")
- [x] #5  Animated starfield / floating-ember background behind the page
- [x] #6  Live falling-word ticker showing LOTR words drifting in the backdrop
- [x] #7  "The Fellowship" section — animated cards for each member
- [x] #8  "Realms of Middle-earth" lore section with location blurbs
- [x] #9  Personal stats panel (high score, words typed, games played, achievements)
- [x] #10 Scroll-reveal animations as sections enter the viewport
- [x] #11 Parallax depth on background layers as you scroll
- [x] #12 Easter egg: type `mellon` to "speak friend and enter" (unlocks a surprise)
- [x] #13 Easter egg: Konami code triggers a Balrog cameo
- [x] #14 Tech-stack credits section with version badges
- [x] #15 "How it's built" architecture blurb (Phaser + React hybrid)
- [x] #16 Custom pixel scrollbar styling for the page
- [x] #17 Smooth back-to-menu transition with fade
- [x] #18 Fully keyboard-accessible (Esc closes, focus-visible rings)

## EPIC B — LOTR Word System

- [x] #19 Replace generic fantasy words with categorized LOTR vocabulary
- [x] #20 Category: Characters (frodo, gandalf, aragorn, legolas, gimli…)
- [x] #21 Category: Places (mordor, rivendell, gondor, rohan, moria…)
- [x] #22 Category: Creatures (balrog, nazgul, orc, ent, warg…)
- [x] #23 Category: Items & artifacts (mithril, palantir, anduril, sting…)
- [x] #24 Difficulty tiers (easy/medium/hard) by word length
- [x] #25 Multi-word phrases for hard mode ("you shall not pass")
- [x] #26 `getWordByLevel(level)` picks tier based on level
- [x] #27 `getWordCategory(word)` for color-coding
- [x] #28 Avoid immediate repeat of the same word
- [x] #29 Keep backward-compatible `getRandomWord()` / `getWordList()`
- [x] #30 Unit tests for the new word system

## EPIC C — Game Modes & Lives

- [x] #31 Add a **lives** system (configurable, default 3)
- [x] #32 A word reaching the bottom costs a life instead of instant game-over
- [x] #33 Game over only when lives hit 0
- [x] #34 Lives shown in the HUD as heart pips
- [x] #35 New mode: **Zen** (no game over, relax & type)
- [x] #36 New mode: **Hardcore** (a single mistake ends the run)
- [x] #37 Game-mode picker on the character/start screen
- [x] #38 Per-mode descriptions and theming
- [x] #39 Mode is persisted as the last-played default
- [x] #40 Auto-pause when the window loses focus
- [x] #41 Resume countdown when unpausing from blur
- [x] #42 Hardcore badge/indicator in HUD
- [x] #43 Zen mode hides the danger-driven UI stress cues
- [x] #44 Unit tests for lives + mode logic in the store

## EPIC D — Power-ups

- [x] #45 Power-up framework (`utils/powerups.ts`) with typed effects
- [x] #46 FREEZE — occasionally a special word freezes all words for 3s
- [x] #47 Special power-up words render with a distinct golden style
- [x] #48 Power-up spawn chance scales gently with level
- [x] #49 On-screen banner when a power-up activates
- [x] #50 Unit tests for power-up selection & timing

## EPIC E — Visual Polish & Juice

- [x] #51 Color-code falling words by category
- [x] #52 Combo escalates word/panel glow color
- [x] #53 Floating "COMBO xN" callout on milestone combos
- [x] #54 Level-up screen flash + banner
- [x] #55 Pulsing danger line near the bottom of the play field
- [x] #56 Words tint red as they approach the danger line
- [x] #57 HUD score "pops" (scale pulse) when it increases
- [x] #58 Animated combo meter bar in the HUD
- [x] #59 Richer completion particle burst tuned by word length
- [x] #60 Subtle vignette pulse on miss
- [x] #61 Title screen ambient floating embers
- [x] #62 Button hover/press micro-animations across menus
- [x] #63 Two extra color themes (Mithril / Mordor)
- [x] #64 Theme also recolors in-game background gradient
- [x] #65 Smooth fade transitions between menu steps
- [x] #66 Countdown numbers scale-bounce in
- [x] #67 Game-over stats count up from zero
- [x] #68 Consistent pixel-art focus outlines on all buttons

## EPIC F — Audio

- [x] #69 Replace missing-mp3 playback with synthesized WebAudio SFX
- [x] #70 Distinct tones: keypress, word-complete, combo, miss, game-over
- [x] #71 Rising combo pitch as combo grows
- [x] #72 Master volume setting (0–100%)
- [x] #73 Respect the existing sound on/off toggle
- [x] #74 Lazy-init AudioContext on first user gesture (autoplay policy)
- [x] #75 Graceful no-op in test/jsdom environments
- [x] #76 Unit tests for the audio module's guards

## EPIC G — Accessibility & UX

- [x] #77 Reduced-motion setting that disables screen shake & heavy anim
- [x] #78 High-contrast color theme
- [x] #79 aria-labels on all menu buttons
- [x] #80 Visible focus rings (keyboard navigation)
- [x] #81 Respect `prefers-reduced-motion` by default
- [x] #82 Larger, configurable in-game word font option
- [x] #83 Pause overlay reachable & operable by keyboard
- [x] #84 Color choices checked for colorblind legibility (category palette)

## EPIC H — Settings & Persistence

- [x] #85 Volume slider in settings
- [x] #86 Reduced-motion toggle in settings
- [x] #87 Lives-count selector in settings
- [x] #88 Extended lifetime stats (`utils/statistics.ts`): games, words, time
- [x] #89 Persist & restore extended stats
- [x] #90 "Reset progress" button (clears scores/achievements/stats)
- [x] #91 Settings versioning/migration safety in persistence
- [x] #92 Unit tests for settings + statistics persistence

## EPIC I — Achievements

- [x] #93 ~12 new LOTR-flavored achievements
- [x] #94 Toast notification when an achievement unlocks
- [x] #95 Achievement progress reflected in the overlay (locked/unlocked)
- [x] #96 "Speak Friend" achievement from the About easter egg
- [x] #97 Unit tests for the expanded achievement checks

## EPIC J — Code Health, Tests & Docs

- [x] #98 Add `npm run typecheck` + keep strict build green
- [x] #99 Update README with new features, modes & screenshots blurb
- [x] #100 Comprehensive test pass — all suites green
</content>
