/**
 * Calculates the stats of a typing session.
 *
 * @param typedChars The total number of characters typed.
 * @param correctChars The number of correctly typed characters.
 * @param startTime The start time of the typing session in milliseconds.
 * @param endTime The end time of the typing session in milliseconds.
 * @returns An object with the calculated WPM, accuracy and raw WPM.
 */
export function calculateStats(
  typedChars: number,
  correctChars: number,
  startTime: number,
  endTime: number
): { wpm: number, accuracy: number, rawWpm: number } {
  const timeDiff = endTime - startTime;

  if (timeDiff === 0) {
    return {
      wpm: 0,
      accuracy: 0,
      rawWpm: 0,
    };
  }

  const wpm = (correctChars / 5) / (timeDiff / 60000);
  const accuracy = typedChars === 0 ? 0 : (correctChars / typedChars) * 100;
  const rawWpm = (typedChars / 5) / (timeDiff / 60000);

  return { wpm, accuracy, rawWpm };
}

/** Base points per word (length * 10 * comboMult). Add lengthBonus and speedBonus. */
export function wordPoints(
  wordLength: number,
  comboMultiplier: number,
  lengthBonus: number = 0,
  speedBonus: number = 0
): number {
  const base = wordLength * 10 * comboMultiplier;
  return Math.round(base + lengthBonus + speedBonus);
}

/** Extra points for longer words. */
export function lengthBonus(wordLength: number): number {
  if (wordLength <= 4) return 0;
  return (wordLength - 4) * 5;
}

/** Speed bonus: complete word quickly after spawn (points scale down over 3s). */
export function speedBonus(msSinceSpawn: number): number {
  if (msSinceSpawn <= 0) return 20;
  if (msSinceSpawn >= 3000) return 0;
  return Math.round(20 * (1 - msSinceSpawn / 3000));
}
