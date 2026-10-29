// High-Performance Anagram & Sub-word Solver Engine for AnagramSolver Pro
import { calculateScore } from './scoring.js';

export function parseRack(rackInput) {
  const cleanInput = (rackInput || '').toUpperCase();
  const rackCounts = new Uint8Array(26);
  let wildcards = 0;
  let totalLetters = 0;

  for (let i = 0; i < cleanInput.length; i++) {
    const char = cleanInput[i];
    if (char === '?' || char === '*' || char === ' ') {
      wildcards++;
      totalLetters++;
    } else {
      const code = char.charCodeAt(0) - 65;
      if (code >= 0 && code < 26) {
        rackCounts[code]++;
        totalLetters++;
      }
    }
  }

  return { rackCounts, wildcards, totalLetters, rawLetters: cleanInput };
}

/**
 * Solve single-word anagrams and sub-anagrams
 */
export function solveAnagrams(dictionaryRecords, rackInput, options = {}) {
  const {
    mustUseAllLetters = false,
    startsWith = '',
    endsWith = '',
    contains = '',
    excludeLetters = '',
    minLength = 2,
    maxLength = 15,
    regexPattern = '',
    sortBy = 'length-desc', // 'length-desc', 'scrabble', 'wwf', 'alpha'
    gameType = 'scrabble'
  } = options;

  const { rackCounts, wildcards, totalLetters } = parseRack(rackInput);

  if (totalLetters === 0 || !dictionaryRecords || dictionaryRecords.length === 0) {
    return { words: [], executionTimeMs: 0, totalMatches: 0 };
  }

  const startTime = performance.now();

  const cleanStartsWith = startsWith.trim().toUpperCase();
  const cleanEndsWith = endsWith.trim().toUpperCase();
  const cleanContains = contains.trim().toUpperCase();
  const cleanExclude = (excludeLetters || '').toUpperCase().replace(/[^A-Z]/g, '');

  let customRegex = null;
  if (regexPattern && regexPattern.trim()) {
    try {
      customRegex = new RegExp(regexPattern.trim(), 'i');
    } catch {
      customRegex = null;
    }
  }

  const matches = [];

  for (let i = 0; i < dictionaryRecords.length; i++) {
    const item = dictionaryRecords[i];
    const wLen = item.len;

    // Length boundaries
    if (wLen < minLength || wLen > maxLength) continue;
    if (wLen > totalLetters) continue;
    if (mustUseAllLetters && wLen !== totalLetters) continue;

    // Filter by prefix, suffix, substring
    if (cleanStartsWith && !item.word.startsWith(cleanStartsWith)) continue;
    if (cleanEndsWith && !item.word.endsWith(cleanEndsWith)) continue;
    if (cleanContains && !item.word.includes(cleanContains)) continue;

    // Excluded letters check
    if (cleanExclude) {
      let hasExcluded = false;
      for (let e = 0; e < cleanExclude.length; e++) {
        const eCode = cleanExclude.charCodeAt(e) - 65;
        if (item.counts[eCode] > 0) {
          hasExcluded = true;
          break;
        }
      }
      if (hasExcluded) continue;
    }

    // Custom regex check
    if (customRegex && !customRegex.test(item.word)) continue;

    // Check letter frequency match with wildcards
    let neededWildcards = 0;
    let possible = true;
    const missingLetterCodes = [];

    for (let c = 0; c < 26; c++) {
      const wCount = item.counts[c];
      const rCount = rackCounts[c];
      if (wCount > rCount) {
        const deficit = wCount - rCount;
        neededWildcards += deficit;
        if (neededWildcards > wildcards) {
          possible = false;
          break;
        }
        for (let k = 0; k < deficit; k++) {
          missingLetterCodes.push(c);
        }
      }
    }

    if (!possible) continue;

    // Determine which character positions in the word used blank/wildcard tiles
    const blankIndices = [];
    if (missingLetterCodes.length > 0) {
      const remainingDeficits = new Map();
      for (const code of missingLetterCodes) {
        remainingDeficits.set(code, (remainingDeficits.get(code) || 0) + 1);
      }

      for (let pos = 0; pos < item.word.length; pos++) {
        const code = item.word.charCodeAt(pos) - 65;
        if ((remainingDeficits.get(code) || 0) > 0) {
          blankIndices.push(pos);
          remainingDeficits.set(code, remainingDeficits.get(code) - 1);
        }
      }
    }

    const scrabbleScore = calculateScore(item.word, 'scrabble', blankIndices);
    const wwfScore = calculateScore(item.word, 'wwf', blankIndices);

    matches.push({
      word: item.word,
      length: wLen,
      scrabbleScore,
      wwfScore,
      blankIndices,
      wildcardsUsed: neededWildcards
    });
  }

  // Sorting matches
  matches.sort((a, b) => {
    switch (sortBy) {
      case 'scrabble':
        return b.scrabbleScore - a.scrabbleScore || b.length - a.length || a.word.localeCompare(b.word);
      case 'wwf':
        return b.wwfScore - a.wwfScore || b.length - a.length || a.word.localeCompare(b.word);
      case 'length-asc':
        return a.length - b.length || b.scrabbleScore - a.scrabbleScore || a.word.localeCompare(b.word);
      case 'alpha':
        return a.word.localeCompare(b.word);
      case 'length-desc':
      default:
        return b.length - a.length || (gameType === 'wwf' ? b.wwfScore - a.wwfScore : b.scrabbleScore - a.scrabbleScore) || a.word.localeCompare(b.word);
    }
  });

  const executionTimeMs = parseFloat((performance.now() - startTime).toFixed(1));

  return {
    words: matches,
    executionTimeMs,
    totalMatches: matches.length
  };
}

