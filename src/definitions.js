// Word definitions service with API integration, offline quick definitions, and speech synthesis

// In-memory cache for fetched definitions
const definitionCache = new Map();

// Quick offline definitions for high-frequency or tricky words
const QUICK_DEFINITIONS = {
  QI: { partOfSpeech: 'noun', definition: 'The circulating life force whose flow is thought to be essential for health in traditional Chinese medicine.' },
  ZA: { partOfSpeech: 'noun', definition: 'Pizza (slang used frequently in Scrabble).' },
  AA: { partOfSpeech: 'noun', definition: 'A basaltic lava flow that breaks into rough, sharp, blocky scoriae.' },
  JO: { partOfSpeech: 'noun', definition: 'A sweetheart or dear companion (Scottish).' },
  XI: { partOfSpeech: 'noun', definition: 'The 14th letter of the Greek alphabet (Ξ, ξ).' },
  XU: { partOfSpeech: 'noun', definition: 'A monetary unit of Vietnam, equal to one hundredth of a dong.' },
  AI: { partOfSpeech: 'noun', definition: 'The three-toed sloth (Bradypus tridactylus) of South and Central America.' },
  QAT: { partOfSpeech: 'noun', definition: 'The leaves of an Arabian shrub (Catha edulis) chewed as a mild stimulant.' },
  ZOEA: { partOfSpeech: 'noun', definition: 'A free-swimming larval stage of crabs and certain other decapod crustaceans.' },
  SUQ: { partOfSpeech: 'noun', definition: 'An open-air marketplace or bazaar in an Arab city.' },
  CWT: { partOfSpeech: 'noun', definition: 'A hundredweight (unit of mass).' }
};

export async function fetchWordDefinition(word) {
  const clean = (word || '').trim().toLowerCase();
  if (!clean) return null;

  if (definitionCache.has(clean)) {
    return definitionCache.get(clean);
  }

  // Check offline dictionary first
  const upper = clean.toUpperCase();
  const offlineMatch = QUICK_DEFINITIONS[upper];

  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${clean}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        const phonetics = item.phonetic || (item.phonetics && item.phonetics.find(p => p.text)?.text) || '';
        const audioUrl = item.phonetics && item.phonetics.find(p => p.audio && p.audio.length > 0)?.audio || '';

        const meanings = [];
        if (item.meanings) {
          for (const m of item.meanings) {
            const partOfSpeech = m.partOfSpeech || 'definition';
            const defs = (m.definitions || []).slice(0, 3).map(d => ({
              definition: d.definition,
              example: d.example || null
            }));
            meanings.push({ partOfSpeech, definitions: defs });
          }
        }

        const result = {
          word: item.word || clean,
          phonetics,
          audioUrl,
          meanings,
          source: 'api'
        };

        definitionCache.set(clean, result);
        return result;
      }
    }
  } catch (err) {
    console.warn(`Definition API error for "${clean}":`, err);
  }

  // Fallback to offline definitions or generic info
  if (offlineMatch) {
    const fallback = {
      word: upper,
      phonetics: '',
      audioUrl: '',
      meanings: [
        {
          partOfSpeech: offlineMatch.partOfSpeech,
          definitions: [{ definition: offlineMatch.definition }]
        }
      ],
      source: 'offline'
    };
    definitionCache.set(clean, fallback);
    return fallback;
  }

  // Return minimal entry with external lookup links
  const minimal = {
    word: clean.toUpperCase(),
    phonetics: '',
    audioUrl: '',
    meanings: [
      {
        partOfSpeech: 'Valid Word',
        definitions: [
          {
            definition: `Official tournament word listed in game dictionaries. Check full etymology and usage on external reference dictionaries.`
          }
        ]
      }
    ],
    source: 'minimal'
  };
  definitionCache.set(clean, minimal);
  return minimal;
}

export function speakWord(word) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.rate = 0.9;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
}
