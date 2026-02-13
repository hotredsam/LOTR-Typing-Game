import React from 'react';
import { useGameStore } from '../stores/useGameStore';
import { TERRARIA_UI } from '../styles/terrariaUI';

const HowToPlay: React.FC = () => {
  const menuStep = useGameStore((state) => state.menuStep);
  const setMenuStep = useGameStore((state) => state.setMenuStep);

  if (menuStep !== 'howto') return null;

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
      <div style={{ ...TERRARIA_UI.panelStyle(), padding: '32px 40px', maxWidth: '480px' }}>
        <h2 style={{ fontFamily: TERRARIA_UI.font, fontSize: '10px', color: TERRARIA_UI.accent.gold, margin: '0 0 16px 0' }}>
          HOW TO PLAY
        </h2>
        <ul
          style={{
            fontFamily: TERRARIA_UI.font,
            fontSize: '8px',
            color: TERRARIA_UI.text.primary,
            lineHeight: 2,
            margin: '0 0 24px 0',
            paddingLeft: '20px',
          }}
        >
          <li>Type the first letter of a word to lock onto it.</li>
          <li>Finish the word before it reaches the bottom.</li>
          <li>Chain words for combo multipliers (up to 3x).</li>
          <li>Longer words and faster completion give bonus points.</li>
          <li>Press ESC or P to pause during play.</li>
          <li>Wrong key or word reaching bottom breaks combo and loses the game.</li>
        </ul>
        <button style={TERRARIA_UI.buttonStyle(true)} onClick={() => setMenuStep('main')}>
          BACK
        </button>
      </div>
    </div>
  );
};

export default HowToPlay;
