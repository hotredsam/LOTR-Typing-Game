import React, { useEffect, useState } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { TERRARIA_UI } from '../styles/terrariaUI';
import { ACHIEVEMENTS } from '../utils/achievements';

/** Slide-in toast shown whenever a new achievement is unlocked. */
const AchievementToast: React.FC = () => {
  const lastUnlocked = useGameStore((s) => s.lastUnlocked);
  const clearLastUnlocked = useGameStore((s) => s.clearLastUnlocked);
  const reducedMotion = useGameStore((s) => s.reducedMotion);
  const [visible, setVisible] = useState(false);

  const achievement = ACHIEVEMENTS.find((a) => a.id === lastUnlocked);

  useEffect(() => {
    if (!lastUnlocked) return;
    setVisible(true);
    const hide = window.setTimeout(() => setVisible(false), 3200);
    const clear = window.setTimeout(() => clearLastUnlocked(), 3600);
    return () => {
      clearTimeout(hide);
      clearTimeout(clear);
    };
  }, [lastUnlocked, clearLastUnlocked]);

  if (!achievement || !visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 900,
        ...TERRARIA_UI.panelStyle(),
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        maxWidth: 280,
        borderColor: TERRARIA_UI.accent.gold,
        boxShadow: '0 0 16px rgba(201,162,39,0.5)',
        animation: reducedMotion ? 'fadeIn 0.2s ease' : 'slideInRight 0.4s ease',
      }}
    >
      <div style={{ fontSize: 26 }}>{achievement.icon}</div>
      <div>
        <div style={{ fontFamily: TERRARIA_UI.font, fontSize: 7, color: TERRARIA_UI.text.muted }}>
          ACHIEVEMENT UNLOCKED
        </div>
        <div style={{ fontFamily: TERRARIA_UI.font, fontSize: 9, color: TERRARIA_UI.accent.goldLight, marginTop: 6 }}>
          {achievement.name}
        </div>
      </div>
    </div>
  );
};

export default AchievementToast;
