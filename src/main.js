// AnagramSolver Pro - Core Orchestration & UI Controller
import { sound } from './sound.js';
import {
  DICTIONARY_META,
  loadDictionary,
  getLoadedDictionary
} from './dictionary.js';
import {
  solveAnagrams,
  solveMultiWordAnagrams,
  solvePattern
} from './solver.js';
import {
  getLetterScore,
  getRandomRack,
  getScoreBreakdown,
  TWO_LETTER_WORDS
} from './scoring.js';
import {
  fetchWordDefinition,
  speakWord
} from './definitions.js';
import { AnagramGame } from './game.js';

// Application State
const state = {
  currentTab: 'single', // 'single', 'multi', 'pattern', 'game', 'two-letters'
  currentDictId: 'enable1',
  dictionaryRecords: [],
  rackLetters: '',
  gameType: 'scrabble', // 'scrabble' or 'wwf'
  activeLengthFilter: 'all',
  lastSolvedWords: [],
  savedWords: JSON.parse(localStorage.getItem('asp_saved_words') || '[]'),
  theme: localStorage.getItem('asp_theme') || 'dark',
  gameInstance: null
};

// DOM Elements Cache
const DOM = {};

function initDOMElements() {
  DOM.html = document.documentElement;
  DOM.rackInput = document.getElementById('rack-input');
  DOM.rackShelf = document.getElementById('rack-shelf');
  DOM.rackPlaceholder = document.getElementById('rack-placeholder');
  DOM.clearRackBtn = document.getElementById('clear-rack-btn');
  DOM.solveBtn = document.getElementById('solve-btn');
  DOM.toggleOptionsBtn = document.getElementById('toggle-options-btn');
  DOM.advancedPanel = document.getElementById('advanced-panel');
  DOM.activeFiltersBadge = document.getElementById('active-filters-badge');
  DOM.shuffleRackBtn = document.getElementById('shuffle-rack-btn');
  DOM.randomRackBtn = document.getElementById('random-rack-btn');
  DOM.resetFiltersBtn = document.getElementById('reset-filters-btn');

  // Filter inputs
  DOM.filterDict = document.getElementById('filter-dict');
  DOM.filterSort = document.getElementById('filter-sort');
  DOM.filterStartsWith = document.getElementById('filter-starts-with');
  DOM.filterEndsWith = document.getElementById('filter-ends-with');
  DOM.filterContains = document.getElementById('filter-contains');
  DOM.filterExclude = document.getElementById('filter-exclude');
  DOM.filterMinLen = document.getElementById('filter-min-len');
  DOM.filterMaxLen = document.getElementById('filter-max-len');
  DOM.filterAllLetters = document.getElementById('filter-all-letters');

  // Results elements
  DOM.resultsContainer = document.getElementById('results-container');
  DOM.resultsToolbar = document.getElementById('results-toolbar');
  DOM.statWordCount = document.getElementById('stat-word-count');
  DOM.statTime = document.getElementById('stat-time');
  DOM.statDictName = document.getElementById('stat-dict-name');
  DOM.lengthPills = document.getElementById('length-pills');
  DOM.resultsGroups = document.getElementById('results-groups');
  DOM.copyAllBtn = document.getElementById('copy-all-btn');
  DOM.exportCsvBtn = document.getElementById('export-csv-btn');

  // Multi-word elements
  DOM.multiInput = document.getElementById('multi-input');
  DOM.multiSolveBtn = document.getElementById('multi-solve-btn');
  DOM.multiMaxWords = document.getElementById('multi-max-words');
  DOM.multiMinLen = document.getElementById('multi-min-len');
  DOM.multiResultsContainer = document.getElementById('multi-results-container');

  // Pattern elements
  DOM.patternInput = document.getElementById('pattern-input');
  DOM.patternSolveBtn = document.getElementById('pattern-solve-btn');
  DOM.patternRackConstraint = document.getElementById('pattern-rack-constraint');
  DOM.patternResultsContainer = document.getElementById('pattern-results-container');

  // Game elements
  DOM.gameDifficultySelect = document.getElementById('game-difficulty-select');
  DOM.gameScoreVal = document.getElementById('game-score-val');
  DOM.gameStreakVal = document.getElementById('game-streak-val');
  DOM.gameTimerVal = document.getElementById('game-timer-val');
  DOM.gameGuessSlots = document.getElementById('game-guess-slots');
  DOM.gameScrambledRack = document.getElementById('game-scrambled-rack');
  DOM.gameClearBtn = document.getElementById('game-clear-btn');
  DOM.gameShuffleBtn = document.getElementById('game-shuffle-btn');
  DOM.gameHintBtn = document.getElementById('game-hint-btn');
  DOM.gameHintsCount = document.getElementById('game-hints-count');
  DOM.gameNextBtn = document.getElementById('game-next-btn');
  DOM.gameHintBox = document.getElementById('game-hint-box');

  // 2-Letter Sheet elements
  DOM.twoLetterSearch = document.getElementById('two-letter-search');
  DOM.twoLetterGrid = document.getElementById('two-letter-grid');
  DOM.sort2LetterAlpha = document.getElementById('sort-2letter-alpha');
  DOM.sort2LetterPoints = document.getElementById('sort-2letter-points');

  // Header utilities & Modals
  DOM.soundToggleBtn = document.getElementById('sound-toggle-btn');
  DOM.soundIconOn = document.getElementById('sound-icon-on');
  DOM.soundIconOff = document.getElementById('sound-icon-off');
  DOM.themeToggleBtn = document.getElementById('theme-toggle-btn');
  DOM.themeIconSun = document.getElementById('theme-icon-sun');
  DOM.themeIconMoon = document.getElementById('theme-icon-moon');
  DOM.savedWordsBtn = document.getElementById('saved-words-btn');
  DOM.savedBadge = document.getElementById('saved-badge');

  DOM.definitionModal = document.getElementById('definition-modal');
  DOM.modalWordText = document.getElementById('modal-word-text');
  DOM.modalPhoneticText = document.getElementById('modal-phonetic-text');
  DOM.modalPronounceBtn = document.getElementById('modal-pronounce-btn');
  DOM.modalCloseBtn = document.getElementById('modal-close-btn');
  DOM.modalScoreTiles = document.getElementById('modal-score-tiles');
  DOM.modalScrabbleTotal = document.getElementById('modal-scrabble-total');
  DOM.modalWwfTotal = document.getElementById('modal-wwf-total');
  DOM.modalDefinitionsList = document.getElementById('modal-definitions-list');
  DOM.modalMerriamLink = document.getElementById('modal-merriam-link');
  DOM.modalWiktionaryLink = document.getElementById('modal-wiktionary-link');
  DOM.modalSaveWordBtn = document.getElementById('modal-save-word-btn');
  DOM.modalSaveText = document.getElementById('modal-save-text');

  DOM.savedDrawer = document.getElementById('saved-drawer');
  DOM.savedCloseBtn = document.getElementById('saved-close-btn');
  DOM.savedCountText = document.getElementById('saved-count-text');
  DOM.savedWordsList = document.getElementById('saved-words-list');
  DOM.clearSavedBtn = document.getElementById('clear-saved-btn');
  DOM.exportSavedBtn = document.getElementById('export-saved-btn');

  DOM.toastContainer = document.getElementById('toast-container');
  DOM.brandHomeBtn = document.getElementById('brand-home-btn');
}

