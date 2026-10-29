// Scoring systems and tile letter values for Scrabble and Words With Friends

export const SCRABBLE_POINTS = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1, M: 3,
  N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10,
  '?': 0, '*': 0, ' ': 0
};

export const WWF_POINTS = {
  A: 1, B: 4, C: 4, D: 2, E: 1, F: 4, G: 3, H: 3, I: 1, J: 10, K: 5, L: 2, M: 4,
  N: 2, O: 1, P: 4, Q: 10, R: 1, S: 1, T: 1, U: 2, V: 5, W: 4, X: 8, Y: 3, Z: 10,
  '?': 0, '*': 0, ' ': 0
};

// Official Scrabble Bag distribution (100 tiles)
export const SCRABBLE_BAG = [
  'E','E','E','E','E','E','E','E','E','E','E','E',
  'A','A','A','A','A','A','A','A','A',
  'I','I','I','I','I','I','I','I','I',
  'O','O','O','O','O','O','O','O',
  'N','N','N','N','N','N',
  'R','R','R','R','R','R',
  'T','T','T','T','T','T',
  'L','L','L','L',
  'S','S','S','S',
  'U','U','U','U',
  'D','D','D','D',
  'G','G','G',
  'B','B',
  'C','C',
  'M','M',
  'P','P',
  'F','F',
  'H','H',
  'V','V',
  'W','W',
  'Y','Y',
  'K',
  'J',
  'X',
  'Q',
  'Z',
  '?', '?'
];

// Words With Friends Bag distribution (104 tiles)
export const WWF_BAG = [
  'E','E','E','E','E','E','E','E','E','E','E','E','E',
  'A','A','A','A','A','A','A','A','A',
  'I','I','I','I','I','I','I','I',
  'O','O','O','O','O','O','O','O',
  'T','T','T','T','T','T','T',
  'R','R','R','R','R','R',
  'S','S','S','S','S',
  'D','D','D','D','D',
  'N','N','N','N','N',
  'L','L','L','L',
  'U','U','U','U',
  'H','H','H','H',
  'G','G','G',
  'B','B',
  'C','C',
  'F','F',
  'M','M',
  'P','P',
  'W','W',
  'Y','Y',
  'V','V',
  'K',
  'J',
  'X',
  'Q',
  'Z',
  '?', '?'
];

export function getLetterScore(letter, gameType = 'scrabble') {
  const char = (letter || '').toUpperCase();
  const table = gameType === 'wwf' ? WWF_POINTS : SCRABBLE_POINTS;
  return table[char] !== undefined ? table[char] : 0;
}

export function calculateScore(word, gameType = 'scrabble', blankIndices = []) {
  if (!word) return 0;
  const table = gameType === 'wwf' ? WWF_POINTS : SCRABBLE_POINTS;
  let total = 0;
  const upper = word.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    // If this letter was substituted from a blank tile, its point value is 0
    if (blankIndices.includes(i)) {
      continue;
    }
    const c = upper[i];
    total += table[c] || 0;
  }
  // Scrabble Bingo Bonus: using 7 tiles grants +50 points!
  // In WWF: using 7 tiles grants +35 points!
  return total;
}

export function getScoreBreakdown(word, gameType = 'scrabble', blankIndices = []) {
  if (!word) return { letters: [], total: 0 };
  const table = gameType === 'wwf' ? WWF_POINTS : SCRABBLE_POINTS;
  const letters = [];
  let total = 0;
  const upper = word.toUpperCase();

  for (let i = 0; i < upper.length; i++) {
    const char = upper[i];
    const isBlank = blankIndices.includes(i);
    const pts = isBlank ? 0 : (table[char] || 0);
    letters.push({
      char,
      pts,
      isBlank
    });
    total += pts;
  }

  return { letters, total };
}

// Generate a random realistic rack drawn from the tile bag
export function getRandomRack(size = 7, gameType = 'scrabble') {
  const bag = [...(gameType === 'wwf' ? WWF_BAG : SCRABBLE_BAG)];
  const rack = [];
  for (let i = 0; i < size; i++) {
    if (bag.length === 0) break;
    const randIdx = Math.floor(Math.random() * bag.length);
    rack.push(bag.splice(randIdx, 1)[0]);
  }
  return rack.join('');
}

