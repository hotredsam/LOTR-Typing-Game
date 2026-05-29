import React, { useState } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { TERRARIA_UI } from '../styles/terrariaUI';
import { resetProgress } from '../utils/persistence';

const labelStyle: React.CSSProperties = {
  fontFamily: TERRARIA_UI.font,
  fontSize: '8px',
  color: TERRARIA_UI.text.primary,
  marginBottom: '8px',
};

const SettingsOverlay: React.FC = () => {
  const menuStep = useGameStore((state) => state.menuStep);
  const setMenuStep = useGameStore((state) => state.setMenuStep);
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const toggleSound = useGameStore((state) => state.toggleSound);
  const colorTheme = useGameStore((state) => state.colorTheme);
  const setColorTheme = useGameStore((state) => state.setColorTheme);
  const timedDuration = useGameStore((state) => state.timedDuration);
  const setTimedDuration = useGameStore((state) => state.setTimedDuration);
  const volume = useGameStore((state) => state.volume);
  const setVolume = useGameStore((state) => state.setVolume);
  const reducedMotion = useGameStore((state) => state.reducedMotion);
  const toggleReducedMotion = useGameStore((state) => state.toggleReducedMotion);
  const maxLives = useGameStore((state) => state.maxLives);
  const setMaxLives = useGameStore((state) => state.setMaxLives);
  const fontScale = useGameStore((state) => state.fontScale);
  const setFontScale = useGameStore((state) => state.setFontScale);

  const [confirmReset, setConfirmReset] = useState(false);

  if (menuStep !== 'settings') return null;

  const themes: { id: typeof colorTheme; label: string }[] = [
    { id: 'default', label: 'DEFAULT' },
    { id: 'forest', label: 'FOREST' },
    { id: 'dusk', label: 'DUSK' },
    { id: 'mithril', label: 'MITHRIL' },
    { id: 'mordor', label: 'MORDOR' },
    { id: 'contrast', label: 'CONTRAST' },
  ];

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetProgress();
    useGameStore.setState({ highScore: 0, leaderboard: [], achievements: [] });
    setConfirmReset(false);
  };

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
      <div
        className="lotr-scroll"
        style={{ ...TERRARIA_UI.panelStyle(), padding: '28px 36px', maxHeight: '88%', overflowY: 'auto', width: 420, boxSizing: 'border-box' }}
      >
        <h2 style={{ fontFamily: TERRARIA_UI.font, fontSize: '10px', color: TERRARIA_UI.accent.gold, margin: '0 0 20px 0' }}>
          SETTINGS
        </h2>

        <div style={{ marginBottom: '18px' }}>
          <label style={{ ...labelStyle, marginRight: '8px' }}>SOUND</label>
          <button className="lotr-btn" style={TERRARIA_UI.buttonStyle(soundEnabled)} onClick={() => toggleSound()}>
            {soundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        <div style={{ marginBottom: '18px' }}>
          <div style={labelStyle}>VOLUME: {volume}%</div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={volume}
            aria-label="Master volume"
            onChange={(e) => setVolume(Number(e.target.value))}
            style={{ width: '100%', accentColor: TERRARIA_UI.accent.gold }}
          />
        </div>

        <div style={{ marginBottom: '18px' }}>
          <div style={labelStyle}>THEME</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {themes.map((t) => (
              <button key={t.id} className="lotr-btn" style={TERRARIA_UI.buttonStyle(colorTheme === t.id)} onClick={() => setColorTheme(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '18px' }}>
          <div style={labelStyle}>LIVES</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 3, 5].map((n) => (
              <button key={n} className="lotr-btn" style={TERRARIA_UI.buttonStyle(maxLives === n)} onClick={() => setMaxLives(n)}>
                {n}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '18px' }}>
          <div style={labelStyle}>WORD SIZE</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {([['S', 0.85], ['M', 1], ['L', 1.25]] as const).map(([lbl, val]) => (
              <button key={lbl} className="lotr-btn" style={TERRARIA_UI.buttonStyle(fontScale === val)} onClick={() => setFontScale(val)}>
                {lbl}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={{ ...labelStyle, marginRight: '8px' }}>REDUCED MOTION</label>
          <button className="lotr-btn" style={TERRARIA_UI.buttonStyle(reducedMotion)} onClick={() => toggleReducedMotion()}>
            {reducedMotion ? 'ON' : 'OFF'}
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={labelStyle}>TIMED MODE (SEC)</div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {[30, 60, 90, 120].map((sec) => (
              <button key={sec} className="lotr-btn" style={TERRARIA_UI.buttonStyle(timedDuration === sec)} onClick={() => setTimedDuration(sec)}>
                {sec}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={labelStyle}>DANGER ZONE</div>
          <button
            className="lotr-btn"
            style={{ ...TERRARIA_UI.buttonStyle(false), color: TERRARIA_UI.accent.danger, borderColor: TERRARIA_UI.accent.danger }}
            onClick={handleReset}
          >
            {confirmReset ? 'TAP AGAIN TO CONFIRM' : 'RESET PROGRESS'}
          </button>
        </div>

        <button className="lotr-btn" style={TERRARIA_UI.buttonStyle(true)} onClick={() => { setConfirmReset(false); setMenuStep('main'); }}>
          BACK
        </button>
      </div>
    </div>
  );
};

export default SettingsOverlay;
