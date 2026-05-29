import React from 'react';
import { useGameStore } from '../stores/useGameStore';
import { TERRARIA_UI } from '../styles/terrariaUI';

const CountdownOverlay: React.FC = () => {
  const gamePhase = useGameStore((state) => state.gamePhase);
  const countdownNumber = useGameStore((state) => state.countdownNumber);
  const reducedMotion = useGameStore((state) => state.reducedMotion);

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
        key={countdownNumber}
        style={{
          fontFamily: TERRARIA_UI.font,
          fontSize: '72px',
          color: countdownNumber === 0 ? TERRARIA_UI.accent.success : TERRARIA_UI.accent.gold,
          textShadow: '0 0 20px rgba(0,0,0,0.8)',
          display: 'inline-block',
          animation: reducedMotion ? undefined : 'popScale 0.45s ease',
        }}
      >
        {countdownNumber === 0 ? 'GO!' : countdownNumber}
      </span>
    </div>
  );
};

export default CountdownOverlay;
