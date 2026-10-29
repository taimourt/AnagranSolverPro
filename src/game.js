// Anagram Arena - Interactive Word Puzzle Game Mode
import { sound } from './sound.js';
import { fetchWordDefinition } from './definitions.js';

export class AnagramGame {
  constructor(dictionaryRecords, onStateChange) {
    this.dictionary = dictionaryRecords || [];
    this.onStateChange = onStateChange || (() => {});
    this.targetWord = '';
    this.scrambledLetters = [];
    this.currentGuess = [];
    this.availableTiles = [];
    this.difficulty = 'medium'; // 'easy' (4-5), 'medium' (6-7), 'hard' (8+)
    this.hintsUsed = 0;
    this.hintDefinition = '';
    this.score = 0;
    this.streak = 0;
    this.timer = 0;
    this.timerInterval = null;
    this.isSolved = false;
  }

  setDictionary(records) {
    this.dictionary = records || [];
  }

  startNewRound(difficulty = this.difficulty) {
    this.difficulty = difficulty;
    this.isSolved = false;
    this.currentGuess = [];
    this.hintsUsed = 0;
    this.hintDefinition = '';

    // Filter dictionary by difficulty
    let minLen = 6;
    let maxLen = 7;
    if (difficulty === 'easy') {
      minLen = 4;
      maxLen = 5;
    } else if (difficulty === 'hard') {
      minLen = 8;
      maxLen = 10;
    }

    const pool = this.dictionary.filter(item => item.len >= minLen && item.len <= maxLen);
    if (pool.length === 0) {
      this.targetWord = 'ANAGRAM';
    } else {
      const randItem = pool[Math.floor(Math.random() * pool.length)];
      this.targetWord = randItem.word;
    }

    // Shuffle letters ensuring scrambled != targetWord
    let letters = this.targetWord.split('');
    let tries = 0;
    do {
      letters = letters.sort(() => Math.random() - 0.5);
      tries++;
    } while (letters.join('') === this.targetWord && tries < 20);

    this.scrambledLetters = letters;
    this.availableTiles = letters.map((char, index) => ({
      id: `${char}_${index}_${Date.now()}`,
      char,
      used: false
    }));

    // Start timer
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timer = 0;
    this.timerInterval = setInterval(() => {
      this.timer++;
      this.notify();
    }, 1000);

    sound.playShuffle();
    this.notify();
  }

  // User clicks an available tile
  selectTile(tileId) {
    if (this.isSolved) return;
    const tile = this.availableTiles.find(t => t.id === tileId);
    if (!tile || tile.used) return;

    tile.used = true;
    this.currentGuess.push(tile);
    sound.playTileClick();
    this.checkAutoSolve();
    this.notify();
  }

  // User clicks a letter in the current guess to remove it
  removeGuessTile(index) {
    if (this.isSolved) return;
    if (index < 0 || index >= this.currentGuess.length) return;

    const [removed] = this.currentGuess.splice(index, 1);
    removed.used = false;
    sound.playTileClick();
    this.notify();
  }

  // Keyboard typing support
  typeCharacter(char) {
    if (this.isSolved) return;
    const upper = char.toUpperCase();
    if (upper === 'BACKSPACE') {
      if (this.currentGuess.length > 0) {
        this.removeGuessTile(this.currentGuess.length - 1);
      }
      return;
    }

    const candidate = this.availableTiles.find(t => !t.used && t.char === upper);
    if (candidate) {
      this.selectTile(candidate.id);
    }
  }

  clearGuess() {
    if (this.isSolved) return;
    this.availableTiles.forEach(t => t.used = false);
    this.currentGuess = [];
    sound.playTileClick();
    this.notify();
  }

  shuffleAvailable() {
    if (this.isSolved) return;
    const unused = this.availableTiles.filter(t => !t.used);
    const shuffled = unused.sort(() => Math.random() - 0.5);
    let uIdx = 0;
    this.availableTiles = this.availableTiles.map(t => {
      if (t.used) return t;
      return shuffled[uIdx++];
    });
    sound.playShuffle();
    this.notify();
  }

  async getHint() {
    if (this.isSolved) return;
    if (this.hintsUsed === 0) {
      this.hintsUsed = 1;
      const defData = await fetchWordDefinition(this.targetWord);
      if (defData && defData.meanings && defData.meanings[0]) {
        this.hintDefinition = defData.meanings[0].definitions[0]?.definition || 'A common English word.';
      } else {
        this.hintDefinition = `Starts with the letter "${this.targetWord[0]}"`;
      }
      sound.playTileClick();
      this.notify();
    } else if (this.hintsUsed === 1) {
      this.hintsUsed = 2;
      // Pre-fill the first letter
      this.clearGuess();
      const firstLetter = this.targetWord[0];
      const match = this.availableTiles.find(t => t.char === firstLetter && !t.used);
      if (match) {
        match.used = true;
        this.currentGuess.push(match);
      }
      sound.playTileClick();
      this.notify();
    }
  }

  checkAutoSolve() {
    if (this.currentGuess.length === this.targetWord.length) {
      const guessWord = this.currentGuess.map(t => t.char).join('');
      // Check if it matches target word or is a valid same-length anagram!
      const isExact = guessWord === this.targetWord;
      const isValidAnagram = this.dictionary.some(item => item.word === guessWord && item.len === this.targetWord.length);

      if (isExact || isValidAnagram) {
        this.handleSuccess(guessWord);
      } else {
        sound.playBuzzer();
      }
    }
  }

  handleSuccess(solvedWord) {
    this.isSolved = true;
    if (this.timerInterval) clearInterval(this.timerInterval);

    // Calculate score
    const basePoints = this.targetWord.length * 10;
    const timePenalty = Math.min(30, Math.floor(this.timer / 2));
    const hintPenalty = this.hintsUsed * 15;
    const roundScore = Math.max(10, basePoints - timePenalty - hintPenalty);

    this.score += roundScore;
    this.streak++;
    sound.playWin();

    // Trigger confetti
    this.triggerConfetti();
    this.notify();
  }

  triggerConfetti() {
    if (typeof window !== 'undefined') {
      const canvas = document.getElementById('confetti-canvas');
      if (canvas) {
        runCanvasConfetti(canvas);
      }
    }
  }

  notify() {
    this.onStateChange({
      targetWord: this.targetWord,
      scrambledLetters: this.scrambledLetters,
      availableTiles: this.availableTiles,
      currentGuess: this.currentGuess,
      difficulty: this.difficulty,
      hintsUsed: this.hintsUsed,
      hintDefinition: this.hintDefinition,
      score: this.score,
      streak: this.streak,
      timer: this.timer,
      isSolved: this.isSolved
    });
  }

  destroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }
}

// Lightweight zero-dependency 60fps canvas confetti explosion
function runCanvasConfetti(canvas) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width = window.innerWidth;
  const height = canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: width / 2,
      y: height / 2 + 50,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.8) * 18,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
      alpha: 1
    });
  }

  let animationFrame;
  function update() {
    ctx.clearRect(0, 0, width, height);
    let active = false;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.rotation += p.vRot;
      p.alpha -= 0.012;

      if (p.alpha > 0) {
        active = true;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    }

    if (active) {
      animationFrame = requestAnimationFrame(update);
    } else {
      ctx.clearRect(0, 0, width, height);
      cancelAnimationFrame(animationFrame);
    }
  }

  update();
}
