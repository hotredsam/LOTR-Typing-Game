# Lord of the Rings: Typing Game

A high-stakes, Lord of the Rings themed typing game where your speed and accuracy determine the fate of Middle-earth. Developed using a unique multi-agent orchestration system, this game combines the power of Phaser for immersive gameplay and React for a sleek, responsive UI.

## Features

- **Immersive Gameplay**: Experience the world of Middle-earth through a typing-based combat and progression system.
- **Phaser Game Engine**: Smooth animations and high-performance game logic.
- **Dynamic UI**: React-based interface powered by Zustand for efficient state management.
- **Multi-Agent Development**: Built using a sophisticated orchestration system involving multiple AI agents (Codex, Gemini, Claude).
- **Comprehensive Testing**: Robust test suite using Vitest and React Testing Library.

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
