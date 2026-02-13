import React, { useEffect, useCallback } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { TERRARIA_UI } from '../styles/terrariaUI';
import { playGameOver } from '../utils/sound';
import { checkAchievements } from '../utils/achievements';

const CHARACTER_NAMES: Record<string, string> = { warrior: 'WARRIOR', ranger: 'RANGER', mage: 'MAGE' };

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
  const resetGame = useGameStore((state) => state.resetGame);
  const pushToLeaderboard = useGameStore((state) => state.pushToLeaderboard);
  const unlockAchievement = useGameStore((state) => state.unlockAchievement);

  useEffect(() => {
    if (isGameOver) playGameOver();
  }, [isGameOver]);

  useEffect(() => {
    if (!isGameOver) return;
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
      },
      prevHigh,
      (id) => unlockAchievement(id)
    );
  }, [isGameOver, score, pushToLeaderboard, unlockAchievement, highScore]);

  const handleRestart = useCallback(() => {
    resetGame();
  }, [resetGame]);

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
          FINAL SCORE: {score}
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
        <button style={TERRARIA_UI.buttonStyle(true)} onClick={handleRestart}>
          RESTART (R)
        </button>
      </div>
    </div>
  );
};

export default GameOver;
