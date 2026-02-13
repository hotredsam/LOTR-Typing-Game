import React from 'react';
import { useGameStore } from '../stores/useGameStore';
import { TERRARIA_UI } from '../styles/terrariaUI';

const CountdownOverlay: React.FC = () => {
  const gamePhase = useGameStore((state) => state.gamePhase);
  const countdownNumber = useGameStore((state) => state.countdownNumber);

  if (gamePhase !== 'countdown') return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 700,
        pointerEvents: 'none',
      }}
    >
      <span
        style={{
          fontFamily: TERRARIA_UI.font,
          fontSize: '72px',
          color: countdownNumber === 0 ? TERRARIA_UI.accent.success : TERRARIA_UI.accent.gold,
          textShadow: '0 0 20px rgba(0,0,0,0.8)',
          animation: 'pulse 0.5s ease-in-out',
        }}
      >
        {countdownNumber === 0 ? 'GO!' : countdownNumber}
      </span>
    </div>
  );
};

export default CountdownOverlay;
