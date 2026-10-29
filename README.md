# AnagramSolver PRO 🎯

A modern, high-speed, and feature-rich alternative to online anagram solvers like TheWordFinder. Built with Vanilla CSS, modern JavaScript, and Vite for sub-10 millisecond word solving without ads or lag.

---

## 🚀 Key Advantages Over TheWordFinder

| Feature | TheWordFinder | AnagramSolver PRO |
|---|---|---|
| **Speed** | Slow server roundtrips (~800ms) | Instant client-side solving (< 5ms) |
| **User Interface** | Cluttered with intrusive ads, old Bootstrap | Sleek glassmorphism, 3D Scrabble tile visualizer |
| **Theme** | Fixed light theme with heavy contrast | Dual theme: Dark Luxury Obsidian & Crisp Light |
| **Interactive Tile Rack** | None (simple text input) | Realistic wooden/ivory tile shelf with point badges |
| **Sound FX** | None | Synthesized wooden tile clacks, shuffles, & chimes |
| **Multi-Word Anagrams** | Slow separate page | Instant multi-word solver tab in the same view |
| **Definitions** | Basic text or external links | Popover modal with phonetics, definitions, & TTS speech |
| **Game / Practice Mode** | Basic static jumble links | Interactive "Anagram Arena" with hints, streak, & confetti |
| **Wildcards & Blanks** | Generic matching | Wildcard letters highlighted in solved word cards |
| **Cheat Sheet** | External wiki pages | Searchable official 2-letter Scrabble & WWF cheat sheet |

---

## 📚 Lexicons & Dictionaries Supported

1. **Words With Friends (ENABLE1)** - 172,823 words (default standard for WWF and mobile word games).
2. **Scrabble US (TWL06)** - 83,667 words (North American tournament tournament lexicon).
3. **Scrabble UK / Collins (SOWPODS / CSW)** - 267,751 words (International Scrabble standard).
4. **Everyday Common English** - 20,000 words (Curated top conversational vocabulary).

---

## 🛠️ Features Breakdown

- **Physical 3D Tile Rack**: Type or click **Random Rack** to deal 7 authentic tiles from the bag.
- **Wildcard Blank Tile Support**: Press <kbd>Space</kbd> or type `?` or `*` to test blank tiles (wildcard letters are highlighted in results).
- **Dual Game Scoring**: View both **Scrabble** and **Words With Friends (WWF)** points for every word.
- **Advanced Filtering**:
  - Starts With (prefix)
  - Contains (substring)
  - Ends With (suffix)
  - Exclude Letters
  - Min / Max Word Length
  - "Must Use All Letters" (Pure Anagrams)
  - Custom Regex & Crossword Patterns (`C..T`)
- **Word Definitions & Pronunciation**: Click any word to see definitions, phonetics, audio pronunciation, and Merriam-Webster / Wiktionary links.
- **Multi-Word Anagrams**: Unscramble phrases like `CLINT EASTWOOD` &rarr; `OLD WEST ACTION`.
- **Anagram Arena**: Timed scrambled word challenge with hint system, score streaks, and victory confetti.
- **Favorites & Export**: Star words to save them locally, copy words with one click, or export to CSV.

---

## 🏃 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser:
# http://localhost:5173/
```

---

## 🔍 SEO Keyword Architecture & Hierarchy

All target keyword groups are naturally integrated across dedicated on-page zones:

| Keyword Group | High-Value Targets | On-Page Zone |
|---|---|---|
| **Group A: Core Head Terms** | `anagram solver`, `anagrams`, `wordfinder`, `word solver`, `wordsolver`, `anagram finder`, `anagram solver free`, `anagram generator` | Page Title, `<H1>`, Meta description, primary UI copy |
| **Group B: Long-Tail Questions** | `what words can i make with the following letters`, `words that can be made with the following letters`, `form a word with given letters`, `unscramble for me`, `look up words with letters` | "How It Works" 3-step section, FAQ accordion titles |
| **Group C: Feature Queries** | `find a word with missing letters`, `find a crossword word`, `7 letter word using these letters`, `six letter word with these letters`, `anagram solver multiple words` | Feature highlight cards, wildcard & length filter pills |
| **Group D: Informational & Regional** | `what is an anagram`, `anagram solver uk`, `wordsolver uk`, `the word finder` | Educational guide, comparative note, UK/US regional dictionary toggles |

The page includes complete **JSON-LD Schema Markup (`FAQPage` & `WebApplication`)** for enhanced Google search snippets.

