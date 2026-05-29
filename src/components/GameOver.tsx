import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { TERRARIA_UI } from '../styles/terrariaUI';
import { playGameOver } from '../utils/sound';
import { checkAchievements } from '../utils/achievements';
import { recordGame } from '../utils/statistics';
import { formatNumber } from '../utils/format';
import { netSession } from '../net/session';

const CHARACTER_NAMES: Record<string, string> = { warrior: 'WARRIOR', ranger: 'RANGER', mage: 'MAGE' };

/** Animates a number from 0 up to `target` once `active` becomes true. */
function useCountUp(target: number, active: boolean, durationMs = 900, reduced = false): number {
  const [value, setValue] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    // Skip the animation when motion is reduced, or under test where rAF
    // callbacks aren't flushed (so the real value is asserted immediately).
    const isTest = import.meta.env?.MODE === 'test';
    if (reduced || isTest || typeof requestAnimationFrame !== 'function') {
      setValue(target);
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, active, durationMs, reduced]);
  return value;
}

const GameOver: React.FC = () => {
  const isGameOver = useGameStore((state) => state.isGameOver);
  const score = useGameStore((state) => state.score);
  const wordsCompleted = useGameStore((state) => state.wordsCompleted);
  const bestCombo = useGameStore((state) => state.bestCombo);
  const wpm = useGameStore((state) => state.wpm);
  const accuracy = useGameStore((state) => state.accuracy);
  const highScore = useGameStore((state) => state.highScore);
  const leaderboard = useGameStore((state) => state.leaderboard);
  const wordHistory = useGameStore((state) => state.wordHistory);
  const selectedCharacterId = useGameStore((state) => state.selectedCharacterId);
  const reducedMotion = useGameStore((state) => state.reducedMotion);
  const netRole = useGameStore((state) => state.netRole);
  const startGame = useGameStore((state) => state.startGame);
  const resetGame = useGameStore((state) => state.resetGame);
  const pushToLeaderboard = useGameStore((state) => state.pushToLeaderboard);
  const unlockAchievement = useGameStore((state) => state.unlockAchievement);

  const animatedScore = useCountUp(score, isGameOver, 900, reducedMotion);

  useEffect(() => {
    if (isGameOver) playGameOver();
  }, [isGameOver]);

  // Guard so the leaderboard push + stats recording happen exactly once per
  // game-over, even if the effect re-runs (dependency change or StrictMode
  // double-invoke in dev). Resets when a new round begins.
  const recordedRef = useRef(false);
  useEffect(() => {
    if (!isGameOver) {
      recordedRef.current = false;
      return;
    }
    if (recordedRef.current) return;
    recordedRef.current = true;
    const prevHigh = highScore === score ? score - 1 : highScore;
    pushToLeaderboard(score);
    const state = useGameStore.getState();
    checkAchievements(
      {
        wordsCompleted: state.wordsCompleted,
        score: state.score,
        bestCombo: state.bestCombo,
        streak: state.streak,
        highScore: state.highScore,
        gameMode: state.gameMode,
        timeRemaining: state.timeRemaining,
        level: state.level,
        accuracy: state.accuracy,
      },
      prevHigh,
      (id) => unlockAchievement(id)
    );
    recordGame({
      words: state.wordsCompleted,
      score: state.score,
      // Wall-clock play time for every mode (not just timed).
      timeMs: state.playStartedAt ? Date.now() - state.playStartedAt : 0,
      wpm: Math.round(state.wpm),
      combo: state.bestCombo,
    });
  }, [isGameOver, score, pushToLeaderboard, unlockAchievement, highScore]);

  const handleRestart = useCallback(() => {
    // In co-op, only the host restarts (with a countdown so the guest re-syncs);
    // the guest just waits for the host's snapshots.
    if (netRole === 'guest') return;
    if (netRole === 'host') {
      netSession.sendRestart();
      startGame();
      return;
    }
    resetGame();
  }, [netRole, resetGame, startGame]);

  useEffect(() => {
    if (!isGameOver) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'r' || e.key === 'R') handleRestart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isGameOver, handleRestart]);

  if (!isGameOver) return null;

  const isNewRecord = score >= highScore && score > 0;
  const topScores = leaderboard.slice(0, 5);

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
        zIndex: 1000,
      }}
    >
      <div style={{ ...TERRARIA_UI.panelStyle(), padding: '32px 48px', textAlign: 'center', maxWidth: '420px' }}>
        <h1
          style={{
            fontFamily: TERRARIA_UI.font,
            fontSize: '14px',
            color: TERRARIA_UI.accent.danger,
            margin: '0 0 8px 0',
          }}
        >
          GAME OVER
        </h1>
        {selectedCharacterId && (
          <p style={{ fontFamily: TERRARIA_UI.font, fontSize: '8px', color: TERRARIA_UI.text.muted, marginBottom: '12px' }}>
            {CHARACTER_NAMES[selectedCharacterId] || selectedCharacterId}
          </p>
        )}
        <p style={{ fontFamily: TERRARIA_UI.font, fontSize: '12px', color: TERRARIA_UI.accent.gold, marginBottom: '4px' }}>
          FINAL SCORE: {formatNumber(animatedScore)}
        </p>
        {isNewRecord && (
          <p style={{ fontFamily: TERRARIA_UI.font, fontSize: '8px', color: TERRARIA_UI.accent.success, marginBottom: '16px' }}>
            NEW RECORD!
          </p>
        )}
        <div style={{ fontFamily: TERRARIA_UI.font, fontSize: '8px', color: TERRARIA_UI.text.primary, lineHeight: 2, marginBottom: '16px' }}>
          WORDS: {wordsCompleted} &nbsp; BEST COMBO: {bestCombo} &nbsp; WPM: {Math.round(wpm)} &nbsp; ACC: {Math.round(accuracy)}%
        </div>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontFamily: TERRARIA_UI.font, fontSize: '8px', color: TERRARIA_UI.text.muted, marginBottom: '4px' }}>LAST WORDS</div>
          <div style={{ fontFamily: TERRARIA_UI.font, fontSize: '8px', color: TERRARIA_UI.text.primary }}>
            {wordHistory.length ? wordHistory.slice(0, 5).join(' · ') : '—'}
          </div>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontFamily: TERRARIA_UI.font, fontSize: '8px', color: TERRARIA_UI.text.muted, marginBottom: '4px' }}>TOP SCORES</div>
          <div style={{ fontFamily: TERRARIA_UI.font, fontSize: '8px', color: TERRARIA_UI.text.primary }}>
            {topScores.length ? topScores.map((s, i) => <div key={i}>#{i + 1} {s}</div>) : '—'}
          </div>
        </div>
        {netRole === 'guest' ? (
          <p style={{ fontFamily: TERRARIA_UI.font, fontSize: '8px', color: TERRARIA_UI.text.muted, lineHeight: 1.8 }}>
            WAITING FOR HOST TO PLAY AGAIN…
          </p>
        ) : (
          <button className="lotr-btn" style={TERRARIA_UI.buttonStyle(true)} onClick={handleRestart}>
            {netRole === 'host' ? 'PLAY AGAIN (R)' : 'RESTART (R)'}
          </button>
        )}
      </div>
    </div>
  );
};

export default GameOver;
