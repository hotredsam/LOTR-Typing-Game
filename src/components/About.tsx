import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { TERRARIA_UI } from '../styles/terrariaUI';
import { FELLOWSHIP, REALMS, RING_INSCRIPTION, TECH_BADGES } from '../utils/lore';
import { ACHIEVEMENTS } from '../utils/achievements';
import { getWordList } from '../utils/wordGenerator';
import { loadStats } from '../utils/statistics';
import { formatNumber, formatDuration } from '../utils/format';

const font = TERRARIA_UI.font;

/** Toggles `is-visible` on `.reveal-on-scroll` children as they scroll in. */
function useScrollReveal(root: React.RefObject<HTMLElement>, dep: unknown) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll('.reveal-on-scroll'));
    if (!('IntersectionObserver' in window)) {
      items.forEach((i) => i.classList.add('is-visible'));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-visible')),
      { root: el, threshold: 0.15 }
    );
    items.forEach((i) => obs.observe(i));
    return () => obs.disconnect();
  }, [root, dep]);
}

const Starfield: React.FC<{ offset: number; reduced: boolean }> = ({ offset, reduced }) => {
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        left: (i * 53) % 100,
        top: (i * 37) % 100,
        size: (i % 3) + 1,
        delay: (i % 10) * 0.4,
      })),
    []
  );
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            background: '#fff',
            borderRadius: '50%',
            transform: `translateY(${reduced ? 0 : offset * (s.size * 4)}px)`,
            animation: reduced ? undefined : `twinkle ${2 + s.delay}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

const FallingWords: React.FC<{ reduced: boolean }> = ({ reduced }) => {
  const words = useMemo(() => {
    const list = getWordList();
    return Array.from({ length: 14 }, (_, i) => ({
      text: list[(i * 7) % list.length],
      left: (i * 73) % 100,
      dur: 9 + (i % 6) * 2,
      delay: (i % 7) * 1.3,
      drift: `${((i % 5) - 2) * 30}px`,
    }));
  }, []);
  if (reduced) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', opacity: 0.18 }}>
      {words.map((w, i) => (
        <span
          key={i}
          style={
            {
              position: 'absolute',
              left: `${w.left}%`,
              top: 0,
              fontFamily: font,
              fontSize: 10,
              color: TERRARIA_UI.accent.goldLight,
              ['--drift' as string]: w.drift,
              animation: `floatUp ${w.dur}s linear ${w.delay}s infinite`,
            } as React.CSSProperties
          }
        >
          {w.text}
        </span>
      ))}
    </div>
  );
};

const Embers: React.FC<{ reduced: boolean }> = ({ reduced }) => {
  const embers = useMemo(
    () => Array.from({ length: 22 }, (_, i) => ({ left: (i * 41) % 100, dur: 3 + (i % 5), delay: (i % 8) * 0.5 })),
    []
  );
  if (reduced) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {embers.map((e, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${e.left}%`,
            bottom: -10,
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: i % 3 === 0 ? '#ff8c42' : '#ffd966',
            boxShadow: '0 0 6px #ff8c42',
            animation: `emberRise ${e.dur}s ease-in ${e.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="reveal-on-scroll" style={{ marginBottom: 40 }}>
    <h3 style={{ fontFamily: font, fontSize: 12, color: TERRARIA_UI.accent.gold, marginBottom: 16, letterSpacing: 1 }}>
      {title}
    </h3>
    {children}
  </div>
);

const About: React.FC = () => {
  const menuStep = useGameStore((s) => s.menuStep);
  const setMenuStep = useGameStore((s) => s.setMenuStep);
  const highScore = useGameStore((s) => s.highScore);
  const achievements = useGameStore((s) => s.achievements);
  const reducedMotion = useGameStore((s) => s.reducedMotion);
  const unlock = useGameStore((s) => s.unlockAchievement);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [revealedLines, setRevealedLines] = useState(0);
  const [secret, setSecret] = useState(false);
  const [balrog, setBalrog] = useState(false);
  const [closing, setClosing] = useState(false);
  const typedRef = useRef('');
  const konamiRef = useRef<number[]>([]);
  const stats = useMemo(() => (menuStep === 'about' ? loadStats() : null), [menuStep]);

  useScrollReveal(scrollRef, menuStep);

  // Reveal the Ring inscription one line at a time.
  useEffect(() => {
    if (menuStep !== 'about') {
      setRevealedLines(0);
      return;
    }
    setRevealedLines(0);
    const timers = RING_INSCRIPTION.map((_, i) =>
      window.setTimeout(() => setRevealedLines((n) => Math.max(n, i + 1)), 500 + i * 700)
    );
    return () => timers.forEach(clearTimeout);
  }, [menuStep]);

  // Easter eggs: type "mellon", and the Konami code.
  useEffect(() => {
    if (menuStep !== 'about') return;
    const KONAMI = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
        return;
      }
      if (/^[a-zA-Z]$/.test(e.key)) {
        typedRef.current = (typedRef.current + e.key.toLowerCase()).slice(-6);
        if (typedRef.current.endsWith('mellon')) {
          setSecret(true);
          unlock('speak_friend');
        }
      }
      konamiRef.current = [...konamiRef.current, e.keyCode].slice(-KONAMI.length);
      if (KONAMI.every((k, i) => konamiRef.current[i] === k)) setBalrog(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuStep]);

  if (menuStep !== 'about') return null;

  const handleClose = () => {
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      setMenuStep('main');
    }, 300);
  };

  const unlockedCount = achievements.length;
  const totalAch = ACHIEVEMENTS.length;

  return (
    <div
      role="dialog"
      aria-label="About Middle-earth"
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 0%, #241a0f 0%, #0a0805 70%)',
        zIndex: 600,
        overflow: 'hidden',
        animation: closing ? 'fadeIn 0.3s reverse' : 'fadeIn 0.4s ease',
      }}
    >
      <Starfield offset={scrollOffset} reduced={reducedMotion} />
      <Embers reduced={reducedMotion} />
      <FallingWords reduced={reducedMotion} />

      {balrog && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 180,
            zIndex: 1,
            pointerEvents: 'none',
            animation: 'popScale 0.6s ease',
            filter: 'drop-shadow(0 0 40px #ff4500)',
          }}
        >
          🔥👹🔥
        </div>
      )}

      <div
        ref={scrollRef}
        className="lotr-scroll"
        onScroll={(e) => setScrollOffset((e.target as HTMLDivElement).scrollTop * 0.05)}
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          overflowY: 'auto',
          padding: '32px 36px 48px',
          boxSizing: 'border-box',
        }}
      >
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1
            style={{
              fontFamily: font,
              fontSize: 22,
              margin: 0,
              background: 'linear-gradient(90deg, #8a6a12, #ffd966, #fff3b0, #ffd966, #8a6a12)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              animation: reducedMotion ? undefined : 'goldShimmer 4s linear infinite',
            }}
          >
            MIDDLE-EARTH
          </h1>
          <p style={{ fontFamily: font, fontSize: 9, color: TERRARIA_UI.text.muted, marginTop: 12, lineHeight: 1.8 }}>
            A TYPING JOURNEY THROUGH THE LANDS OF TOLKIEN
          </p>
        </div>

        {/* The One Ring inscription */}
        <div
          className="reveal-on-scroll"
          style={{
            ...TERRARIA_UI.panelStyle(),
            padding: '24px 28px',
            textAlign: 'center',
            marginBottom: 40,
            background: 'rgba(20,14,8,0.85)',
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 8, animation: reducedMotion ? undefined : 'ringGlow 3s ease-in-out infinite' }}>
            💍
          </div>
          {RING_INSCRIPTION.map((line, i) => (
            <p
              key={i}
              style={{
                fontFamily: font,
                fontSize: 9,
                color: i < revealedLines ? TERRARIA_UI.accent.goldLight : 'transparent',
                lineHeight: 2,
                margin: 0,
                transition: 'color 0.8s ease',
                textShadow: i < revealedLines ? '0 0 8px rgba(201,162,39,0.7)' : 'none',
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* Fellowship */}
        <Section title="THE FELLOWSHIP">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {FELLOWSHIP.map((m, i) => (
              <div
                key={m.name}
                className="lotr-btn"
                style={{
                  ...TERRARIA_UI.panelStyle(),
                  padding: '12px 10px',
                  textAlign: 'center',
                  animation: reducedMotion ? undefined : `revealUp 0.5s ease ${i * 0.06}s both`,
                }}
              >
                <div style={{ fontSize: 26 }}>{m.emoji}</div>
                <div style={{ fontFamily: font, fontSize: 9, color: TERRARIA_UI.accent.gold, margin: '8px 0 4px' }}>
                  {m.name.toUpperCase()}
                </div>
                <div style={{ fontFamily: font, fontSize: 6, color: TERRARIA_UI.text.muted, marginBottom: 6 }}>
                  {m.race.toUpperCase()}
                </div>
                <div style={{ fontFamily: font, fontSize: 6, color: TERRARIA_UI.text.primary, lineHeight: 1.7 }}>
                  {m.blurb}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Realms */}
        <Section title="REALMS OF MIDDLE-EARTH">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {REALMS.map((r) => (
              <div key={r.name} style={{ ...TERRARIA_UI.panelStyle(), padding: '10px 14px' }}>
                <span style={{ fontFamily: font, fontSize: 9, color: TERRARIA_UI.accent.goldLight }}>{r.name}</span>
                <span style={{ fontFamily: font, fontSize: 7, color: TERRARIA_UI.text.muted, marginLeft: 8, lineHeight: 1.8 }}>
                  — {r.blurb}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* Personal stats */}
        <Section title="YOUR LEGEND">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            <Stat label="HIGH SCORE" value={formatNumber(highScore)} />
            <Stat label="WORDS TYPED" value={formatNumber(stats?.totalWords ?? 0)} />
            <Stat label="GAMES" value={formatNumber(stats?.gamesPlayed ?? 0)} />
            <Stat label="MEDALS" value={`${unlockedCount}/${totalAch}`} />
            <Stat label="BEST WPM" value={formatNumber(stats?.bestWpm ?? 0)} />
            <Stat label="BEST COMBO" value={formatNumber(stats?.bestCombo ?? 0)} />
            <Stat label="TIME PLAYED" value={formatDuration(stats?.totalTimeMs ?? 0)} />
            <Stat label="TOTAL SCORE" value={formatNumber(stats?.totalScore ?? 0)} />
          </div>
        </Section>

        {/* Secret (mellon) */}
        {secret && (
          <div
            className="reveal-on-scroll is-visible"
            style={{
              ...TERRARIA_UI.panelStyle(),
              padding: '18px 22px',
              textAlign: 'center',
              marginBottom: 40,
              borderColor: TERRARIA_UI.accent.gold,
              background: 'rgba(40,30,10,0.9)',
            }}
          >
            <div style={{ fontSize: 28 }}>🚪✨</div>
            <p style={{ fontFamily: font, fontSize: 8, color: TERRARIA_UI.accent.goldLight, lineHeight: 1.9, marginTop: 10 }}>
              THE DOORS OF DURIN OPEN. SPEAK, FRIEND, AND ENTER.
              <br />
              ACHIEVEMENT UNLOCKED: SPEAK FRIEND
            </p>
          </div>
        )}

        {/* How it's built */}
        <Section title="FORGED WITH">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {TECH_BADGES.map((b) => (
              <span
                key={b.name}
                style={{
                  ...TERRARIA_UI.panelStyle(),
                  padding: '6px 10px',
                  fontFamily: font,
                  fontSize: 7,
                  color: TERRARIA_UI.text.primary,
                }}
              >
                {b.name} <span style={{ color: TERRARIA_UI.accent.gold }}>{b.version}</span>
              </span>
            ))}
          </div>
          <p style={{ fontFamily: font, fontSize: 7, color: TERRARIA_UI.text.muted, lineHeight: 2 }}>
            A PHASER 3 GAME CANVAS RENDERS THE FALLING WORDS WHILE REACT DRAWS THE UI OVERLAYS ON TOP.
            A SINGLE ZUSTAND STORE IS THE SHARED SOURCE OF TRUTH BETWEEN THEM.
          </p>
        </Section>

        <div className="reveal-on-scroll" style={{ textAlign: 'center', marginTop: 8 }}>
          <p style={{ fontFamily: font, fontSize: 6, color: TERRARIA_UI.text.muted, marginBottom: 16, lineHeight: 1.8 }}>
            PSST — TRY TYPING <span style={{ color: TERRARIA_UI.accent.gold }}>MELLON</span> ON THIS PAGE…
          </p>
          <button className="lotr-btn" aria-label="Back to main menu" style={TERRARIA_UI.buttonStyle(true)} onClick={handleClose}>
            BACK TO MENU
          </button>
        </div>
      </div>
    </div>
  );
};

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ ...TERRARIA_UI.panelStyle(), padding: '12px 8px', textAlign: 'center' }}>
    <div style={{ fontFamily: font, fontSize: 12, color: TERRARIA_UI.accent.gold }}>{value}</div>
    <div style={{ fontFamily: font, fontSize: 6, color: TERRARIA_UI.text.muted, marginTop: 6 }}>{label}</div>
  </div>
);

export default About;
