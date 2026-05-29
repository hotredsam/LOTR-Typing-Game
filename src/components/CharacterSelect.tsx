import React, { useState } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { TERRARIA_UI } from '../styles/terrariaUI';

const CHARACTERS = [
  { id: 'warrior', name: 'WARRIOR', desc: 'STEADY & STRONG' },
  { id: 'ranger', name: 'RANGER', desc: 'SWIFT & PRECISE' },
  { id: 'mage', name: 'MAGE', desc: 'QUICK & CLEVER' },
];

const MODES = [
  { id: 'endless', label: 'ENDLESS', desc: 'SURVIVE AS LONG AS YOU CAN' },
  { id: 'timed', label: 'TIMED', desc: 'RACE THE CLOCK FOR A HIGH SCORE' },
  { id: 'zen', label: 'ZEN', desc: 'NO GAME OVER — JUST TYPE & RELAX' },
  { id: 'hardcore', label: 'HARDCORE', desc: 'ONE MISTAKE ENDS THE RUN' },
] as const;

const CharacterSelect: React.FC = () => {
  const gamePhase = useGameStore((state) => state.gamePhase);
  const menuStep = useGameStore((state) => state.menuStep);
  const startGame = useGameStore((state) => state.startGame);
  const setMenuStep = useGameStore((state) => state.setMenuStep);
  const setSelectedCharacterId = useGameStore((state) => state.setSelectedCharacterId);
  const selectedCharacterId = useGameStore((state) => state.selectedCharacterId);
  const gameMode = useGameStore((state) => state.gameMode);
  const setGameMode = useGameStore((state) => state.setGameMode);
  const [selectedId, setSelectedId] = useState<string | null>(selectedCharacterId);

  if (gamePhase !== 'menu' || menuStep !== 'character') return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.88)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 600,
      }}
    >
      <button
        type="button"
        style={{ ...TERRARIA_UI.buttonStyle(false), position: 'absolute', top: '16px', left: '16px', fontSize: '8px' }}
        onClick={() => setMenuStep('main')}
      >
        BACK
      </button>
      <div style={{ ...TERRARIA_UI.panelStyle(), padding: '32px 48px', marginBottom: '24px' }}>
        <h2 style={{ fontFamily: TERRARIA_UI.font, fontSize: '10px', color: TERRARIA_UI.accent.gold, margin: '0 0 20px 0' }}>
          CHOOSE YOUR HERO
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
          {CHARACTERS.map((c) => (
            <div
              key={c.id}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && (setSelectedId(c.id), setSelectedCharacterId(c.id))}
              aria-pressed={selectedId === c.id}
              onClick={() => { setSelectedId(c.id); setSelectedCharacterId(c.id); }}
              style={{
                ...TERRARIA_UI.panelStyle(),
                padding: '16px 24px',
                cursor: 'pointer',
                minWidth: '140px',
                textAlign: 'center',
                borderTopColor: selectedId === c.id ? TERRARIA_UI.accent.gold : TERRARIA_UI.panel.border,
                borderLeftColor: selectedId === c.id ? TERRARIA_UI.accent.gold : TERRARIA_UI.panel.border,
                borderRightColor: selectedId === c.id ? TERRARIA_UI.accent.gold : TERRARIA_UI.panel.borderLight,
                borderBottomColor: selectedId === c.id ? TERRARIA_UI.accent.gold : TERRARIA_UI.panel.borderLight,
              }}
            >
              <div style={{ fontFamily: TERRARIA_UI.font, fontSize: '10px', color: TERRARIA_UI.text.primary, marginBottom: '6px' }}>
                {c.name}
              </div>
              <div style={{ fontFamily: TERRARIA_UI.font, fontSize: '8px', color: TERRARIA_UI.text.muted }}>{c.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '16px', marginBottom: '12px' }}>
          <div style={{ fontFamily: TERRARIA_UI.font, fontSize: '8px', color: TERRARIA_UI.text.muted, marginBottom: '8px' }}>MODE:</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {MODES.map((m) => (
              <button
                key={m.id}
                className="lotr-btn"
                style={{ ...TERRARIA_UI.buttonStyle(gameMode === m.id), fontSize: '8px' }}
                onClick={() => setGameMode(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div style={{ fontFamily: TERRARIA_UI.font, fontSize: '7px', color: TERRARIA_UI.text.muted, marginTop: '8px', lineHeight: 1.7 }}>
            {MODES.find((m) => m.id === gameMode)?.desc ?? ''}
          </div>
        </div>
        <button
          style={{ ...TERRARIA_UI.buttonStyle(!!selectedId), marginTop: '12px', fontSize: '10px' }}
          onClick={() => selectedId && (setSelectedCharacterId(selectedId), startGame())}
          disabled={!selectedId}
        >
          START MISSION
        </button>
      </div>
    </div>
  );
};

export default CharacterSelect;
