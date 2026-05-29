import React from 'react';
import { useGameStore } from '../stores/useGameStore';
import { TERRARIA_UI } from '../styles/terrariaUI';
import { ACHIEVEMENTS } from '../utils/achievements';

const AchievementsOverlay: React.FC = () => {
  const menuStep = useGameStore((state) => state.menuStep);
  const setMenuStep = useGameStore((state) => state.setMenuStep);
  const achievements = useGameStore((state) => state.achievements);

  if (menuStep !== 'achievements') return null;

  const unlockedCount = achievements.length;
  const pct = Math.round((unlockedCount / ACHIEVEMENTS.length) * 100);

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
      <div className="lotr-scroll" style={{ ...TERRARIA_UI.panelStyle(), padding: '24px 32px', maxWidth: '480px', maxHeight: '80%', overflow: 'auto' }}>
        <h2 style={{ fontFamily: TERRARIA_UI.font, fontSize: '10px', color: TERRARIA_UI.accent.gold, margin: '0 0 12px 0' }}>
          ACHIEVEMENTS ({unlockedCount}/{ACHIEVEMENTS.length})
        </h2>
        <div style={{ width: '100%', height: 8, background: TERRARIA_UI.panel.innerShadow, border: `2px solid ${TERRARIA_UI.panel.borderLight}`, marginBottom: 16 }}>
          <div style={{ width: `${pct}%`, height: '100%', background: TERRARIA_UI.accent.gold, transition: 'width 0.3s ease' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {ACHIEVEMENTS.map((a) => {
            const unlocked = achievements.includes(a.id);
            return (
              <div
                key={a.id}
                style={{
                  ...TERRARIA_UI.panelStyle(),
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  opacity: unlocked ? 1 : 0.55,
                  borderColor: unlocked ? TERRARIA_UI.accent.gold : undefined,
                }}
              >
                <span style={{ fontSize: 18, filter: unlocked ? 'none' : 'grayscale(1)' }}>{unlocked ? a.icon : '🔒'}</span>
                <span>
                  <div style={{ fontFamily: TERRARIA_UI.font, fontSize: '8px', color: TERRARIA_UI.accent.gold }}>{a.name}</div>
                  <div style={{ fontFamily: TERRARIA_UI.font, fontSize: '6px', color: TERRARIA_UI.text.muted, lineHeight: 1.6 }}>{a.description}</div>
                </span>
              </div>
            );
          })}
        </div>
        <button className="lotr-btn" style={{ ...TERRARIA_UI.buttonStyle(true), marginTop: '16px' }} onClick={() => setMenuStep('main')}>
          BACK
        </button>
      </div>
    </div>
  );
};

export default AchievementsOverlay;
