/**
 * Fantasy word generator for the typing game.
 */

const fantasyTerms = [
  'dragon', 'wizard', 'castle', 'sword', 'shield',
  'horse', 'unicorn', 'elf', 'dwarf', 'magic',
  'spell', 'curse', 'enchanted', 'fairytale', 'legend',
  'mythical', 'treasure', 'adventure', 'quest', 'hero',
  'dungeon', 'goblin', 'orc', 'paladin', 'ranger',
  'knight', 'throne', 'crown', 'realm', 'battle',
  'armor', 'lance', 'steed', 'tavern', 'inn',
  'forest', 'cavern', 'tower', 'bridge', 'gate',
  'scroll', 'rune', 'amulet', 'potion', 'staff',
  'blade', 'arrow', 'bow', 'helm', 'gauntlet',
  'sorcerer', 'warlock', 'mage', 'cleric', 'bard',
  'rogue', 'assassin', 'berserker', 'monk', 'shaman',
  'beast', 'serpent', 'griffin', 'phoenix', 'hydra',
  'troll', 'ogre', 'ghost', 'wraith', 'specter',
  'demon', 'angel', 'titan', 'giant', 'sprite',
  'fairy', 'nymph', 'dryad', 'sylph', 'pixie',
  'realm', 'kingdom', 'empire', 'fortress', 'citadel',
  'banner', 'sigil', 'crest', 'herald', 'oath',
  'valor', 'honor', 'glory', 'fate', 'doom',
  'shadow', 'twilight', 'dawn', 'dusk', 'storm',
  'frost', 'flame', 'ember', 'cinder', 'blaze',
]

/**
 * Returns the list of all fantasy terms (for tests and validation).
 */
export function getWordList(): readonly string[] {
  return fantasyTerms
}

/**
 * Returns a random fantasy term.
 */
export function getRandomWord(): string {
  return fantasyTerms[Math.floor(Math.random() * fantasyTerms.length)]
}
