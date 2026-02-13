import type { CSSProperties } from 'react'

/**
 * Terraria / Type Night inspired UI constants.
 * Use with Press Start 2P for pixel-perfect readability.
 */
export const TERRARIA_UI = {
  font: '"Press Start 2P", monospace',
  panel: {
    bg: '#3d2e24',
    border: '#2d1f17',
    borderLight: '#6b5344',
    innerShadow: '#1a120d',
  },
  accent: {
    gold: '#c9a227',
    goldLight: '#e8d5a3',
    danger: '#8b2635',
    success: '#4a7c59',
  },
  text: {
    primary: '#e8d5a3',
    muted: '#9c8b6b',
  },
  /** CSS for a Terraria-style panel (border + fill). */
  panelStyle: (extra?: CSSProperties): CSSProperties => ({
    backgroundColor: TERRARIA_UI.panel.bg,
    borderWidth: 3,
    borderStyle: 'solid',
    borderTopColor: TERRARIA_UI.panel.border,
    borderLeftColor: TERRARIA_UI.panel.border,
    borderRightColor: TERRARIA_UI.panel.borderLight,
    borderBottomColor: TERRARIA_UI.panel.borderLight,
    boxShadow: `inset 2px 2px 0 ${TERRARIA_UI.panel.innerShadow}`,
    fontFamily: TERRARIA_UI.font,
    ...extra,
  }),
  buttonStyle: (primary: boolean): CSSProperties => ({
    ...TERRARIA_UI.panelStyle(),
    color: primary ? '#1a120d' : TERRARIA_UI.text.primary,
    backgroundColor: primary ? TERRARIA_UI.accent.gold : TERRARIA_UI.panel.bg,
    padding: '10px 20px',
    fontSize: '10px',
    cursor: 'pointer',
    imageRendering: 'pixelated',
  }),
} as const
