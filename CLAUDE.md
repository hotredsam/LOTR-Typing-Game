# LOTR Typing Game

A Lord of the Rings themed typing game where players type falling words to defend Middle-earth. Built with Phaser 3 for game rendering and React 18 for the UI overlay, using Zustand for state management. Words fall from the top of an 800x600 canvas; typing them correctly earns points, combos, and achievements.

## Tech Stack

| Technology     | Version | Purpose                        |
|----------------|---------|--------------------------------|
| TypeScript     | ^5.2    | Primary language (strict mode) |
| React          | ^18.2   | UI overlays (HUD, menus)       |
| Phaser         | ^3.80   | Game engine (Arcade physics)   |
| Zustand        | ^4.5    | Global state management        |
| Vite           | ^5.2    | Dev server and bundler         |
| Vitest         | ^1.3    | Testing framework              |
| @testing-library/react | ^14.2 | Component testing       |

Node.js 18+ and npm 9+ required.

## Folder Structure

```
src/
  App.tsx                  # Root component, initializes Phaser game
  main.tsx                 # React entry point
  index.css                # Global styles
  components/              # React UI overlays
    MainMenu.tsx           # Title screen with play/settings/credits
    CharacterSelect.tsx    # Character picker before game start
    HUD.tsx                # In-game heads-up display (score, WPM, combo)
    GameOver.tsx           # End-of-game stats and leaderboard
    PauseOverlay.tsx       # Pause screen
    CountdownOverlay.tsx   # 3-2-1 countdown before gameplay
    SettingsOverlay.tsx    # Sound, color theme, timed duration
    AchievementsOverlay.tsx
    HowToPlay.tsx
    Credits.tsx
  game/
    BootScene.ts           # Phaser boot scene (asset loading)
    MainScene.ts           # Core gameplay loop (word spawning, input, scoring)
    InputHandler.ts        # Keyboard input capture for the game
    assets.ts              # Asset manifest
  stores/
    useGameStore.ts        # Zustand store: game phase, score, settings, persistence
  types/
    game.ts                # TypeScript interfaces (IWord, IGameState)
  utils/
    wordGenerator.ts       # Generates LOTR-themed words by difficulty
    scoring.ts             # Points calculation, combos, length/speed bonuses
    difficultyManager.ts   # Spawn rate and fall speed based on level
    sound.ts               # Sound effect helpers
    achievements.ts        # Achievement definitions and unlock logic
    persistence.ts         # localStorage read/write for high scores, settings
  styles/
    terrariaUI.ts          # Pixel-art inspired UI style constants
  test/
    setup.ts               # Vitest setup file (jsdom, @testing-library/jest-dom)
public/
  index.html               # HTML template
dist/                      # Production build output
```

## Build, Run, and Test

```bash
npm install              # Install dependencies
npm run dev              # Start Vite dev server at http://localhost:5173
npm run build            # TypeScript check + Vite production build -> dist/
npm run preview          # Preview the production build locally
npm run test             # Run Vitest in watch mode
npm run test:run         # Run Vitest once (CI-friendly)
```

## Code Style

- Strict TypeScript (`"strict": true` in tsconfig.json).
- Target ESNext, module ESNext, jsx: react-jsx.
- No allowJs -- all source is TypeScript.
- Functional React components with hooks.
- State management exclusively through the Zustand `useGameStore` hook.
- Vitest with jsdom environment, globals enabled, setup file at `src/test/setup.ts`.
- Test files are co-located with source using `.test.ts` / `.test.tsx` suffixes.

## Patterns

- **Phaser + React hybrid**: Phaser runs in a `<div id="game-container">` while React overlays sit on top with `position: absolute`. React does NOT render inside Phaser scenes.
- **Zustand as single source of truth**: Both React components and Phaser scenes read/write the same store via `useGameStore.getState()` (from Phaser) and `useGameStore((s) => s.field)` (from React).
- **Game phases**: The `gamePhase` field drives all UI transitions: `menu`, `countdown`, `playing`, `paused`, `gameOver`. Components conditionally render based on this.
- **Difficulty scaling**: Level increments every 500 points. `difficultyManager.ts` maps level to spawn rate and fall speed.
- **localStorage persistence**: High scores, leaderboard, achievements, and settings are persisted via `persistence.ts` helpers.

## Important Files -- Do Not Delete

- `src/stores/useGameStore.ts` -- Central state; almost every file imports it.
- `src/game/MainScene.ts` -- Core gameplay loop and word display logic.
- `src/types/game.ts` -- Shared interfaces used across the entire codebase.
- `src/utils/persistence.ts` -- localStorage keys; changing these breaks saved data.
- `vite.config.ts` -- Contains both Vite and Vitest configuration.

## Gotchas and Warnings

- Do NOT add `allowJs: true` to tsconfig.json. The project is strictly TypeScript-only.
- Do NOT import React components inside Phaser scenes. Use `useGameStore.getState()` or `useGameStore.setState()` to communicate between Phaser and React.
- Do NOT mutate `activeWords` directly -- always use `addWord` / `removeWord` actions on the store.
- The Phaser game is created once in `App.tsx` and destroyed on unmount. Do NOT create multiple Phaser.Game instances.
- The game canvas is fixed at 800x600 with `pixelArt: true` and `roundPixels: true`. Changing these dimensions requires updating multiple hardcoded values in MainScene and App.
- The `outputs/agent_deliverables/` folder contains auto-generated agent output files. These are artifacts, not runnable source code.
- The `tools/`, `prompts/`, `logs/`, and `docs/` directories are orchestration infrastructure. They do not affect the game runtime.