// Complete Official 2-Letter Scrabble & Words With Friends List with Quick Meanings
export const TWO_LETTER_WORDS = [
  { word: 'AA', scrabble: 2, wwf: 2, def: 'A type of rough, cindery lava' },
  { word: 'AB', scrabble: 4, wwf: 5, def: 'An abdominal muscle' },
  { word: 'AD', scrabble: 3, wwf: 3, def: 'An advertisement' },
  { word: 'AE', scrabble: 2, wwf: 2, def: 'One (Scots dialect)' },
  { word: 'AG', scrabble: 3, wwf: 4, def: 'Agriculture or related to farming' },
  { word: 'AH', scrabble: 5, wwf: 4, def: 'Exclamation of delight or relief' },
  { word: 'AI', scrabble: 2, wwf: 2, def: 'The three-toed sloth' },
  { word: 'AL', scrabble: 2, wwf: 3, def: 'An East Indian tree (Morinda citrifolia)' },
  { word: 'AM', scrabble: 4, wwf: 5, def: 'First-person present of be' },
  { word: 'AN', scrabble: 2, wwf: 3, def: 'Indefinite article' },
  { word: 'AR', scrabble: 2, wwf: 2, def: 'The letter R' },
  { word: 'AS', scrabble: 2, wwf: 2, def: 'To the same degree' },
  { word: 'AT', scrabble: 2, wwf: 2, def: 'Expressing location or arrival' },
  { word: 'AW', scrabble: 5, wwf: 5, def: 'Exclamation of pity or protest' },
  { word: 'AX', scrabble: 9, wwf: 9, def: 'A cutting tool' },
  { word: 'AY', scrabble: 5, wwf: 4, def: 'Aye; an affirmative vote' },
  { word: 'BA', scrabble: 4, wwf: 5, def: 'The soul in ancient Egyptian belief' },
  { word: 'BE', scrabble: 4, wwf: 5, def: 'To exist' },
  { word: 'BI', scrabble: 4, wwf: 5, def: 'A bisexual person' },
  { word: 'BO', scrabble: 4, wwf: 5, def: 'A pal or buddy (slang)' },
  { word: 'BY', scrabble: 7, wwf: 7, def: 'Near or beside' },
  { word: 'DA', scrabble: 3, wwf: 3, def: 'Heavy Burmese knife; also dad' },
  { word: 'DE', scrabble: 3, wwf: 3, def: 'From, of (used in names)' },
  { word: 'DO', scrabble: 3, wwf: 3, def: 'To perform an action' },
  { word: 'ED', scrabble: 3, wwf: 3, def: 'Education (informal)' },
  { word: 'EF', scrabble: 5, wwf: 5, def: 'The letter F' },
  { word: 'EH', scrabble: 5, wwf: 4, def: 'Inquiring exclamation' },
  { word: 'EL', scrabble: 2, wwf: 3, def: 'Elevated railway' },
  { word: 'EM', scrabble: 4, wwf: 5, def: 'Printer\'s measure of width' },
  { word: 'EN', scrabble: 2, wwf: 3, def: 'Half the width of an em' },
  { word: 'ER', scrabble: 2, wwf: 2, def: 'Hesitation sound' },
  { word: 'ES', scrabble: 2, wwf: 2, def: 'The letter S' },
  { word: 'ET', scrabble: 2, wwf: 2, def: 'Past tense of eat' },
  { word: 'EW', scrabble: 5, wwf: 5, def: 'Expression of disgust' },
  { word: 'EX', scrabble: 9, wwf: 9, def: 'Former spouse or letter X' },
  { word: 'FA', scrabble: 5, wwf: 5, def: 'Musical solfege note' },
  { word: 'FE', scrabble: 5, wwf: 5, def: 'Hebrew letter pe' },
  { word: 'GI', scrabble: 3, wwf: 4, def: 'Martial arts uniform' },
  { word: 'GO', scrabble: 3, wwf: 4, def: 'To move or proceed' },
  { word: 'HA', scrabble: 5, wwf: 4, def: 'Exclamation of triumph or laughter' },
  { word: 'HE', scrabble: 5, wwf: 4, def: 'Third-person male pronoun' },
  { word: 'HI', scrabble: 5, wwf: 4, def: 'Friendly greeting' },
  { word: 'HM', scrabble: 7, wwf: 7, def: 'Exclamation of thought' },
  { word: 'HO', scrabble: 5, wwf: 4, def: 'Exclamation to attract attention' },
  { word: 'ID', scrabble: 3, wwf: 3, def: 'Freudian instinctual mind' },
  { word: 'IF', scrabble: 5, wwf: 5, def: 'Conditional conjunction' },
  { word: 'IN', scrabble: 2, wwf: 3, def: 'Preposition of location' },
  { word: 'IS', scrabble: 2, wwf: 2, def: 'Third person present of be' },
  { word: 'IT', scrabble: 2, wwf: 2, def: 'Inanimate pronoun' },
  { word: 'JO', scrabble: 9, wwf: 11, def: 'A sweetheart (Scottish)' },
  { word: 'KA', scrabble: 6, wwf: 6, def: 'Spiritual soul (ancient Egypt)' },
  { word: 'KI', scrabble: 6, wwf: 6, def: 'Life force or Japanese qi' },
  { word: 'LA', scrabble: 2, wwf: 3, def: 'Sixth tone of diatonic scale' },
  { word: 'LI', scrabble: 2, wwf: 3, def: 'Chinese unit of distance' },
  { word: 'LO', scrabble: 2, wwf: 3, def: 'Look, behold!' },
  { word: 'MA', scrabble: 4, wwf: 5, def: 'Mother' },
  { word: 'ME', scrabble: 4, wwf: 5, def: 'First-person singular objective' },
  { word: 'MI', scrabble: 4, wwf: 5, def: 'Third solfege note' },
  { word: 'MM', scrabble: 6, wwf: 8, def: 'Sound of satisfaction or assent' },
  { word: 'MO', scrabble: 4, wwf: 5, def: 'A short moment' },
  { word: 'MU', scrabble: 4, wwf: 6, def: 'Greek letter M' },
  { word: 'MY', scrabble: 7, wwf: 7, def: 'Possessive pronoun' },
  { word: 'NA', scrabble: 2, wwf: 3, def: 'No (dialect)' },
  { word: 'NE', scrabble: 2, wwf: 3, def: 'Born as (archaic)' },
  { word: 'NO', scrabble: 2, wwf: 3, def: 'Negative response' },
  { word: 'NU', scrabble: 2, wwf: 4, def: 'Greek letter N' },
  { word: 'OD', scrabble: 3, wwf: 3, def: 'Hypothetical natural force' },
  { word: 'OE', scrabble: 2, wwf: 2, def: 'A grandchild in Scottish dialect' },
  { word: 'OF', scrabble: 5, wwf: 5, def: 'Preposition of origin' },
  { word: 'OH', scrabble: 5, wwf: 4, def: 'Expression of surprise' },
  { word: 'OI', scrabble: 2, wwf: 2, def: 'Call for attention (British slang)' },
  { word: 'OK', scrabble: 6, wwf: 6, def: 'All right, acceptable' },
  { word: 'OM', scrabble: 4, wwf: 5, def: 'Sacred Hindu mantra syllable' },
  { word: 'ON', scrabble: 2, wwf: 3, def: 'Preposition of contact' },
  { word: 'OP', scrabble: 4, wwf: 5, def: 'Style of abstract art' },
  { word: 'OR', scrabble: 2, wwf: 2, def: 'Alternative conjunction' },
  { word: 'OS', scrabble: 2, wwf: 2, def: 'Bone or orifice' },
  { word: 'OW', scrabble: 5, wwf: 5, def: 'Exclamation of pain' },
  { word: 'OX', scrabble: 9, wwf: 9, def: 'Bovine animal' },
  { word: 'OY', scrabble: 5, wwf: 4, def: 'Exclamation of grief or pain' },
  { word: 'PA', scrabble: 4, wwf: 5, def: 'Father' },
  { word: 'PE', scrabble: 4, wwf: 5, def: 'Hebrew letter P' },
  { word: 'PI', scrabble: 4, wwf: 5, def: 'Greek letter & mathematical constant' },
  { word: 'PO', scrabble: 4, wwf: 5, def: 'Chamber pot (informal)' },
  { word: 'QI', scrabble: 11, wwf: 11, def: 'Vital life force in Chinese philosophy (Highest 2-letter word!)' },
  { word: 'RE', scrabble: 2, wwf: 2, def: 'Second musical solfege note' },
  { word: 'SH', scrabble: 5, wwf: 4, def: 'Urging silence' },
  { word: 'SI', scrabble: 2, wwf: 2, def: 'Seventh tone of diatonic scale' },
  { word: 'SO', scrabble: 2, wwf: 2, def: 'In such a manner' },
  { word: 'TA', scrabble: 2, wwf: 2, def: 'Thanks (informal British)' },
  { word: 'TE', scrabble: 2, wwf: 2, def: 'Ti (solfege syllable)' },
  { word: 'TI', scrabble: 2, wwf: 2, def: 'Seventh solfege syllable' },
  { word: 'TO', scrabble: 2, wwf: 2, def: 'Preposition of direction' },
  { word: 'UH', scrabble: 5, wwf: 4, def: 'Exclamation of hesitation' },
  { word: 'UM', scrabble: 4, wwf: 6, def: 'Expression of doubt' },
  { word: 'UN', scrabble: 2, wwf: 4, def: 'One (dialect)' },
  { word: 'UP', scrabble: 4, wwf: 6, def: 'Toward a higher place' },
  { word: 'US', scrabble: 2, wwf: 3, def: 'Objective form of we' },
  { word: 'UT', scrabble: 2, wwf: 3, def: 'Musical tone do' },
  { word: 'WE', scrabble: 5, wwf: 5, def: 'First-person plural pronoun' },
  { word: 'WO', scrabble: 5, wwf: 5, def: 'Woe (archaic)' },
  { word: 'XI', scrabble: 9, wwf: 9, def: 'Greek letter X' },
  { word: 'XU', scrabble: 9, wwf: 10, def: 'Vietnamese coin' },
  { word: 'YA', scrabble: 5, wwf: 4, def: 'You (informal)' },
  { word: 'YE', scrabble: 5, wwf: 4, def: 'You plural (archaic)' },
  { word: 'YO', scrabble: 5, wwf: 4, def: 'Exclamation greeting' },
  { word: 'ZA', scrabble: 11, wwf: 11, def: 'Pizza (slang - essential Z Scrabble tile word!)' }
];
