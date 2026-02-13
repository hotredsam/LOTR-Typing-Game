/**
 * Manages game difficulty scaling based on score.
 */

interface Difficulty {
  spawnRate: number;
  minSpeed: number;
  maxSpeed: number;
}

/**
 * Calculates game difficulty parameters.
 * 
 * Complexity: O(1) - Direct mathematical calculation based on intervals.
 * 
 * @param score Current player score
 */
export function getDifficulty(score: number): Difficulty {
  const baseSpawnRate = 2000;
  const baseMinSpeed = 50;
  const baseMaxSpeed = 100;

  // Scale every 500 points
  const level = Math.floor(score / 500);

  const spawnRate = Math.max(500, baseSpawnRate - level * 100);
  const minSpeed = baseMinSpeed + level * 10;
  const maxSpeed = baseMaxSpeed + level * 10;

  return {
    spawnRate,
    minSpeed,
    maxSpeed
  };
}
