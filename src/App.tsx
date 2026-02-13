import React, { useEffect, useRef, useCallback } from 'react';
import Phaser from 'phaser';
import BootScene from './game/BootScene';
import MainScene from './game/MainScene';
import HUD from './components/HUD';
import GameOver from './components/GameOver';
import MainMenu from './components/MainMenu';
import CharacterSelect from './components/CharacterSelect';
import PauseOverlay from './components/PauseOverlay';
import CountdownOverlay from './components/CountdownOverlay';
import HowToPlay from './components/HowToPlay';
import Credits from './components/Credits';
import SettingsOverlay from './components/SettingsOverlay';
import AchievementsOverlay from './components/AchievementsOverlay';
import { useGameStore } from './stores/useGameStore';
import { setSoundEnabled } from './utils/sound';

const App: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const gamePhase = useGameStore((state) => state.gamePhase);
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const colorTheme = useGameStore((state) => state.colorTheme);

  useEffect(() => {
    useGameStore.getState().hydrateFromStorage();
  }, []);

  useEffect(() => {
    setSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    if (!gameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: 'game-container',
        width: 800,
        height: 600,
        pixelArt: true,
        roundPixels: true,
        scene: [BootScene, MainScene],
        physics: {
          default: 'arcade',
          arcade: { debug: false },
        },
      };

      gameRef.current = new Phaser.Game(config);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const handleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen?.();
        useGameStore.setState({ isFullscreen: true });
      } else {
        document.exitFullscreen?.();
        useGameStore.setState({ isFullscreen: false });
      }
    } catch {
      useGameStore.getState().toggleFullscreen();
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        if (gamePhase === 'playing' || gamePhase === 'paused') handleFullscreen();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [gamePhase, handleFullscreen]);

  const themeBg =
    colorTheme === 'forest'
      ? 'radial-gradient(ellipse at center, #1a2e1a 0%, #0d140d 70%)'
      : colorTheme === 'dusk'
        ? 'radial-gradient(ellipse at center, #2e1a1a 0%, #140d0d 70%)'
        : 'radial-gradient(ellipse at center, #1a1a2e 0%, #0d0d14 70%)';

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: themeBg }}>
      <div
        ref={containerRef}
        style={{ position: 'relative', width: '800px', height: '600px', boxShadow: 'inset 0 0 80px rgba(0,0,0,0.5), 0 0 40px rgba(0,0,0,0.8)' }}
      >
        <div id="game-container" style={{ imageRendering: 'pixelated' }} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
            zIndex: 50,
          }}
        />
        {gamePhase !== 'menu' && gamePhase !== 'countdown' && <HUD />}
        <MainMenu />
        <CharacterSelect />
        <HowToPlay />
        <Credits />
        <SettingsOverlay />
        <AchievementsOverlay />
        <GameOver />
        <PauseOverlay />
        <CountdownOverlay />
      </div>
    </div>
  );
};

export default App;
