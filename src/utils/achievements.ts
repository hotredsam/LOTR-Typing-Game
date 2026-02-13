export interface IAchievement {
  id: string;
  name: string;
  description: string;
}

export const ACHIEVEMENTS: IAchievement[] = [
  { id: 'first_word', name: 'FIRST STRIKE', description: 'Complete your first word' },
  { id: 'combo_5', name: 'COMBO 5', description: 'Reach a 5 word combo' },
  { id: 'combo_10', name: 'COMBO 10', description: 'Reach a 10 word combo' },
  { id: 'words_25', name: 'WARM UP', description: 'Complete 25 words' },
  { id: 'words_50', name: 'IN THE ZONE', description: 'Complete 50 words' },
  { id: 'words_100', name: 'CENTURY', description: 'Complete 100 words' },
  { id: 'score_500', name: 'SCORER', description: 'Reach 500 points' },
  { id: 'score_1000', name: 'CHAMPION', description: 'Reach 1000 points' },
  { id: 'high_score', name: 'NEW RECORD', description: 'Beat your high score' },
  { id: 'streak_10', name: 'STREAK 10', description: '10 words in a row without miss' },
  { id: 'timed_win', name: 'TIME ATTACK', description: 'Finish a timed round' },
];

export function checkAchievements(
  state: {
    wordsCompleted: number;
    score: number;
    bestCombo: number;
    streak: number;
    highScore: number;
    gameMode: string;
    timeRemaining: number;
  },
  _prevHighScore: number,
  unlock: (id: string) => void
): void {
  if (state.wordsCompleted >= 1) unlock('first_word');
  if (state.bestCombo >= 5) unlock('combo_5');
  if (state.bestCombo >= 10) unlock('combo_10');
  if (state.wordsCompleted >= 25) unlock('words_25');
  if (state.wordsCompleted >= 50) unlock('words_50');
  if (state.wordsCompleted >= 100) unlock('words_100');
  if (state.score >= 500) unlock('score_500');
  if (state.score >= 1000) unlock('score_1000');
  if (state.score > 0 && state.score >= state.highScore) unlock('high_score');
  if (state.streak >= 10) unlock('streak_10');
  if (state.gameMode === 'timed' && state.timeRemaining > 0) unlock('timed_win');
}
