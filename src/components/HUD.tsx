import React from 'react';
import { useGameStore } from '../stores/useGameStore';
import { TERRARIA_UI } from '../styles/terrariaUI';

const CHARACTER_NAMES: Record<string, string> = { warrior: 'WARRIOR', ranger: 'RANGER', mage: 'MAGE' };

const HUD: React.FC = () => {
  const score = useGameStore((state) => state.score);
  const wpm = useGameStore((state) => state.wpm);
  const accuracy = useGameStore((state) => state.accuracy);
  const level = useGameStore((state) => state.level);
  const combo = useGameStore((state) => state.combo);
  const wordsCompleted = useGameStore((state) => state.wordsCompleted);
  const bestCombo = useGameStore((state) => state.bestCombo);
  const streak = useGameStore((state) => state.streak);
  const difficultyLabel = useGameStore((state) => state.difficultyLabel);
  const selectedCharacterId = useGameStore((state) => state.selectedCharacterId);
  const gameMode = useGameStore((state) => state.gameMode);
  const timeRemaining = useGameStore((state) => state.timeRemaining);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 16px',
        ...TERRARIA_UI.panelStyle({ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }),
        color: TERRARIA_UI.text.primary,
        fontSize: '10px',
        fontFamily: TERRARIA_UI.font,
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      <span>SCORE: {score}</span>
      <span>WPM: {Math.round(wpm)}</span>
      <span>ACC: {Math.round(accuracy)}%</span>
      <span>LV: {level}</span>
      <span>WORDS: {wordsCompleted}</span>
      <span>BEST: {bestCombo}</span>
      {streak > 0 && <span style={{ color: TERRARIA_UI.accent.success }}>STREAK: {streak}</span>}
      <span style={{ color: TERRARIA_UI.text.muted }}>{difficultyLabel}</span>
      {gameMode === 'timed' && (
        <span style={{ color: timeRemaining <= 10 ? TERRARIA_UI.accent.danger : TERRARIA_UI.accent.gold }}>
          TIME: {timeRemaining}
        </span>
      )}
      {selectedCharacterId && (
        <span style={{ color: TERRARIA_UI.text.muted }}>{CHARACTER_NAMES[selectedCharacterId] || selectedCharacterId}</span>
      )}
      {combo > 1 && (
        <span style={{ color: TERRARIA_UI.accent.gold, animation: 'pulse 0.5s ease-in-out' }}>
          x{combo} COMBO!
        </span>
      )}
    </div>
  );
};

export default HUD;
