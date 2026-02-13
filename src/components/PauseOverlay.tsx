import React from 'react';
import { useGameStore } from '../stores/useGameStore';
import { TERRARIA_UI } from '../styles/terrariaUI';

const PauseOverlay: React.FC = () => {
  const gamePhase = useGameStore((state) => state.gamePhase);
  const togglePause = useGameStore((state) => state.togglePause);
  const setGamePhase = useGameStore((state) => state.setGamePhase);
  const setMenuStep = useGameStore((state) => state.setMenuStep);

  if (gamePhase !== 'paused') return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.75)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 800,
      }}
    >
      <div style={{ ...TERRARIA_UI.panelStyle(), padding: '32px 48px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: TERRARIA_UI.font, fontSize: '12px', color: TERRARIA_UI.accent.gold, margin: '0 0 24px 0' }}>
          PAUSED
        </h2>
        <p style={{ fontFamily: TERRARIA_UI.font, fontSize: '8px', color: TERRARIA_UI.text.muted, marginBottom: '20px' }}>
          PRESS ESC OR P TO RESUME
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={TERRARIA_UI.buttonStyle(true)} onClick={() => togglePause()}>
            RESUME
          </button>
          <button
            style={TERRARIA_UI.buttonStyle(false)}
            onClick={() => {
              setGamePhase('menu');
              setMenuStep('main');
              togglePause();
            }}
          >
            QUIT TO MENU
          </button>
        </div>
      </div>
    </div>
  );
};

export default PauseOverlay;
