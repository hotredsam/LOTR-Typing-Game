export interface IAchievement {
  id: string;
  name: string;
  description: string;
  /** Emoji shown in the overlay & toast. */
  icon: string;
}

export const ACHIEVEMENTS: IAchievement[] = [
  { id: 'first_word', name: 'FIRST STRIKE', description: 'Complete your first word', icon: '⚔️' },
  { id: 'combo_5', name: 'COMBO 5', description: 'Reach a 5 word combo', icon: '🔥' },
  { id: 'combo_10', name: 'COMBO 10', description: 'Reach a 10 word combo', icon: '🔥' },
  { id: 'combo_25', name: 'BALROG SLAYER', description: 'Reach a 25 word combo', icon: '💥' },
  { id: 'words_25', name: 'WARM UP', description: 'Complete 25 words', icon: '🌱' },
  { id: 'words_50', name: 'IN THE ZONE', description: 'Complete 50 words', icon: '🌿' },
  { id: 'words_100', name: 'CENTURY', description: 'Complete 100 words', icon: '💯' },
  { id: 'score_500', name: 'SCORER', description: 'Reach 500 points', icon: '⭐' },
  { id: 'score_1000', name: 'CHAMPION', description: 'Reach 1000 points', icon: '🏆' },
  { id: 'score_5000', name: 'LORD OF TYPING', description: 'Reach 5000 points', icon: '👑' },
  { id: 'high_score', name: 'NEW RECORD', description: 'Beat your high score', icon: '📈' },
  { id: 'streak_10', name: 'STREAK 10', description: '10 words in a row without a miss', icon: '🎯' },
  { id: 'streak_30', name: 'NOT ALL WANDER', description: '30 words in a row without a miss', icon: '🧭' },
  { id: 'timed_win', name: 'TIME ATTACK', description: 'Finish a timed round', icon: '⏱️' },
  { id: 'level_5', name: 'ONE DOES NOT SIMPLY', description: 'Reach level 5', icon: '🌋' },
  { id: 'level_10', name: 'INTO MORDOR', description: 'Reach level 10', icon: '🔺' },
  { id: 'flawless', name: 'MITHRIL ACCURACY', description: 'Finish a game at 100% accuracy (10+ words)', icon: '🛡️' },
  { id: 'zen_master', name: 'A WIZARD IS NEVER LATE', description: 'Play a Zen session', icon: '🧙' },
  { id: 'hardcore_win', name: 'YOU SHALL NOT PASS', description: 'Score 500+ in Hardcore mode', icon: '🪄' },
  { id: 'powerup', name: 'THE EAGLES ARE COMING', description: 'Trigger a power-up', icon: '🦅' },
  { id: 'speak_friend', name: 'SPEAK FRIEND', description: 'Find the secret on the About page', icon: '🚪' },
];

export interface AchievementCheckState {
  wordsCompleted: number;
  score: number;
  bestCombo: number;
  streak: number;
  highScore: number;
  gameMode: string;
  timeRemaining: number;
  level: number;
  accuracy: number;
}

export function checkAchievements(
  state: AchievementCheckState,
  _prevHighScore: number,
  unlock: (id: string) => void
): void {
  if (state.wordsCompleted >= 1) unlock('first_word');
  if (state.bestCombo >= 5) unlock('combo_5');
  if (state.bestCombo >= 10) unlock('combo_10');
  if (state.bestCombo >= 25) unlock('combo_25');
  if (state.wordsCompleted >= 25) unlock('words_25');
  if (state.wordsCompleted >= 50) unlock('words_50');
  if (state.wordsCompleted >= 100) unlock('words_100');
  if (state.score >= 500) unlock('score_500');
  if (state.score >= 1000) unlock('score_1000');
  if (state.score >= 5000) unlock('score_5000');
  if (state.score > 0 && state.score >= state.highScore) unlock('high_score');
  if (state.streak >= 10) unlock('streak_10');
  if (state.streak >= 30) unlock('streak_30');
  if (state.gameMode === 'timed' && state.timeRemaining > 0) unlock('timed_win');
  if (state.level >= 5) unlock('level_5');
  if (state.level >= 10) unlock('level_10');
  if (state.wordsCompleted >= 10 && state.accuracy >= 100) unlock('flawless');
  if (state.gameMode === 'zen' && state.wordsCompleted >= 1) unlock('zen_master');
  if (state.gameMode === 'hardcore' && state.score >= 500) unlock('hardcore_win');
}
