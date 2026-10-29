// Dictionary Loader & Preprocessing Engine for AnagramSolver Pro

// Map of dictionary ID to file paths and human-readable metadata
export const DICTIONARY_META = {
  enable1: {
    id: 'enable1',
    name: 'Words With Friends (ENABLE1)',
    description: 'Official standard list used by WWF, Scrabble GO, and digital games (172,823 words)',
    file: '/dictionaries/enable1.txt',
    defaultGame: 'wwf',
    count: 172823
  },
  twl06: {
    id: 'twl06',
    name: 'Scrabble US (TWL06)',
    description: 'Tournament Word List used in North American competitive Scrabble (83,667 words)',
    file: '/dictionaries/twl06.txt',
    defaultGame: 'scrabble',
    count: 83667
  },
  sowpods: {
    id: 'sowpods',
    name: 'Scrabble UK / Collins (SOWPODS / CSW)',
    description: 'International English Scrabble tournament lexicon (267,751 words)',
    file: '/dictionaries/sowpods.txt',
    defaultGame: 'scrabble',
    count: 267751
  },
  common: {
    id: 'common',
    name: 'Everyday Common Words (20,000)',
    description: 'Top modern conversational English words (filters out archaic Scrabble slang)',
    file: '/dictionaries/common.txt',
    defaultGame: 'scrabble',
    count: 20000
  }
};

// Internal cache: id -> array of { word, len, counts: Uint8Array(26) }
const loadedDictionaries = new Map();

// Helper to precalculate letter frequency histograms
export function buildWordRecord(rawWord) {
  const word = rawWord.trim().toUpperCase();
  const counts = new Uint8Array(26);
  const len = word.length;
  for (let i = 0; i < len; i++) {
    const code = word.charCodeAt(i) - 65;
    if (code >= 0 && code < 26) {
      counts[code]++;
    }
  }
  return { word, len, counts };
}

// Load a specific dictionary asynchronously
export async function loadDictionary(dictId = 'enable1', onProgress = null) {
  if (loadedDictionaries.has(dictId)) {
    return loadedDictionaries.get(dictId);
  }

  const meta = DICTIONARY_META[dictId] || DICTIONARY_META.enable1;
  if (onProgress) onProgress(`Loading ${meta.name}...`, 20);

  try {
    const res = await fetch(meta.file);
    if (!res.ok) {
      throw new Error(`Failed to load dictionary from ${meta.file}: HTTP ${res.status}`);
    }
    if (onProgress) onProgress('Parsing lexicon...', 60);

    const text = await res.text();
    const lines = text.split(/\r?\n/);
    const records = [];

    for (let i = 0; i < lines.length; i++) {
      const clean = lines[i].trim().toUpperCase();
      // Only include words with length >= 2 containing pure English letters
      if (clean.length >= 2 && /^[A-Z]+$/.test(clean)) {
        records.push(buildWordRecord(clean));
      }
    }

    if (onProgress) onProgress('Index complete!', 100);
    loadedDictionaries.set(dictId, records);
    return records;
  } catch (err) {
    console.error('Error loading dictionary:', err);
    throw err;
  }
}

// Get already loaded dictionary records or null
export function getLoadedDictionary(dictId = 'enable1') {
  return loadedDictionaries.get(dictId) || null;
}
