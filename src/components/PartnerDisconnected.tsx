import React from 'react';
import { useGameStore } from '../stores/useGameStore';
import { TERRARIA_UI } from '../styles/terrariaUI';
import { leaveCoop } from '../net/coopController';

/**
 * Shown when a co-op partner drops mid-game so neither player is left stranded.
 * Offers a clean exit back to the menu (which tears down the session).
 */
const PartnerDisconnected: React.FC = () => {
  const netRole = useGameStore((s) => s.netRole);
  const mpStatus = useGameStore((s) => s.mpStatus);
  const gamePhase = useGameStore((s) => s.gamePhase);

  // Only relevant in an active co-op session that has dropped, outside the lobby.
  if (netRole === 'none' || mpStatus !== 'closed' || gamePhase === 'menu') return null;

  const handleReturn = () => {
    leaveCoop();
    useGameStore.setState({ gamePhase: 'menu', menuStep: 'main', isGameOver: false, isPaused: false });
  };

  return (
    <div
      role="alertdialog"
      aria-label="Partner disconnected"
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.88)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1100,
        animation: 'fadeIn 0.3s ease',
      }}
    >
      <div style={{ ...TERRARIA_UI.panelStyle(), padding: '32px 40px', textAlign: 'center', maxWidth: 360 }}>
        <div style={{ fontSize: 30, marginBottom: 12 }}>🔌</div>
        <h2 style={{ fontFamily: TERRARIA_UI.font, fontSize: '11px', color: TERRARIA_UI.accent.danger, margin: '0 0 12px 0' }}>
          PARTNER DISCONNECTED
        </h2>
        <p style={{ fontFamily: TERRARIA_UI.font, fontSize: '8px', color: TERRARIA_UI.text.muted, lineHeight: 1.9, marginBottom: 20 }}>
          THE CO-OP CONNECTION WAS LOST.
        </p>
        <button className="lotr-btn" style={TERRARIA_UI.buttonStyle(true)} onClick={handleReturn}>
          RETURN TO MENU
        </button>
      </div>
    </div>
  );
};

export default PartnerDisconnected;
