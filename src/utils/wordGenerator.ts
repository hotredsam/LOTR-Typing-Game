/**
 * Lord of the Rings themed word generator for the typing game.
 *
 * Words are grouped by category (for colour-coding) and exposed by difficulty
 * tier so that gameplay can ramp from short character names to full phrases.
 */

export type WordCategory = 'character' | 'place' | 'creature' | 'item' | 'phrase';
export type WordTier = 'easy' | 'medium' | 'hard';

/** Master vocabulary, grouped by category. */
export const LOTR_WORDS: Record<WordCategory, readonly string[]> = {
  character: [
    'frodo', 'sam', 'merry', 'pippin', 'bilbo', 'gandalf', 'aragorn',
    'legolas', 'gimli', 'boromir', 'sauron', 'saruman', 'gollum', 'smeagol',
    'elrond', 'galadriel', 'arwen', 'eowyn', 'eomer', 'theoden', 'faramir',
    'denethor', 'treebeard', 'tom', 'radagast', 'celeborn', 'glorfindel',
    'isildur', 'elendil', 'witchking', 'grima', 'haldir',
  ],
  place: [
    'shire', 'mordor', 'gondor', 'rohan', 'moria', 'isengard', 'rivendell',
    'lothlorien', 'fangorn', 'osgiliath', 'minas', 'tirith', 'morgul',
    'helmsdeep', 'edoras', 'bree', 'weathertop', 'orthanc', 'barad', 'dur',
    'mirkwood', 'erebor', 'gladden', 'anduin', 'pelennor', 'cirith', 'ungol',
  ],
  creature: [
    'orc', 'uruk', 'goblin', 'troll', 'balrog', 'nazgul', 'warg', 'ent',
    'eagle', 'spider', 'shelob', 'oliphaunt', 'wraith', 'fellbeast', 'dragon',
    'smaug', 'hobbit', 'elf', 'dwarf', 'wizard', 'ringwraith',
  ],
  item: [
    'ring', 'mithril', 'palantir', 'anduril', 'sting', 'glamdring', 'narsil',
    'lembas', 'pipe', 'staff', 'phial', 'mallorn', 'silmaril', 'arkenstone',
    'horn', 'cloak', 'elfstone', 'orcrist', 'mithrandir',
  ],
  phrase: [
    'you shall not pass',
    'one ring to rule them all',
    'speak friend and enter',
    'fly you fools',
    'not all those who wander are lost',
    'my precious',
    'the eagles are coming',
    'a wizard is never late',
    'even the smallest person',
    'for frodo',
    'death is just another path',
  ],
};

/** A flat list of every single (non-phrase) word. */
const SINGLE_WORDS: readonly string[] = [
  ...LOTR_WORDS.character,
  ...LOTR_WORDS.place,
  ...LOTR_WORDS.creature,
  ...LOTR_WORDS.item,
];

/** Reverse lookup of word -> category, built once. */
const CATEGORY_INDEX: Map<string, WordCategory> = (() => {
  const m = new Map<string, WordCategory>();
  (Object.keys(LOTR_WORDS) as WordCategory[]).forEach((cat) => {
    LOTR_WORDS[cat].forEach((w) => m.set(w, cat));
  });
  return m;
})();

let lastWord = '';

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Returns the category for a given word (defaults to 'phrase' if multi-word). */
export function getWordCategory(word: string): WordCategory {
  return CATEGORY_INDEX.get(word) ?? (word.includes(' ') ? 'phrase' : 'character');
}

/** All single words (used by tests / validation). */
export function getWordList(): readonly string[] {
  return SINGLE_WORDS;
}

/** Words filtered to a difficulty tier. */
export function getWordsByTier(tier: WordTier): readonly string[] {
  switch (tier) {
    case 'easy':
      return SINGLE_WORDS.filter((w) => w.length <= 5);
    case 'medium':
      return SINGLE_WORDS.filter((w) => w.length >= 6 && w.length <= 8);
    case 'hard':
      return [...SINGLE_WORDS.filter((w) => w.length >= 9), ...LOTR_WORDS.phrase];
  }
}

/** Maps a level to a difficulty tier. */
export function tierForLevel(level: number): WordTier {
  if (level >= 7) return 'hard';
  if (level >= 3) return 'medium';
  return 'easy';
}

/**
 * Returns a random word appropriate for the given level, avoiding an immediate
 * repeat of the previously returned word.
 */
export function getWordByLevel(level: number): string {
  const tier = tierForLevel(level);
  const pool = getWordsByTier(tier);
  // Higher levels occasionally sprinkle in an easier word for variety.
  const source = level >= 5 && Math.random() < 0.25 ? SINGLE_WORDS : pool;
  let word = pick(source);
  let guard = 0;
  while (word === lastWord && source.length > 1 && guard++ < 8) {
    word = pick(source);
  }
  lastWord = word;
  return word;
}

/** Backward-compatible random word (level-agnostic). */
export function getRandomWord(level = 1): string {
  return getWordByLevel(level);
}
