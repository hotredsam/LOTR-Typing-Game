import React from 'react';
import { useGameStore } from '../stores/useGameStore';
import { TERRARIA_UI } from '../styles/terrariaUI';

const Credits: React.FC = () => {
  const menuStep = useGameStore((state) => state.menuStep);
  const setMenuStep = useGameStore((state) => state.setMenuStep);

  if (menuStep !== 'credits') return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 550,
      }}
    >
      <div style={{ ...TERRARIA_UI.panelStyle(), padding: '32px 40px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: TERRARIA_UI.font, fontSize: '10px', color: TERRARIA_UI.accent.gold, margin: '0 0 20px 0' }}>
          CREDITS
        </h2>
        <p style={{ fontFamily: TERRARIA_UI.font, fontSize: '8px', color: TERRARIA_UI.text.primary, lineHeight: 2, marginBottom: '16px' }}>
          FANTASY TYPING — LOTR STYLE
        </p>
        <p style={{ fontFamily: TERRARIA_UI.font, fontSize: '8px', color: TERRARIA_UI.text.muted, lineHeight: 1.8 }}>
          FONT: PRESS START 2P
          <br />
          TERRARIA / TYPE NIGHT INSPIRED
        </p>
        <button style={{ ...TERRARIA_UI.buttonStyle(true), marginTop: '24px' }} onClick={() => setMenuStep('main')}>
          BACK
        </button>
      </div>
    </div>
  );
};

export default Credits;
