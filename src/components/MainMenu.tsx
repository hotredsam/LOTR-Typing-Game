import React from 'react';
import { useGameStore } from '../stores/useGameStore';
import { TERRARIA_UI } from '../styles/terrariaUI';

const AMBIENT_EMBERS = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 41) % 100,
  dur: 3 + (i % 5),
  delay: (i % 8) * 0.6,
}));

const MainMenu: React.FC = () => {
  const gamePhase = useGameStore((state) => state.gamePhase);
  const menuStep = useGameStore((state) => state.menuStep);
  const setMenuStep = useGameStore((state) => state.setMenuStep);
  const highScore = useGameStore((state) => state.highScore);
  const reducedMotion = useGameStore((state) => state.reducedMotion);

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
        overflow: 'hidden',
        animation: reducedMotion ? undefined : 'fadeIn 0.4s ease',
      }}
    >
      {!reducedMotion && (
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {AMBIENT_EMBERS.map((e, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${e.left}%`,
                bottom: -10,
                width: 3,
                height: 3,
                borderRadius: '50%',
                background: i % 3 === 0 ? '#ff8c42' : '#ffd966',
                boxShadow: '0 0 6px #ff8c42',
                animation: `emberRise ${e.dur}s ease-in ${e.delay}s infinite`,
              }}
            />
          ))}
        </div>
      )}
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
        <button
          className="lotr-btn"
          style={TERRARIA_UI.buttonStyle(true)}
          onClick={() => setMenuStep('character')}
        >
          BEGIN MISSION
        </button>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
          <button className="lotr-btn" style={TERRARIA_UI.buttonStyle(false)} onClick={() => setMenuStep('howto')}>
            HOW TO PLAY
          </button>
          <button className="lotr-btn" style={TERRARIA_UI.buttonStyle(false)} onClick={() => setMenuStep('about')}>
            ABOUT
          </button>
          <button className="lotr-btn" style={TERRARIA_UI.buttonStyle(false)} onClick={() => setMenuStep('credits')}>
            CREDITS
          </button>
          <button className="lotr-btn" style={TERRARIA_UI.buttonStyle(false)} onClick={() => setMenuStep('settings')}>
            SETTINGS
          </button>
          <button className="lotr-btn" style={TERRARIA_UI.buttonStyle(false)} onClick={() => setMenuStep('achievements')}>
            ACHIEVEMENTS
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
