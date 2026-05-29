import React, { useState } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { TERRARIA_UI } from '../styles/terrariaUI';
import { hostCoop, joinCoop, leaveCoop } from '../net/coopController';
import { unlockAudio } from '../utils/sound';

const font = TERRARIA_UI.font;

const label: React.CSSProperties = { fontFamily: font, fontSize: '8px', color: TERRARIA_UI.text.muted, lineHeight: 1.8 };

const MultiplayerOverlay: React.FC = () => {
  const menuStep = useGameStore((s) => s.menuStep);
  const gamePhase = useGameStore((s) => s.gamePhase);
  const setMenuStep = useGameStore((s) => s.setMenuStep);
  const startGame = useGameStore((s) => s.startGame);
  const netRole = useGameStore((s) => s.netRole);
  const mpStatus = useGameStore((s) => s.mpStatus);
  const mpCode = useGameStore((s) => s.mpCode);
  const mpError = useGameStore((s) => s.mpError);
  const partner = useGameStore((s) => s.mpPartnerConnected);

  const [codeInput, setCodeInput] = useState('');
  const [copied, setCopied] = useState(false);

  // Only visible from the menu; once the host starts, the phase change hides it.
  if (menuStep !== 'multiplayer' || gamePhase !== 'menu') return null;

  const busy = mpStatus === 'hosting' || mpStatus === 'connecting';
  const connected = mpStatus === 'connected' && partner;

  const handleHost = () => {
    unlockAudio();
    hostCoop();
  };
  const handleJoin = () => {
    unlockAudio();
    joinCoop(codeInput);
  };
  const handleBack = () => {
    leaveCoop();
    setMenuStep('main');
  };
  const handleStart = () => {
    unlockAudio();
    startGame();
  };
  const copyCode = async () => {
    try {
      await navigator.clipboard?.writeText(mpCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
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
        zIndex: 560,
        animation: 'fadeIn 0.3s ease',
      }}
    >
      <div style={{ ...TERRARIA_UI.panelStyle(), padding: '28px 32px', maxWidth: 520, textAlign: 'center' }}>
        <h2 style={{ fontFamily: font, fontSize: '12px', color: TERRARIA_UI.accent.gold, margin: '0 0 8px 0' }}>
          CO-OP — DEFEND TOGETHER
        </h2>
        <p style={{ ...label, marginBottom: 20 }}>
          SHARE WORDS, SHARE LIVES. ONE HOSTS, ONE JOINS WITH A CODE.
          <br />
          WORKS BETWEEN PC AND MAC IN ANY MODERN BROWSER.
        </p>

        {netRole === 'none' && (
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', textAlign: 'center' }}>
            {/* HOST */}
            <div style={{ ...TERRARIA_UI.panelStyle(), padding: '18px 16px', minWidth: 200 }}>
              <div style={{ fontFamily: font, fontSize: '9px', color: TERRARIA_UI.accent.goldLight, marginBottom: 12 }}>HOST A GAME</div>
              <button className="lotr-btn" style={TERRARIA_UI.buttonStyle(true)} onClick={handleHost}>
                CREATE GAME
              </button>
            </div>
            {/* JOIN */}
            <div style={{ ...TERRARIA_UI.panelStyle(), padding: '18px 16px', minWidth: 200 }}>
              <div style={{ fontFamily: font, fontSize: '9px', color: TERRARIA_UI.accent.goldLight, marginBottom: 12 }}>JOIN A GAME</div>
              <input
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                placeholder="CODE"
                aria-label="Join code"
                maxLength={6}
                style={{
                  fontFamily: font,
                  fontSize: '12px',
                  textAlign: 'center',
                  width: 120,
                  padding: '8px',
                  letterSpacing: 4,
                  background: TERRARIA_UI.panel.innerShadow,
                  color: TERRARIA_UI.text.primary,
                  border: `2px solid ${TERRARIA_UI.panel.borderLight}`,
                  marginBottom: 12,
                }}
              />
              <br />
              <button className="lotr-btn" style={TERRARIA_UI.buttonStyle(false)} onClick={handleJoin} disabled={!codeInput.trim()}>
                JOIN
              </button>
            </div>
          </div>
        )}

        {/* HOST: code + status */}
        {netRole === 'host' && (
          <div style={{ ...TERRARIA_UI.panelStyle(), padding: '20px', marginBottom: 16 }}>
            <div style={label}>YOUR JOIN CODE</div>
            <div
              style={{
                fontFamily: font,
                fontSize: '28px',
                color: TERRARIA_UI.accent.gold,
                letterSpacing: 8,
                margin: '12px 0',
                textShadow: '0 0 12px rgba(201,162,39,0.6)',
              }}
            >
              {mpCode || '· · · · ·'}
            </div>
            <button className="lotr-btn" style={{ ...TERRARIA_UI.buttonStyle(false), fontSize: '8px' }} onClick={copyCode}>
              {copied ? 'COPIED!' : 'COPY CODE'}
            </button>
            <p style={{ ...label, marginTop: 14, color: connected ? TERRARIA_UI.accent.success : TERRARIA_UI.text.muted }}>
              {connected ? 'FRIEND CONNECTED ✓' : 'WAITING FOR FRIEND TO JOIN…'}
            </p>
          </div>
        )}

        {/* GUEST: status */}
        {netRole === 'guest' && (
          <div style={{ ...TERRARIA_UI.panelStyle(), padding: '20px', marginBottom: 16 }}>
            <div style={{ fontFamily: font, fontSize: '14px', color: TERRARIA_UI.accent.gold, letterSpacing: 4, marginBottom: 12 }}>
              {mpCode}
            </div>
            <p style={{ ...label, color: connected ? TERRARIA_UI.accent.success : TERRARIA_UI.text.muted }}>
              {mpStatus === 'connecting' && 'CONNECTING…'}
              {connected && 'CONNECTED — WAITING FOR HOST TO START…'}
              {mpStatus === 'closed' && 'DISCONNECTED'}
            </p>
          </div>
        )}

        {mpError && (
          <p style={{ fontFamily: font, fontSize: '8px', color: TERRARIA_UI.accent.danger, marginBottom: 12 }}>{mpError}</p>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 8 }}>
          {netRole === 'host' && (
            <button
              className="lotr-btn"
              style={{ ...TERRARIA_UI.buttonStyle(connected), opacity: connected ? 1 : 0.5 }}
              onClick={handleStart}
              disabled={!connected}
            >
              START CO-OP
            </button>
          )}
          <button className="lotr-btn" style={TERRARIA_UI.buttonStyle(false)} onClick={handleBack} disabled={busy}>
            {netRole === 'none' ? 'BACK' : 'LEAVE'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerOverlay;
