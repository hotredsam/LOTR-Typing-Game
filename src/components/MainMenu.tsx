import React from 'react';
import { useGameStore } from '../stores/useGameStore';
import { TERRARIA_UI } from '../styles/terrariaUI';

const MainMenu: React.FC = () => {
  const gamePhase = useGameStore((state) => state.gamePhase);
  const menuStep = useGameStore((state) => state.menuStep);
  const setMenuStep = useGameStore((state) => state.setMenuStep);
  const highScore = useGameStore((state) => state.highScore);

  if (gamePhase !== 'menu' || menuStep !== 'main') return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 500,
      }}
    >
      <div
        style={{
          ...TERRARIA_UI.panelStyle(),
          padding: '40px 56px',
          textAlign: 'center',
          maxWidth: '420px',
        }}
      >
        <h1
          style={{
            fontFamily: TERRARIA_UI.font,
            fontSize: '14px',
            color: TERRARIA_UI.accent.gold,
            margin: '0 0 16px 0',
            lineHeight: 1.8,
          }}
        >
          FANTASY TYPING
        </h1>
        <p style={{ fontFamily: TERRARIA_UI.font, fontSize: '8px', color: TERRARIA_UI.text.muted, marginBottom: '8px', lineHeight: 1.8 }}>
          TYPE WORDS BEFORE THEY FALL
        </p>
        <p style={{ fontFamily: TERRARIA_UI.font, fontSize: '8px', color: TERRARIA_UI.accent.goldLight, marginBottom: '28px' }}>
          BEST: {highScore}
        </p>
        <button style={TERRARIA_UI.buttonStyle(true)} onClick={() => setMenuStep('character')}>
          BEGIN MISSION
        </button>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
          <button style={TERRARIA_UI.buttonStyle(false)} onClick={() => setMenuStep('howto')}>
            HOW TO PLAY
          </button>
          <button style={TERRARIA_UI.buttonStyle(false)} onClick={() => setMenuStep('credits')}>
            CREDITS
          </button>
          <button style={TERRARIA_UI.buttonStyle(false)} onClick={() => setMenuStep('settings')}>
            SETTINGS
          </button>
          <button style={TERRARIA_UI.buttonStyle(false)} onClick={() => setMenuStep('achievements')}>
            ACHIEVEMENTS
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
