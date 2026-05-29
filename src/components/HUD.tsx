import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { TERRARIA_UI } from '../styles/terrariaUI';
import { formatNumber, formatClock } from '../utils/format';

const CHARACTER_NAMES: Record<string, string> = { warrior: 'WARRIOR', ranger: 'RANGER', mage: 'MAGE' };

/** Heart pips for the lives system (hidden in zen / hardcore-as-badge). */
const Lives: React.FC<{ lives: number; max: number }> = ({ lives, max }) => {
  if (!Number.isFinite(lives)) return null;
  return (
    <span aria-label={`${lives} lives remaining`} style={{ letterSpacing: 2 }}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} style={{ opacity: i < lives ? 1 : 0.25 }}>
          {i < lives ? '❤️' : '🖤'}
        </span>
      ))}
    </span>
  );
};

const ComboMeter: React.FC<{ combo: number }> = ({ combo }) => {
  // Fill scales toward the 3x multiplier cap (reached at combo 20).
  const pct = Math.min(100, (combo / 20) * 100);
  const hot = combo >= 10;
  return (
    <div
      aria-hidden
      style={{
        width: 90,
        height: 8,
        background: TERRARIA_UI.panel.innerShadow,
        border: `2px solid ${TERRARIA_UI.panel.borderLight}`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: '100%',
          background: hot ? 'linear-gradient(90deg,#ff8c42,#ffd966)' : TERRARIA_UI.accent.gold,
          transition: 'width 0.15s ease',
        }}
      />
    </div>
  );
};

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
  const lives = useGameStore((state) => state.lives);
  const maxLives = useGameStore((state) => state.maxLives);
  const reducedMotion = useGameStore((state) => state.reducedMotion);

  // Score "pop" animation whenever the score increases.
  const [pop, setPop] = useState(false);
  const prevScore = useRef(score);
  useEffect(() => {
    if (score > prevScore.current && !reducedMotion) {
      setPop(true);
      const t = setTimeout(() => setPop(false), 300);
      prevScore.current = score;
      return () => clearTimeout(t);
    }
    prevScore.current = score;
  }, [score, reducedMotion]);

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
      <span
        style={{
          color: TERRARIA_UI.accent.gold,
          display: 'inline-block',
          animation: pop ? 'scorePop 0.3s ease' : undefined,
        }}
      >
        SCORE: {formatNumber(score)}
      </span>
      <span>WPM: {Math.round(wpm)}</span>
      <span>ACC: {Math.round(accuracy)}%</span>
      <span>LV: {level}</span>
      <span>WORDS: {wordsCompleted}</span>
      <span>BEST: {bestCombo}</span>
      {streak > 0 && <span style={{ color: TERRARIA_UI.accent.success }}>STREAK: {streak}</span>}
      {gameMode !== 'zen' && <span style={{ color: TERRARIA_UI.text.muted }}>{difficultyLabel}</span>}
      {gameMode === 'hardcore' && (
        <span style={{ color: TERRARIA_UI.accent.danger }}>☠ HARDCORE</span>
      )}
      {gameMode === 'zen' && <span style={{ color: TERRARIA_UI.accent.success }}>☮ ZEN</span>}
      {gameMode === 'timed' && (
        <span style={{ color: timeRemaining <= 10 ? TERRARIA_UI.accent.danger : TERRARIA_UI.accent.gold }}>
          TIME: {formatClock(timeRemaining)}
        </span>
      )}
      {gameMode !== 'zen' && gameMode !== 'hardcore' && <Lives lives={lives} max={maxLives} />}
      <ComboMeter combo={combo} />
      {selectedCharacterId && (
        <span style={{ color: TERRARIA_UI.text.muted }}>{CHARACTER_NAMES[selectedCharacterId] || selectedCharacterId}</span>
      )}
      {combo > 1 && (
        <span style={{ color: TERRARIA_UI.accent.gold, animation: reducedMotion ? undefined : 'pulse 0.5s ease-in-out' }}>
          x{combo} COMBO!
        </span>
      )}
    </div>
  );
};

export default HUD;