/**
 * Multi-Word Anagram Solver (e.g. "CLINT EASTWOOD" -> "OLD WEST ACTION")
 */
export function solveMultiWordAnagrams(dictionaryRecords, phraseInput, options = {}) {
  const { maxWords = 2, minWordLen = 3, limit = 100 } = options;
  const startTime = performance.now();

  const cleanLetters = (phraseInput || '').toUpperCase().replace(/[^A-Z]/g, '');
  if (cleanLetters.length < minWordLen * 2) {
    return { results: [], executionTimeMs: 0, totalMatches: 0 };
  }

  // Count frequencies
  const targetCounts = new Uint8Array(26);
  for (let i = 0; i < cleanLetters.length; i++) {
    targetCounts[cleanLetters.charCodeAt(i) - 65]++;
  }

  // Filter dictionary to words that can be formed from the target phrase
  const candidateWords = [];
  for (let i = 0; i < dictionaryRecords.length; i++) {
    const item = dictionaryRecords[i];
    if (item.len < minWordLen || item.len > cleanLetters.length - minWordLen) continue;

    let fits = true;
    for (let c = 0; c < 26; c++) {
      if (item.counts[c] > targetCounts[c]) {
        fits = false;
        break;
      }
    }
    if (fits) {
      candidateWords.push(item);
    }
  }

  const results = [];

  function backtrack(currentCounts, wordsUsed, startIndex, remainingLen) {
    if (results.length >= limit) return;

    if (remainingLen === 0) {
      results.push([...wordsUsed]);
      return;
    }

    if (wordsUsed.length >= maxWords) return;

    for (let i = startIndex; i < candidateWords.length; i++) {
      if (results.length >= limit) break;
      const candidate = candidateWords[i];
      if (candidate.len > remainingLen) continue;

      let canUse = true;
      for (let c = 0; c < 26; c++) {
        if (candidate.counts[c] > currentCounts[c]) {
          canUse = false;
          break;
        }
      }

      if (canUse) {
        const nextCounts = new Uint8Array(currentCounts);
        for (let c = 0; c < 26; c++) {
          nextCounts[c] -= candidate.counts[c];
        }

        wordsUsed.push(candidate.word);
        backtrack(nextCounts, wordsUsed, i, remainingLen - candidate.len);
        wordsUsed.pop();
      }
    }
  }

  backtrack(targetCounts, [], 0, cleanLetters.length);

  const executionTimeMs = parseFloat((performance.now() - startTime).toFixed(1));

  return {
    results,
    executionTimeMs,
    totalMatches: results.length
  };
}

/**
 * Pattern Matcher (Crossword, Wordle, Hook letter matching)
 * Example pattern: "C . . T" or "S ? ? L E"
 */
export function solvePattern(dictionaryRecords, patternInput, options = {}) {
  const startTime = performance.now();
  const pattern = (patternInput || '').trim().toUpperCase().replace(/\s+/g, '');

  if (!pattern || !dictionaryRecords) {
    return { words: [], executionTimeMs: 0, totalMatches: 0 };
  }

  const { availableLetters = '', gameType = 'scrabble' } = options;
  const rackFilter = availableLetters ? parseRack(availableLetters) : null;

  const targetLen = pattern.length;
  const matches = [];

  for (let i = 0; i < dictionaryRecords.length; i++) {
    const item = dictionaryRecords[i];
    if (item.len !== targetLen) continue;

    let ok = true;
    for (let p = 0; p < targetLen; p++) {
      const pChar = pattern[p];
      if (pChar !== '.' && pChar !== '?' && pChar !== '*' && pChar !== '_') {
        if (item.word[p] !== pChar) {
          ok = false;
          break;
        }
      }
    }

    if (!ok) continue;

    // If available letters constraint is supplied
    if (rackFilter && rackFilter.totalLetters > 0) {
      let needed = 0;
      for (let c = 0; c < 26; c++) {
        if (item.counts[c] > rackFilter.rackCounts[c]) {
          needed += (item.counts[c] - rackFilter.rackCounts[c]);
          if (needed > rackFilter.wildcards) {
            ok = false;
            break;
          }
        }
      }
      if (!ok) continue;
    }

    const scrabbleScore = calculateScore(item.word, 'scrabble');
    const wwfScore = calculateScore(item.word, 'wwf');

    matches.push({
      word: item.word,
      length: item.len,
      scrabbleScore,
      wwfScore,
      blankIndices: []
    });
  }

  matches.sort((a, b) => b.scrabbleScore - a.scrabbleScore || a.word.localeCompare(b.word));
  const executionTimeMs = parseFloat((performance.now() - startTime).toFixed(1));

  return {
    words: matches,
    executionTimeMs,
    totalMatches: matches.length
  };
}
