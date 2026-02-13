import React from 'react';
import { useGameStore } from '../stores/useGameStore';
import { TERRARIA_UI } from '../styles/terrariaUI';

const SettingsOverlay: React.FC = () => {
  const menuStep = useGameStore((state) => state.menuStep);
  const setMenuStep = useGameStore((state) => state.setMenuStep);
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const toggleSound = useGameStore((state) => state.toggleSound);
  const colorTheme = useGameStore((state) => state.colorTheme);
  const setColorTheme = useGameStore((state) => state.setColorTheme);
  const timedDuration = useGameStore((state) => state.timedDuration);
  const setTimedDuration = useGameStore((state) => state.setTimedDuration);

  if (menuStep !== 'settings') return null;

  const themes: { id: typeof colorTheme; label: string }[] = [
    { id: 'default', label: 'DEFAULT' },
    { id: 'forest', label: 'FOREST' },
    { id: 'dusk', label: 'DUSK' },
  ];

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
      <div style={{ ...TERRARIA_UI.panelStyle(), padding: '32px 40px' }}>
        <h2 style={{ fontFamily: TERRARIA_UI.font, fontSize: '10px', color: TERRARIA_UI.accent.gold, margin: '0 0 20px 0' }}>
          SETTINGS
        </h2>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontFamily: TERRARIA_UI.font, fontSize: '8px', color: TERRARIA_UI.text.primary, marginRight: '8px' }}>
            SOUND
          </label>
          <button style={TERRARIA_UI.buttonStyle(soundEnabled)} onClick={() => toggleSound()}>
            {soundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontFamily: TERRARIA_UI.font, fontSize: '8px', color: TERRARIA_UI.text.primary, marginBottom: '8px' }}>
            THEME
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {themes.map((t) => (
              <button
                key={t.id}
                style={TERRARIA_UI.buttonStyle(colorTheme === t.id)}
                onClick={() => setColorTheme(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: TERRARIA_UI.font, fontSize: '8px', color: TERRARIA_UI.text.primary, marginBottom: '8px' }}>
            TIMED MODE (SEC)
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {[30, 60, 90, 120].map((sec) => (
              <button
                key={sec}
                style={TERRARIA_UI.buttonStyle(timedDuration === sec)}
                onClick={() => setTimedDuration(sec)}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>
        <button style={TERRARIA_UI.buttonStyle(true)} onClick={() => setMenuStep('main')}>
          BACK
        </button>
      </div>
    </div>
  );
};

export default SettingsOverlay;
