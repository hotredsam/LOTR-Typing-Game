# Lord of the Rings: Typing Game

A high-stakes, Lord of the Rings themed typing game where your speed and accuracy determine the fate of Middle-earth. Developed using a unique multi-agent orchestration system, this game combines the power of Phaser for immersive gameplay and React for a sleek, responsive UI.

## Features

- **Type to defend Middle-earth**: Words fall from the sky — type them before they hit the ground.
- **Authentic LOTR vocabulary**: Characters, places, creatures, artifacts, and famous phrases, colour-coded by category and ramped across difficulty tiers.
- **Four game modes**:
  - **Endless** — survive as long as you can with a configurable lives system.
  - **Timed** — race the clock for the highest score.
  - **Zen** — no game over; just type and relax.
  - **Hardcore** — a single mistake ends the run.
- **Power-ups**: Catch special golden words to trigger **Freeze**, **Slow**, **Clear**, **Shield**, and **Double Score** effects.
- **Combos & juice**: Combo multipliers, floating callouts, level-up flashes, particle bursts, a pulsing danger line, and screen shake (all respecting reduced-motion).
- **21 achievements** with unlock toasts and a progress tracker.
- **A crazy-amazing About page**: animated Middle-earth lore, the One Ring inscription, the Fellowship, realms, your personal stats, and a couple of hidden easter eggs (try typing `mellon`…).
- **Accessibility & settings**: master volume, reduced motion, configurable lives, word size, six colour themes (incl. high-contrast), and a reset-progress option — all persisted to `localStorage`.
- **Comprehensive Testing**: 90+ tests using Vitest and React Testing Library.

## Prerequisites

- **Node.js**: Version 18.x or higher recommended.
- **npm**: Version 9.x or higher.

## Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hotredsam/LOTR-Typing-Game.git
   cd LOTR-Typing-Game
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open the game**:
   Navigate to `http://localhost:5173` in your browser.

## Build for Production

To create an optimized production build:

```bash
npm run build
```

The output will be in the `dist/` directory, ready for deployment.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server at `http://localhost:5173`. |
| `npm run build` | Type-check and produce a production build in `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run typecheck` | Run the TypeScript compiler in no-emit mode. |
| `npm run test` | Run Vitest in watch mode. |
| `npm run test:run` | Run the full test suite once (CI-friendly). |

## How to Play

- Type the first letter of any falling word to lock onto it, then finish the word before it reaches the bottom.
- Chain words without mistakes to build a combo multiplier (up to 3×).
- Longer words and faster completion award bonus points.
- Press **Esc** or **P** to pause, **F** to toggle fullscreen.
- Pick your mode and hero on the start screen; tune everything else in **Settings**.

## Technologies Used

- **Phaser 3**: Core game engine.
- **React 18**: UI framework.
- **Zustand**: State management.
- **TypeScript**: Type-safe development.
- **Vite**: Ultra-fast build tool and dev server.
- **Vitest**: Testing framework.

## Project Structure

- `src/`: Core game and UI logic.
- `assets/`: Textures, audio, and other game assets.
- `docs/`: Technical specifications and architectural diagrams.
- `tasks/`: Orchestration tasks for AI agents.
- `prompts/`: System prompts for the multi-agent system.
- `tools/`: Utility scripts and development tools.