// Toast Notifications System
export function showToast(message, type = 'info') {
  if (!DOM.toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
    <span>${message}</span>
  `;
  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 250);
  }, 2600);
}

// Theme Management
function applyTheme(theme) {
  state.theme = theme;
  DOM.html.setAttribute('data-theme', theme);
  localStorage.setItem('asp_theme', theme);

  if (theme === 'light') {
    DOM.themeIconSun.style.display = 'none';
    DOM.themeIconMoon.style.display = 'block';
  } else {
    DOM.themeIconSun.style.display = 'block';
    DOM.themeIconMoon.style.display = 'none';
  }
}

function toggleTheme() {
  const next = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  sound.playTileClick();
}

// Sound Management
function updateSoundIcons() {
  if (sound.enabled) {
    DOM.soundIconOn.style.display = 'block';
    DOM.soundIconOff.style.display = 'none';
  } else {
    DOM.soundIconOn.style.display = 'none';
    DOM.soundIconOff.style.display = 'block';
  }
}

// Navigation Tab Switching
function switchTab(tabId) {
  state.currentTab = tabId;

  // Update nav buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    const isActive = btn.getAttribute('data-tab') === tabId;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // Update panes
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.style.display = 'none';
  });

  const activePane = document.getElementById(`tab-content-${tabId}`);
  if (activePane) {
    activePane.style.display = 'block';
  }

  sound.playTileClick();

  // If switched to game mode, initialize if needed
  if (tabId === 'game') {
    if (!state.gameInstance) {
      initGameMode();
    }
  } else if (tabId === 'two-letters') {
    renderTwoLetterWords();
  }
}

// Render physical 3D Scrabble tiles onto the rack shelf
function renderRackShelf() {
  const letters = state.rackLetters.toUpperCase();
  DOM.rackShelf.innerHTML = '';

  if (!letters) {
    DOM.rackPlaceholder.style.display = 'block';
    DOM.rackShelf.appendChild(DOM.rackPlaceholder);
    DOM.clearRackBtn.style.display = 'none';
    return;
  }

  DOM.clearRackBtn.style.display = 'flex';

  for (let i = 0; i < letters.length; i++) {
    const char = letters[i];
    const isBlank = char === '?' || char === '*' || char === ' ';
    const score = isBlank ? 0 : getLetterScore(char, state.gameType);

    const tile = document.createElement('div');
    tile.className = `word-tile ${isBlank ? 'is-blank' : ''}`;
    tile.title = `Click to remove '${isBlank ? 'BLANK' : char}'`;
    tile.innerHTML = `
      <span>${isBlank ? '?' : char}</span>
      <span class="tile-score">${score}</span>
    `;

    // Click on tile to remove it from rack
    tile.addEventListener('click', () => {
      const arr = state.rackLetters.split('');
      arr.splice(i, 1);
      state.rackLetters = arr.join('');
      DOM.rackInput.value = state.rackLetters;
      sound.playTileClick();
      renderRackShelf();
      updateUrlParams();
      performSolve();
    });

    DOM.rackShelf.appendChild(tile);
  }
}

// Advanced options count badge updater
function updateActiveFiltersBadge() {
  let count = 0;
  if (DOM.filterStartsWith.value.trim()) count++;
  if (DOM.filterEndsWith.value.trim()) count++;
  if (DOM.filterContains.value.trim()) count++;
  if (DOM.filterExclude.value.trim()) count++;
  if (DOM.filterMinLen.value !== '2') count++;
  if (DOM.filterMaxLen.value !== '15') count++;
  if (DOM.filterAllLetters.checked) count++;
  if (DOM.filterSort.value !== 'length-desc') count++;

  if (count > 0) {
    DOM.activeFiltersBadge.textContent = count;
    DOM.activeFiltersBadge.style.display = 'flex';
  } else {
    DOM.activeFiltersBadge.style.display = 'none';
  }
}

// Main Single-Word Anagram Solver Execution
function performSolve() {
  const query = state.rackLetters.trim();
  if (!query) {
    DOM.resultsToolbar.style.display = 'none';
    DOM.lengthPills.style.display = 'none';
    DOM.resultsGroups.innerHTML = `
      <div class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 9 6 6"/><path d="m15 9-6 6"/></svg>
        <h3 class="empty-title">Ready to Unscramble</h3>
        <p class="empty-desc">Enter your letters in the search bar above or click <strong>Random Rack</strong> to test a 7-tile Scrabble hand.</p>
      </div>
    `;
    return;
  }

  const options = {
    mustUseAllLetters: DOM.filterAllLetters.checked,
    startsWith: DOM.filterStartsWith.value,
    endsWith: DOM.filterEndsWith.value,
    contains: DOM.filterContains.value,
    excludeLetters: DOM.filterExclude.value,
    minLength: parseInt(DOM.filterMinLen.value, 10),
    maxLength: parseInt(DOM.filterMaxLen.value, 10),
    sortBy: DOM.filterSort.value,
    gameType: state.gameType
  };

  const { words, executionTimeMs, totalMatches } = solveAnagrams(
    state.dictionaryRecords,
    query,
    options
  );

  state.lastSolvedWords = words;
  renderResults(words, executionTimeMs, totalMatches);
  sound.playSolve();
}

// Render solved words grouped by length with filter pills
function renderResults(words, executionTimeMs, totalMatches) {
  DOM.resultsToolbar.style.display = 'flex';
  DOM.statWordCount.textContent = totalMatches.toLocaleString();
  DOM.statTime.textContent = `${executionTimeMs}ms`;
  DOM.statDictName.textContent = DICTIONARY_META[state.currentDictId]?.name.split('(')[0].trim() || 'LEXICON';

  if (totalMatches === 0) {
    DOM.lengthPills.style.display = 'none';
    DOM.resultsGroups.innerHTML = `
      <div class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <h3 class="empty-title">No Matching Words Found</h3>
        <p class="empty-desc">No words could be formed with the current letters and filters. Try adding blanks (<span class="kbd-badge">?</span>) or relaxing your filter constraints.</p>
      </div>
    `;
    return;
  }

  // Group words by length
  const groups = new Map();
  for (const item of words) {
    if (!groups.has(item.length)) {
      groups.set(item.length, []);
    }
    groups.get(item.length).push(item);
  }

  // Sorted lengths descending
  const sortedLengths = Array.from(groups.keys()).sort((a, b) => b - a);

  // Render Length Filter Pills
  DOM.lengthPills.style.display = 'flex';
  DOM.lengthPills.innerHTML = '';

  const allPill = document.createElement('button');
  allPill.className = `len-pill ${state.activeLengthFilter === 'all' ? 'active' : ''}`;
  allPill.textContent = `All (${totalMatches})`;
  allPill.addEventListener('click', () => {
    state.activeLengthFilter = 'all';
    filterResultsByLength('all');
  });
  DOM.lengthPills.appendChild(allPill);

  for (const len of sortedLengths) {
    const count = groups.get(len).length;
    const pill = document.createElement('button');
    pill.className = `len-pill ${state.activeLengthFilter === String(len) ? 'active' : ''}`;
    pill.textContent = `${len} Letters (${count})`;
    pill.addEventListener('click', () => {
      state.activeLengthFilter = String(len);
      filterResultsByLength(String(len));
    });
    DOM.lengthPills.appendChild(pill);
  }

  // Render Word Accordion Groups
  DOM.resultsGroups.innerHTML = '';
  for (const len of sortedLengths) {
    const list = groups.get(len);
    const groupDiv = document.createElement('div');
    groupDiv.className = 'word-group';
    groupDiv.setAttribute('data-length', len);

    groupDiv.innerHTML = `
      <div class="word-group-header">
        <div class="group-title">
          <span>${len}-Letter Words</span>
          <span class="group-count-badge">${list.length}</span>
        </div>
        <svg class="group-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="word-grid"></div>
    `;

    // Collapsible accordion header
    const header = groupDiv.querySelector('.word-group-header');
    header.addEventListener('click', () => {
      groupDiv.classList.toggle('collapsed');
      sound.playTileClick();
    });

    const grid = groupDiv.querySelector('.word-grid');
    for (const item of list) {
      grid.appendChild(createWordCard(item));
    }

    DOM.resultsGroups.appendChild(groupDiv);
  }
}

// Filter visible word groups based on selected length pill
function filterResultsByLength(lengthStr) {
  document.querySelectorAll('.len-pill').forEach(pill => {
    const isTarget = (lengthStr === 'all' && pill.textContent.startsWith('All')) ||
                     pill.textContent.startsWith(`${lengthStr} `);
    pill.classList.toggle('active', isTarget);
  });

  document.querySelectorAll('.word-group').forEach(group => {
    const gLen = group.getAttribute('data-length');
    if (lengthStr === 'all' || lengthStr === gLen) {
      group.style.display = 'block';
    } else {
      group.style.display = 'none';
    }
  });

  sound.playTileClick();
}

// Generate single word card element with scores, blanks highlight, and hover actions
function createWordCard(item) {
  const card = document.createElement('div');
  card.className = 'word-card';

  // Highlight blank substituted letters
  let wordHtml = '';
  for (let i = 0; i < item.word.length; i++) {
    const char = item.word[i];
    if (item.blankIndices && item.blankIndices.includes(i)) {
      wordHtml += `<span class="card-blank-letter" title="Wildcard tile">${char}</span>`;
    } else {
      wordHtml += `<span>${char}</span>`;
    }
  }

  const isSaved = state.savedWords.some(w => w.word === item.word);

  card.innerHTML = `
    <div class="word-card-text">${wordHtml}</div>
    <div class="word-scores">
      <span class="score-badge scrabble" title="Scrabble Points">SCR ${item.scrabbleScore}</span>
      <span class="score-badge wwf" title="Words With Friends Points">WWF ${item.wwfScore}</span>
    </div>
    <div class="card-hover-actions">
      <button class="mini-action-btn btn-def" title="Lookup Definition">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
      </button>
      <button class="mini-action-btn btn-copy" title="Copy Word">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
      </button>
      <button class="mini-action-btn btn-star ${isSaved ? 'starred' : ''}" title="${isSaved ? 'Saved' : 'Save to Favorites'}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      </button>
    </div>
  `;

  // Clicking card opens definition modal
  card.addEventListener('click', (e) => {
    if (e.target.closest('.card-hover-actions')) return;
    openWordDefinition(item);
  });

  // Action: Definition button
  card.querySelector('.btn-def').addEventListener('click', (e) => {
    e.stopPropagation();
    openWordDefinition(item);
  });

  // Action: Copy Word button
  card.querySelector('.btn-copy').addEventListener('click', (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.word);
    showToast(`Copied "${item.word}" to clipboard!`);
    sound.playTileClick();
  });

  // Action: Star/Save button
  const starBtn = card.querySelector('.btn-star');
  starBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSaveWord(item);
    const updatedSaved = state.savedWords.some(w => w.word === item.word);
    starBtn.classList.toggle('starred', updatedSaved);
    starBtn.querySelector('svg').setAttribute('fill', updatedSaved ? 'currentColor' : 'none');
  });

  return card;
}

// Definition Modal Handler
async function openWordDefinition(item) {
  const word = item.word;
  DOM.modalWordText.textContent = word;
  DOM.modalPhoneticText.textContent = '...';
  DOM.modalDefinitionsList.innerHTML = '<div style="color:var(--text-muted); padding:1rem 0;">Fetching definition...</div>';

  // Render tile breakdown
  const breakdown = getScoreBreakdown(word, state.gameType, item.blankIndices || []);
  DOM.modalScoreTiles.innerHTML = '';
  for (const b of breakdown.letters) {
    const t = document.createElement('div');
    t.className = 'mini-score-tile';
    t.innerHTML = `${b.char}<span>${b.pts}</span>`;
    DOM.modalScoreTiles.appendChild(t);
  }

  DOM.modalScrabbleTotal.textContent = `${item.scrabbleScore} pts`;
  DOM.modalWwfTotal.textContent = `${item.wwfScore} pts`;

  // External reference links
  DOM.modalMerriamLink.href = `https://www.merriam-webster.com/dictionary/${word.toLowerCase()}`;
  DOM.modalWiktionaryLink.href = `https://en.wiktionary.org/wiki/${word.toLowerCase()}`;

  // Update save button state in modal
  const isSaved = state.savedWords.some(w => w.word === word);
  DOM.modalSaveText.textContent = isSaved ? 'Saved in Favorites' : 'Save Word';

  DOM.modalPronounceBtn.onclick = () => {
    speakWord(word);
    sound.playTileClick();
  };

  DOM.modalSaveWordBtn.onclick = () => {
    toggleSaveWord(item);
    const nowSaved = state.savedWords.some(w => w.word === word);
    DOM.modalSaveText.textContent = nowSaved ? 'Saved in Favorites' : 'Save Word';
  };

  // Open modal
  DOM.definitionModal.classList.add('open');
  sound.playTileClick();

  // Fetch definition
  const data = await fetchWordDefinition(word);
  if (data && data.phonetics) {
    DOM.modalPhoneticText.textContent = data.phonetics;
  } else {
    DOM.modalPhoneticText.textContent = '';
  }

  if (data && data.meanings && data.meanings.length > 0) {
    DOM.modalDefinitionsList.innerHTML = '';
    for (const m of data.meanings) {
      const defItem = document.createElement('div');
      defItem.className = 'definition-item';
      defItem.innerHTML = `
        <span class="def-pos">${m.partOfSpeech}</span>
        ${m.definitions.map(d => `
          <div class="def-text">&bull; ${d.definition}</div>
          ${d.example ? `<div class="def-example">"${d.example}"</div>` : ''}
        `).join('')}
      `;
      DOM.modalDefinitionsList.appendChild(defItem);
    }
  } else {
    DOM.modalDefinitionsList.innerHTML = `
      <div style="color:var(--text-muted); font-size:0.95rem;">
        Official tournament word listed in Scrabble &amp; Words With Friends lexicons.
        Click <strong>Merriam-Webster</strong> or <strong>Wiktionary</strong> below to inspect detailed historical etymology.
      </div>
    `;
  }
}

function closeDefinitionModal() {
  DOM.definitionModal.classList.remove('open');
  sound.playTileClick();
}

// Saved Words & Favorites
function toggleSaveWord(item) {
  const index = state.savedWords.findIndex(w => w.word === item.word);
  if (index >= 0) {
    state.savedWords.splice(index, 1);
    showToast(`Removed "${item.word}" from favorites`);
  } else {
    state.savedWords.push(item);
    showToast(`Added "${item.word}" to favorites!`);
    sound.playTileClick();
  }
  localStorage.setItem('asp_saved_words', JSON.stringify(state.savedWords));
  updateSavedBadge();
}

function updateSavedBadge() {
  const count = state.savedWords.length;
  DOM.savedBadge.textContent = count;
  DOM.savedCountText.textContent = `(${count} words)`;
}

function openSavedDrawer() {
  DOM.savedWordsList.innerHTML = '';
  if (state.savedWords.length === 0) {
    DOM.savedWordsList.innerHTML = `
      <div class="empty-state" style="padding:2rem;">
        <p class="empty-desc">No saved words yet. Click the star icon on any word to bookmark it here!</p>
      </div>
    `;
  } else {
    for (const item of state.savedWords) {
      const card = createWordCard(item);
      DOM.savedWordsList.appendChild(card);
    }
  }
  DOM.savedDrawer.classList.add('open');
  sound.playTileClick();
}

function closeSavedDrawer() {
  DOM.savedDrawer.classList.remove('open');
  sound.playTileClick();
}

// Multi-Word Anagram Mode Execution
function performMultiSolve() {
  const phrase = DOM.multiInput.value.trim();
  if (!phrase) {
    showToast('Please enter a phrase or name to unscramble');
    return;
  }

  const maxWords = parseInt(DOM.multiMaxWords.value, 10);
  const minWordLen = parseInt(DOM.multiMinLen.value, 10);

  DOM.multiResultsContainer.innerHTML = '<div style="text-align:center; padding:2rem; color:var(--text-muted);">Finding phrase anagrams...</div>';

  setTimeout(() => {
    const { results, executionTimeMs, totalMatches } = solveMultiWordAnagrams(
      state.dictionaryRecords,
      phrase,
      { maxWords, minWordLen, limit: 120 }
    );

    if (totalMatches === 0) {
      DOM.multiResultsContainer.innerHTML = `
        <div class="empty-state">
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <h3 class="empty-title">No Multi-Word Combinations Found</h3>
          <p class="empty-desc">Try shortening the phrase or setting min word length to 3 letters.</p>
        </div>
      `;
      return;
    }

    DOM.multiResultsContainer.innerHTML = `
      <div class="results-toolbar">
        <span class="results-summary">Found <strong style="color:var(--text-primary);">${totalMatches}</strong> phrase anagrams in <span class="time-badge">${executionTimeMs}ms</span></span>
      </div>
      <div class="word-grid" style="margin-top:1rem;"></div>
    `;

    const grid = DOM.multiResultsContainer.querySelector('.word-grid');
    for (const wordsArray of results) {
      const phraseText = wordsArray.join(' ');
      const card = document.createElement('div');
      card.className = 'word-card';
      card.style.justifyContent = 'space-between';
      card.innerHTML = `
        <span class="word-card-text" style="font-size:1rem;">${phraseText}</span>
        <button class="mini-action-btn" title="Copy Phrase" style="display:flex;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        </button>
      `;

      card.addEventListener('click', () => {
        navigator.clipboard.writeText(phraseText);
        showToast(`Copied "${phraseText}" to clipboard!`);
        sound.playTileClick();
      });

      grid.appendChild(card);
    }

    sound.playSolve();
  }, 10);
}

// Pattern & Crossword Matcher Execution
function performPatternSolve() {
  const pattern = DOM.patternInput.value.trim();
  if (!pattern) {
    showToast('Please enter a pattern like C..T or S??LE');
    return;
  }

  const rackConstraint = DOM.patternRackConstraint.value.trim();
  const { words, executionTimeMs, totalMatches } = solvePattern(
    state.dictionaryRecords,
    pattern,
    { availableLetters: rackConstraint, gameType: state.gameType }
  );

  if (totalMatches === 0) {
    DOM.patternResultsContainer.innerHTML = `
      <div class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <h3 class="empty-title">No Pattern Matches Found</h3>
        <p class="empty-desc">Check your letters and ensure the pattern length is realistic.</p>
      </div>
    `;
    return;
  }

  DOM.patternResultsContainer.innerHTML = `
    <div class="results-toolbar">
      <span class="results-summary">Found <strong style="color:var(--text-primary);">${totalMatches}</strong> words matching pattern <code>${pattern.toUpperCase()}</code> in <span class="time-badge">${executionTimeMs}ms</span></span>
    </div>
    <div class="word-grid" style="margin-top:1rem;"></div>
  `;

  const grid = DOM.patternResultsContainer.querySelector('.word-grid');
  for (const item of words) {
    grid.appendChild(createWordCard(item));
  }

  sound.playSolve();
}

// Anagram Arena Game Mode Initializer
function initGameMode() {
  state.gameInstance = new AnagramGame(state.dictionaryRecords, (gameState) => {
    renderGameState(gameState);
  });

  DOM.gameDifficultySelect.onchange = () => {
    state.gameInstance.startNewRound(DOM.gameDifficultySelect.value);
  };

  DOM.gameClearBtn.onclick = () => state.gameInstance.clearGuess();
  DOM.gameShuffleBtn.onclick = () => state.gameInstance.shuffleAvailable();
  DOM.gameHintBtn.onclick = () => state.gameInstance.getHint();
  DOM.gameNextBtn.onclick = () => state.gameInstance.startNewRound();

  // Global key listener for game mode
  window.addEventListener('keydown', (e) => {
    if (state.currentTab !== 'game') return;
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

    if (e.key === 'Backspace') {
      state.gameInstance.typeCharacter('BACKSPACE');
      e.preventDefault();
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      state.gameInstance.typeCharacter(e.key);
      e.preventDefault();
    }
  });

  state.gameInstance.startNewRound(DOM.gameDifficultySelect.value);
}

function renderGameState(gameState) {
  DOM.gameScoreVal.textContent = gameState.score;
  DOM.gameStreakVal.textContent = `🔥 ${gameState.streak}`;
  DOM.gameTimerVal.textContent = `${gameState.timer}s`;
  DOM.gameHintsCount.textContent = 2 - gameState.hintsUsed;

  // Render Target Guess Slots
  DOM.gameGuessSlots.innerHTML = '';
  const totalSlots = gameState.targetWord.length;

  for (let i = 0; i < totalSlots; i++) {
    const slot = document.createElement('div');
    const guessTile = gameState.currentGuess[i];

    if (guessTile) {
      slot.className = 'guess-slot filled';
      slot.textContent = guessTile.char;
      slot.title = 'Click to return tile';
      slot.addEventListener('click', () => {
        state.gameInstance.removeGuessTile(i);
      });
    } else {
      slot.className = 'guess-slot';
      slot.textContent = '';
    }
    DOM.gameGuessSlots.appendChild(slot);
  }

  // Render Scrambled Interactive Tiles
  DOM.gameScrambledRack.innerHTML = '';
  for (const tile of gameState.availableTiles) {
    const tileDiv = document.createElement('div');
    tileDiv.className = `game-tile ${tile.used ? 'used' : ''}`;
    tileDiv.textContent = tile.char;

    tileDiv.addEventListener('click', () => {
      state.gameInstance.selectTile(tile.id);
    });

    DOM.gameScrambledRack.appendChild(tileDiv);
  }

  // Render Hint Box
  if (gameState.hintDefinition) {
    DOM.gameHintBox.style.display = 'block';
    DOM.gameHintBox.innerHTML = `<strong>Clue:</strong> ${gameState.hintDefinition}`;
  } else {
    DOM.gameHintBox.style.display = 'none';
  }

  // Win State handling
  if (gameState.isSolved) {
    showToast(`Solved! "${gameState.targetWord}" (+${gameState.targetWord.length * 10} pts)`, 'success');
  }
}

// 2-Letter Scrabble & Words With Friends Cheat Sheet
function renderTwoLetterWords(sortBy = 'alpha', searchFilter = '') {
  let list = [...TWO_LETTER_WORDS];

  if (searchFilter) {
    const q = searchFilter.trim().toUpperCase();
    list = list.filter(item => item.word.includes(q) || item.def.toUpperCase().includes(q));
  }

  if (sortBy === 'points') {
    list.sort((a, b) => b.scrabble - a.scrabble || a.word.localeCompare(b.word));
  } else {
    list.sort((a, b) => a.word.localeCompare(b.word));
  }

  DOM.twoLetterGrid.innerHTML = '';
  for (const item of list) {
    const card = document.createElement('div');
    card.className = 'word-card';
    card.style.flexDirection = 'column';
    card.style.alignItems = 'flex-start';
    card.style.gap = '0.35rem';
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
        <span class="word-card-text" style="font-size:1.3rem;">${item.word}</span>
        <div class="word-scores">
          <span class="score-badge scrabble">SCR ${item.scrabble}</span>
          <span class="score-badge wwf">WWF ${item.wwf}</span>
        </div>
      </div>
      <div style="font-size:0.8rem; color:var(--text-muted); line-height:1.3;">
        ${item.def}
      </div>
    `;

    card.addEventListener('click', () => {
      openWordDefinition({
        word: item.word,
        scrabbleScore: item.scrabble,
        wwfScore: item.wwf,
        blankIndices: []
      });
    });

    DOM.twoLetterGrid.appendChild(card);
  }
}

// Synchronize search query parameters to URL for bookmarking and sharing
function updateUrlParams() {
  const url = new URL(window.location.href);
  if (state.rackLetters) {
    url.searchParams.set('letters', state.rackLetters);
  } else {
    url.searchParams.delete('letters');
  }
  if (state.currentDictId !== 'enable1') {
    url.searchParams.set('dict', state.currentDictId);
  }
  window.history.replaceState({}, '', url.toString());
}

// Read URL parameters on startup
function readUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const letters = params.get('letters');
  const dict = params.get('dict');

  if (dict && DICTIONARY_META[dict]) {
    state.currentDictId = dict;
    DOM.filterDict.value = dict;
  }

  if (letters) {
    state.rackLetters = letters.toUpperCase();
    DOM.rackInput.value = state.rackLetters;
    renderRackShelf();
    performSolve();
  }
}

// Switch Dictionary & Reload Records
async function switchDictionary(dictId) {
  state.currentDictId = dictId;
  state.gameType = DICTIONARY_META[dictId]?.defaultGame || 'scrabble';

  showToast(`Switching to ${DICTIONARY_META[dictId]?.name}...`);

  try {
    state.dictionaryRecords = await loadDictionary(dictId);
    if (state.gameInstance) {
      state.gameInstance.setDictionary(state.dictionaryRecords);
    }
    showToast(`Loaded ${state.dictionaryRecords.length.toLocaleString()} words!`);
    updateUrlParams();
    performSolve();
  } catch (err) {
    showToast('Failed to switch dictionary', 'error');
  }
}

// Event Listeners Binding
function bindEventListeners() {
  // Brand reset to home
  DOM.brandHomeBtn.addEventListener('click', () => {
    state.rackLetters = '';
    DOM.rackInput.value = '';
    renderRackShelf();
    updateUrlParams();
    performSolve();
    switchTab('single');
  });

  // Navigation tab clicks
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.getAttribute('data-tab'));
    });
  });

  // Sound & Theme toggles
  DOM.soundToggleBtn.addEventListener('click', () => {
    sound.toggle();
    updateSoundIcons();
  });

  DOM.themeToggleBtn.addEventListener('click', toggleTheme);

  // Saved Words drawer
  DOM.savedWordsBtn.addEventListener('click', openSavedDrawer);
  DOM.savedCloseBtn.addEventListener('click', closeSavedDrawer);
  DOM.savedDrawer.addEventListener('click', (e) => {
    if (e.target === DOM.savedDrawer) closeSavedDrawer();
  });

  DOM.clearSavedBtn.addEventListener('click', () => {
    state.savedWords = [];
    localStorage.setItem('asp_saved_words', '[]');
    updateSavedBadge();
    openSavedDrawer();
    showToast('Saved words cleared');
  });

  DOM.exportSavedBtn.addEventListener('click', () => {
    if (state.savedWords.length === 0) return;
    const txt = state.savedWords.map(w => `${w.word}, SCR: ${w.scrabbleScore}, WWF: ${w.wwfScore}`).join('\n');
    downloadFile(txt, 'saved_words.txt', 'text/plain');
  });

  // Main input keyboard handler
  DOM.rackInput.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
      // Space converts to ? (wildcard)
      e.preventDefault();
      const input = DOM.rackInput;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const val = input.value;
      input.value = val.substring(0, start) + '?' + val.substring(end);
      input.selectionStart = input.selectionEnd = start + 1;
      state.rackLetters = input.value;
      sound.playTileClick();
      renderRackShelf();
      updateUrlParams();
      performSolve();
    } else if (e.key === 'Enter') {
      performSolve();
    } else if (e.key === 'Escape') {
      DOM.clearRackBtn.click();
    }
  });

  DOM.rackInput.addEventListener('input', () => {
    state.rackLetters = DOM.rackInput.value.toUpperCase();
    sound.playTileClick();
    renderRackShelf();
    updateUrlParams();
    performSolve();
  });

  DOM.clearRackBtn.addEventListener('click', () => {
    state.rackLetters = '';
    DOM.rackInput.value = '';
    DOM.rackInput.focus();
    sound.playTileClick();
    renderRackShelf();
    updateUrlParams();
    performSolve();
  });

  DOM.solveBtn.addEventListener('click', performSolve);

  // Advanced options toggle
  DOM.toggleOptionsBtn.addEventListener('click', () => {
    const isOpen = DOM.advancedPanel.classList.toggle('open');
    DOM.toggleOptionsBtn.classList.toggle('active', isOpen);
    sound.playTileClick();
  });

  // Filter changes
  DOM.filterDict.addEventListener('change', () => {
    switchDictionary(DOM.filterDict.value);
  });

  [
    DOM.filterSort,
    DOM.filterStartsWith,
    DOM.filterEndsWith,
    DOM.filterContains,
    DOM.filterExclude,
    DOM.filterMinLen,
    DOM.filterMaxLen,
    DOM.filterAllLetters
  ].forEach(elem => {
    elem.addEventListener('change', () => {
      updateActiveFiltersBadge();
      performSolve();
    });
    if (elem.tagName === 'INPUT' && elem.type === 'text') {
      elem.addEventListener('input', () => {
        updateActiveFiltersBadge();
        performSolve();
      });
    }
  });

  DOM.resetFiltersBtn.addEventListener('click', () => {
    DOM.filterStartsWith.value = '';
    DOM.filterEndsWith.value = '';
    DOM.filterContains.value = '';
    DOM.filterExclude.value = '';
    DOM.filterMinLen.value = '2';
    DOM.filterMaxLen.value = '15';
    DOM.filterAllLetters.checked = false;
    DOM.filterSort.value = 'length-desc';
    updateActiveFiltersBadge();
    sound.playTileClick();
    performSolve();
    showToast('Filters reset to default');
  });

  // Quick rack buttons
  DOM.shuffleRackBtn.addEventListener('click', () => {
    if (!state.rackLetters) return;
    const shuffled = state.rackLetters.split('').sort(() => Math.random() - 0.5).join('');
    state.rackLetters = shuffled;
    DOM.rackInput.value = shuffled;
    sound.playShuffle();
    renderRackShelf();
    updateUrlParams();
  });

  DOM.randomRackBtn.addEventListener('click', () => {
    const randomHand = getRandomRack(7, state.gameType);
    state.rackLetters = randomHand;
    DOM.rackInput.value = randomHand;
    sound.playShuffle();
    renderRackShelf();
    updateUrlParams();
    performSolve();
    showToast(`Drawn 7 tiles: ${randomHand}`);
  });

  // Copy All Results
  DOM.copyAllBtn.addEventListener('click', () => {
    if (state.lastSolvedWords.length === 0) return;
    const wordsList = state.lastSolvedWords.map(w => w.word).join(', ');
    navigator.clipboard.writeText(wordsList);
    showToast(`Copied ${state.lastSolvedWords.length} words to clipboard!`);
    sound.playTileClick();
  });

  // Export Results as CSV
  DOM.exportCsvBtn.addEventListener('click', () => {
    if (state.lastSolvedWords.length === 0) return;
    let csv = 'Word,Length,Scrabble_Points,WWF_Points\n';
    for (const w of state.lastSolvedWords) {
      csv += `"${w.word}",${w.length},${w.scrabbleScore},${w.wwfScore}\n`;
    }
    downloadFile(csv, `anagrams_${state.rackLetters || 'solved'}.csv`, 'text/csv');
    showToast('Downloaded CSV export');
  });

  // Multi-Word solver
  DOM.multiSolveBtn.addEventListener('click', performMultiSolve);
  DOM.multiInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') performMultiSolve();
  });

  // Pattern solver
  DOM.patternSolveBtn.addEventListener('click', performPatternSolve);
  DOM.patternInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') performPatternSolve();
  });

  // 2-Letter sheet controls
  DOM.twoLetterSearch.addEventListener('input', () => {
    renderTwoLetterWords('alpha', DOM.twoLetterSearch.value);
  });
  DOM.sort2LetterAlpha.addEventListener('click', () => {
    DOM.sort2LetterAlpha.classList.add('active');
    DOM.sort2LetterPoints.classList.remove('active');
    renderTwoLetterWords('alpha', DOM.twoLetterSearch.value);
    sound.playTileClick();
  });
  DOM.sort2LetterPoints.addEventListener('click', () => {
    DOM.sort2LetterPoints.classList.add('active');
    DOM.sort2LetterAlpha.classList.remove('active');
    renderTwoLetterWords('points', DOM.twoLetterSearch.value);
    sound.playTileClick();
  });

  // Modal close handlers
  DOM.modalCloseBtn.addEventListener('click', closeDefinitionModal);
  DOM.definitionModal.addEventListener('click', (e) => {
    if (e.target === DOM.definitionModal) closeDefinitionModal();
  });

  // FAQ Accordion Listeners
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      if (item) {
        const wasActive = item.classList.contains('active');
        // Toggle current item
        item.classList.toggle('active', !wasActive);
        sound.playTileClick();
      }
    });
  });

  // Footer Back to Top Button
  const footerTopBtn = document.getElementById('footer-top-btn');
  if (footerTopBtn) {
    footerTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      DOM.rackInput.focus();
    });
  }

  // Global keydown shortcuts
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      DOM.rackInput.focus();
    }
    if (e.key === 'Escape') {
      if (DOM.definitionModal.classList.contains('open')) {
        closeDefinitionModal();
      } else if (DOM.savedDrawer.classList.contains('open')) {
        closeSavedDrawer();
      }
    }
  });
}

function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// App Initialization
async function initApp() {
  initDOMElements();
  applyTheme(state.theme);
  updateSoundIcons();
  updateSavedBadge();
  bindEventListeners();

  try {
    // Load default dictionary (ENABLE1)
    state.dictionaryRecords = await loadDictionary(state.currentDictId);
    readUrlParams();
  } catch (err) {
    console.error('Initial dictionary load error:', err);
    showToast('Error loading dictionary lexicon', 'error');
  }
}

// Launch on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
