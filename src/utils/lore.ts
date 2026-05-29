/** Lore content for the About page. Pure data — no rendering here. */

export interface FellowshipMember {
  name: string;
  race: string;
  blurb: string;
  emoji: string;
}

export const FELLOWSHIP: FellowshipMember[] = [
  { name: 'Frodo', race: 'Hobbit', blurb: 'The Ring-bearer who carried the burden to Mount Doom.', emoji: '💍' },
  { name: 'Samwise', race: 'Hobbit', blurb: 'The truest friend; he carried Frodo when Frodo could not walk.', emoji: '🥔' },
  { name: 'Gandalf', race: 'Wizard', blurb: 'The Grey, then the White. A servant of the Secret Fire.', emoji: '🧙' },
  { name: 'Aragorn', race: 'Man', blurb: 'Heir of Isildur, the king who returned to Gondor.', emoji: '👑' },
  { name: 'Legolas', race: 'Elf', blurb: 'Prince of the Woodland Realm with peerless aim.', emoji: '🏹' },
  { name: 'Gimli', race: 'Dwarf', blurb: 'Son of Glóin; counted his foes by the dozen.', emoji: '🪓' },
  { name: 'Boromir', race: 'Man', blurb: 'Of Gondor. Redeemed in his final stand.', emoji: '🛡️' },
  { name: 'Merry', race: 'Hobbit', blurb: 'Helped fell the Witch-king of Angmar.', emoji: '⚔️' },
  { name: 'Pippin', race: 'Hobbit', blurb: 'Took of the Shire; looked into the Palantír.', emoji: '🔮' },
];

export interface Realm {
  name: string;
  blurb: string;
}

export const REALMS: Realm[] = [
  { name: 'The Shire', blurb: 'Green hills and second breakfasts. Home of the Hobbits.' },
  { name: 'Rivendell', blurb: 'The Last Homely House east of the Sea, refuge of Elrond.' },
  { name: 'Moria', blurb: 'The ancient dwarf-realm of Khazad-dûm, now home to shadow and flame.' },
  { name: 'Lothlórien', blurb: 'The Golden Wood, guarded by Galadriel and Celeborn.' },
  { name: 'Rohan', blurb: 'Land of the horse-lords, the Riddermark of the Mark.' },
  { name: 'Gondor', blurb: 'The realm of Men, crowned by the white city of Minas Tirith.' },
  { name: 'Mordor', blurb: 'The Black Land, where the shadows lie, ringed by mountains.' },
];

/** Lines of the Ring inscription (revealed one at a time). */
export const RING_INSCRIPTION: string[] = [
  'One Ring to rule them all,',
  'One Ring to find them,',
  'One Ring to bring them all,',
  'and in the darkness bind them.',
];

export interface TechBadge {
  name: string;
  version: string;
}

export const TECH_BADGES: TechBadge[] = [
  { name: 'TypeScript', version: '5.2' },
  { name: 'React', version: '18.2' },
  { name: 'Phaser', version: '3.80' },
  { name: 'Zustand', version: '4.5' },
  { name: 'Vite', version: '5.2' },
  { name: 'Vitest', version: '1.3' },
];
