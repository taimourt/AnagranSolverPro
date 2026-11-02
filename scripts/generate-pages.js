// scripts/generate-pages.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const languages = ['es', 'fr', 'de', 'it', 'pt'];

function renderHtml(t, lang) {
  const isEn = lang === 'en';
  const canonicalUrl = isEn ? 'https://anagramsolverhub.com/' : `https://anagramsolverhub.com/${lang}/`;

  const langOptionsHtml = [
    { code: 'en', path: '/', flag: '🇺🇸', name: 'English', sub: 'English' },
    { code: 'es', path: '/es/', flag: '🇪🇸', name: 'Español', sub: 'Spanish' },
    { code: 'fr', path: '/fr/', flag: '🇫🇷', name: 'Français', sub: 'French' },
    { code: 'de', path: '/de/', flag: '🇩🇪', name: 'Deutsch', sub: 'German' },
    { code: 'it', path: '/it/', flag: '🇮🇹', name: 'Italiano', sub: 'Italian' },
    { code: 'pt', path: '/pt/', flag: '🇵🇹', name: 'Português', sub: 'Portuguese' }
  ].map(opt => `                <a href="${opt.path}" class="lang-option${opt.code === lang ? ' active' : ''}" data-lang="${opt.code}" role="menuitem">
                  <span class="option-flag">${opt.flag}</span>
                  <div class="option-details">
                    <span class="option-name">${opt.name}</span>
                    <span class="option-sub">${opt.sub}</span>
                  </div>
                  <svg class="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </a>`).join('\n');

  return `<!doctype html>
<html lang="${t.lang}" data-theme="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${t.meta.title}</title>
    <meta name="description" content="${t.meta.description}" />
    <meta name="keywords" content="${t.meta.keywords}" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%23f59e0b'/><text x='50' y='68' font-family='sans-serif' font-size='60' font-weight='bold' text-anchor='middle' fill='%2378350f'>A</text></svg>" />
    <link rel="canonical" href="${canonicalUrl}" />
    <link rel="alternate" hreflang="x-default" href="https://anagramsolverhub.com/" />
    <link rel="alternate" hreflang="en" href="https://anagramsolverhub.com/" />
    <link rel="alternate" hreflang="es" href="https://anagramsolverhub.com/es/" />
    <link rel="alternate" hreflang="fr" href="https://anagramsolverhub.com/fr/" />
    <link rel="alternate" hreflang="de" href="https://anagramsolverhub.com/de/" />
    <link rel="alternate" hreflang="it" href="https://anagramsolverhub.com/it/" />
    <link rel="alternate" hreflang="pt" href="https://anagramsolverhub.com/pt/" />
    <link rel="stylesheet" href="/src/style.css" />

    <!-- Schema.org Structured Data: FAQPage & WebApplication -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          "name": "AnagramSolverHub",
          "url": "${canonicalUrl}",
          "applicationCategory": "GameApplication, ReferenceApplication",
          "operatingSystem": "All",
          "description": "${t.meta.description}",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "${t.faq.q1}",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "${t.faq.a1.replace(/"/g, '\\"')}"
              }
            },
            {
              "@type": "Question",
              "name": "${t.faq.q2}",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "${t.faq.a2.replace(/"/g, '\\"')}"
              }
            },
            {
              "@type": "Question",
              "name": "${t.faq.q3}",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "${t.faq.a3.replace(/"/g, '\\"')}"
              }
            },
            {
              "@type": "Question",
              "name": "${t.faq.q4}",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "${t.faq.a4.replace(/"/g, '\\"')}"
              }
            },
            {
              "@type": "Question",
              "name": "${t.faq.q5}",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "${t.faq.a5.replace(/"/g, '\\"')}"
              }
            },
            {
              "@type": "Question",
              "name": "${t.faq.q6}",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "${t.faq.a6.replace(/"/g, '\\"')}"
              }
            },
            {
              "@type": "Question",
              "name": "${t.faq.q7}",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "${t.faq.a7.replace(/"/g, '\\"')}"
              }
            },
            {
              "@type": "Question",
              "name": "${t.faq.q8}",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "${t.faq.a8.replace(/"/g, '\\"')}"
              }
            },
            {
              "@type": "Question",
              "name": "${t.faq.q9}",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "${t.faq.a9.replace(/"/g, '\\"')}"
              }
            }
          ]
        }
      ]
    }
    </script>
  </head>
  <body>
    <!-- Canvas for Celebratory Confetti -->
    <canvas id="confetti-canvas"></canvas>

    <div class="app-container">
      <!-- Header -->
      <header class="app-header">
        <div class="header-content">
          <div class="brand-wrapper" id="brand-home-btn" title="Reset to Home">
            <div class="brand-tiles">
              <div class="brand-mini-tile">A</div>
              <div class="brand-mini-tile">S</div>
              <div class="brand-mini-tile">H</div>
            </div>
            <div class="brand-text">
              <h1>AnagramSolver <span class="hub-badge">HUB</span></h1>
            </div>
          </div>

          <!-- Main Navigation Tabs -->
          <nav class="nav-tabs" role="tablist">
            <button class="tab-btn active" id="tab-btn-single" data-tab="single" role="tab" aria-selected="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/></svg>
              <span>${t.nav.anagrams}</span>
            </button>
            <button class="tab-btn" id="tab-btn-multi" data-tab="multi" role="tab" aria-selected="false">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19.5 12.572 12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572Z"/><path d="M12 6v14"/></svg>
              <span>${t.nav.multiWord}</span>
            </button>
            <button class="tab-btn" id="tab-btn-pattern" data-tab="pattern" role="tab" aria-selected="false">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>
              <span>${t.nav.pattern}</span>
            </button>
            <button class="tab-btn" id="tab-btn-game" data-tab="game" role="tab" aria-selected="false">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <span>${t.nav.arena}</span>
              <span class="tab-badge">${t.nav.playBadge}</span>
            </button>
            <button class="tab-btn" id="tab-btn-two-letters" data-tab="two-letters" role="tab" aria-selected="false">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
              <span>${t.nav.twoLetters}</span>
            </button>
          </nav>

          <!-- Utilities -->
          <div class="header-actions">
            <!-- Language Selector Dropdown -->
            <div class="lang-selector-dropdown" id="lang-selector-dropdown">
              <button class="lang-selector-btn" id="lang-menu-btn" aria-haspopup="true" aria-expanded="false" title="Switch Language" aria-label="Switch Language">
                <span class="lang-flag" id="current-lang-flag">${t.flag}</span>
                <span class="lang-code" id="current-lang-code">${t.lang.toUpperCase()}</span>
                <svg class="dropdown-caret" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div class="lang-menu" id="lang-menu" role="menu">
${langOptionsHtml}
              </div>
            </div>

            <!-- Sound FX Toggle -->
            <button class="icon-btn" id="sound-toggle-btn" title="Toggle Sound FX" aria-label="Toggle Sound FX">
              <svg id="sound-icon-on" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
              <svg id="sound-icon-off" class="hidden" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
            </button>

            <!-- Theme Toggle -->
            <button class="icon-btn" id="theme-toggle-btn" title="Toggle Light/Dark Theme" aria-label="Toggle Theme">
              <svg id="theme-icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              <svg id="theme-icon-moon" class="hidden" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            </button>

            <!-- Saved Words Drawer Button -->
            <button class="icon-btn" id="saved-words-btn" title="Saved Words" aria-label="Saved Words">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span class="btn-badge" id="saved-badge">0</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content Container -->
      <main id="main-content">
        <!-- TAB 1: Single-Word Anagram Solver -->
        <section id="tab-content-single" class="tab-pane active">
          <!-- Hero Banner -->
          <div class="hero-section">
            <h1 class="hero-title">${t.hero.title}</h1>
            <p class="hero-subtitle">
              ${t.hero.subtitle}
            </p>
          </div>

          <!-- Interactive Search Card -->
          <div class="search-card">
            <!-- 3D Interactive Tile Rack Visualizer -->
            <div class="tile-rack-container">
              <div class="tile-rack-shelf" id="rack-shelf" title="Click any tile to remove it from the rack">
                <span class="rack-placeholder" id="rack-placeholder">${t.search.rackPlaceholder}</span>
              </div>
            </div>

            <!-- Main Input & Solve Bar -->
            <div class="search-input-group">
              <div class="input-wrapper">
                <input
                  type="text"
                  id="rack-input"
                  class="main-input"
                  placeholder="${t.search.inputPlaceholder}"
                  autocomplete="off"
                  autocorrect="off"
                  autocapitalize="characters"
                  spellcheck="false"
                  maxlength="20"
                />
                <button class="clear-input-btn" id="clear-rack-btn" title="${t.search.clearBtn}" aria-label="${t.search.clearBtn}" style="display:none;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>

              <!-- Solve Button -->
              <button class="btn-primary" id="solve-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <span>${t.search.solveBtn}</span>
              </button>

              <!-- Advanced Options Toggle -->
              <button class="btn-secondary" id="toggle-options-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="1" x2="7" y1="14" y2="14"/><line x1="9" x2="15" y1="8" y2="8"/><line x1="17" x2="23" y1="16" y2="16"/></svg>
                <span>${t.search.filtersBtn}</span>
                <span class="btn-badge" id="active-filters-badge" style="display:none;">0</span>
              </button>
            </div>

            <!-- Quick Rack Actions & Tips -->
            <div class="quick-rack-controls">
              <div class="tip-text">
                <span>${t.search.tip}</span>
              </div>
              <div class="rack-btns">
                <button class="btn-chip" id="shuffle-rack-btn" title="Shuffle rack order">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/></svg>
                  <span>${t.search.shuffleBtn}</span>
                </button>
                <button class="btn-chip" id="random-rack-btn" title="Deal 7 random tiles from official tile bag">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="8" cy="8" r="1.5"/><circle cx="16" cy="16" r="1.5"/><circle cx="12" cy="12" r="1.5"/></svg>
                  <span>${t.search.randomRackBtn}</span>
                </button>
              </div>
            </div>

            <!-- Advanced Options Drawer -->
            <div class="advanced-panel" id="advanced-panel">
              <div class="filter-grid">
                <!-- Dictionary Selection -->
                <div class="filter-field">
                  <label for="filter-dict">${t.filters.lexiconLabel}</label>
                  <select id="filter-dict" class="field-select">
                    <option value="enable1" selected>${t.dictOptions.enable1}</option>
                    <option value="twl06">${t.dictOptions.twl06}</option>
                    <option value="sowpods">${t.dictOptions.sowpods}</option>
                    <option value="common">${t.dictOptions.common}</option>
                  </select>
                </div>

                <!-- Sort Order -->
                <div class="filter-field">
                  <label for="filter-sort">${t.filters.sortLabel}</label>
                  <select id="filter-sort" class="field-select">
                    <option value="length-desc" selected>${t.sortOptions.lengthDesc}</option>
                    <option value="scrabble">${t.sortOptions.scrabble}</option>
                    <option value="wwf">${t.sortOptions.wwf}</option>
                    <option value="length-asc">${t.sortOptions.lengthAsc}</option>
                    <option value="alpha">${t.sortOptions.alpha}</option>
                  </select>
                </div>

                <!-- Starts With -->
                <div class="filter-field">
                  <label for="filter-starts-with">${t.filters.startsWith}</label>
                  <input type="text" id="filter-starts-with" class="field-input" placeholder="e.g. RE" maxlength="10" />
                </div>

                <!-- Ends With -->
                <div class="filter-field">
                  <label for="filter-ends-with">${t.filters.endsWith}</label>
                  <input type="text" id="filter-ends-with" class="field-input" placeholder="e.g. ING" maxlength="10" />
                </div>

                <!-- Contains Substring -->
                <div class="filter-field">
                  <label for="filter-contains">${t.filters.contains}</label>
                  <input type="text" id="filter-contains" class="field-input" placeholder="e.g. ST" maxlength="10" />
                </div>

                <!-- Exclude Letters -->
                <div class="filter-field">
                  <label for="filter-exclude">${t.filters.exclude}</label>
                  <input type="text" id="filter-exclude" class="field-input" placeholder="e.g. X, Z" maxlength="15" />
                </div>

                <!-- Min Length -->
                <div class="filter-field">
                  <label for="filter-min-len">${t.filters.minLen}</label>
                  <select id="filter-min-len" class="field-select">
                    <option value="2" selected>2 Letters</option>
                    <option value="3">3 Letters</option>
                    <option value="4">4 Letters</option>
                    <option value="5">5 Letters</option>
                    <option value="6">6 Letters</option>
                    <option value="7">7 Letters</option>
                  </select>
                </div>

                <!-- Max Length -->
                <div class="filter-field">
                  <label for="filter-max-len">${t.filters.maxLen}</label>
                  <select id="filter-max-len" class="field-select">
                    <option value="15" selected>15 Letters (Board Max)</option>
                    <option value="12">12 Letters</option>
                    <option value="10">10 Letters</option>
                    <option value="8">8 Letters</option>
                    <option value="7">7 Letters</option>
                    <option value="6">6 Letters</option>
                  </select>
                </div>
              </div>

              <!-- Checkbox Toggles -->
              <div class="filter-toggles">
                <label class="toggle-item">
                  <input type="checkbox" id="filter-all-letters" />
                  <span>${t.filters.allLetters}</span>
                </label>
                <button class="btn-chip" id="reset-filters-btn">${t.filters.resetFilters}</button>
              </div>

              <!-- Regional Dictionary Notice -->
              <div class="regional-dict-note">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                <span>${t.filters.regionalNote}</span>
              </div>
            </div>
          </div>

          <!-- Results Section -->
          <div class="results-container" id="results-container">
            <!-- Toolbar Stats & Actions -->
            <div class="results-toolbar" id="results-toolbar" style="display:none;">
              <div class="results-summary">
                <span>Found <span class="stats-highlight" id="stat-word-count">0</span> words in <span class="time-badge" id="stat-time">0ms</span></span>
                <span class="kbd-badge" id="stat-dict-name">ENABLE1</span>
              </div>
              <div class="toolbar-actions">
                <button class="btn-chip" id="copy-all-btn" title="Copy all results to clipboard">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  <span>${t.results.copyAll}</span>
                </button>
                <button class="btn-chip" id="export-csv-btn" title="Download words as CSV">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                  <span>${t.results.exportCsv}</span>
                </button>
              </div>
            </div>

            <!-- Quick Length Pills -->
            <div class="length-filter-pills" id="length-pills" style="display:none;">
              <!-- Dynamically generated length pill chips -->
            </div>

            <!-- Groups Accordion Container -->
            <div id="results-groups">
              <!-- Empty State by default -->
              <div class="empty-state" id="initial-empty-state">
                <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 9 6 6"/><path d="m15 9-6 6"/></svg>
                <h3 class="empty-title">${t.results.emptyTitle}</h3>
                <p class="empty-desc">${t.results.emptyDesc}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- TAB 2: Multi-Word Anagram Solver -->
        <section id="tab-content-multi" class="tab-pane" style="display:none;">
          <div class="hero-section">
            <h2 class="hero-title">${t.multiWord.title}</h2>
            <p class="hero-subtitle">
              ${t.multiWord.subtitle}
            </p>
          </div>

          <div class="search-card">
            <div class="search-input-group">
              <div class="input-wrapper">
                <input
                  type="text"
                  id="multi-input"
                  class="main-input"
                  placeholder="${t.multiWord.placeholder}"
                  autocomplete="off"
                  spellcheck="false"
                  maxlength="25"
                />
              </div>
              <button class="btn-primary" id="multi-solve-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <span>${t.multiWord.solveBtn}</span>
              </button>
            </div>

            <div class="quick-rack-controls">
              <div class="tip-text">
                <span>${t.multiWord.tip}</span>
              </div>
              <div class="rack-btns">
                <select id="multi-max-words" class="field-select" style="height:34px; font-size:0.8rem;">
                  <option value="2" selected>Up to 2 Words</option>
                  <option value="3">Up to 3 Words</option>
                </select>
                <select id="multi-min-len" class="field-select" style="height:34px; font-size:0.8rem;">
                  <option value="3" selected>Min Word Length: 3</option>
                  <option value="4">Min Word Length: 4</option>
                </select>
              </div>
            </div>
          </div>

          <div class="results-container" id="multi-results-container">
            <div class="empty-state">
              <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              <h3 class="empty-title">${t.multiWord.emptyTitle}</h3>
              <p class="empty-desc">${t.multiWord.emptyDesc}</p>
            </div>
          </div>
        </section>

        <!-- TAB 3: Pattern / Crossword Helper -->
        <section id="tab-content-pattern" class="tab-pane" style="display:none;">
          <div class="hero-section">
            <h2 class="hero-title">${t.pattern.title}</h2>
            <p class="hero-subtitle">
              ${t.pattern.subtitle}
            </p>
          </div>

          <div class="search-card">
            <div class="search-input-group">
              <div class="input-wrapper">
                <input
                  type="text"
                  id="pattern-input"
                  class="main-input"
                  placeholder="${t.pattern.placeholder}"
                  autocomplete="off"
                  spellcheck="false"
                  maxlength="15"
                />
              </div>
              <button class="btn-primary" id="pattern-solve-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <span>${t.pattern.solveBtn}</span>
              </button>
            </div>

            <div class="quick-rack-controls">
              <div class="tip-text">
                <span>${t.pattern.tip}</span>
              </div>
              <div style="flex:1; max-width:280px;">
                <input type="text" id="pattern-rack-constraint" class="field-input" placeholder="${t.pattern.constraintPlaceholder}" style="height:36px;" />
              </div>
            </div>
          </div>

          <div class="results-container" id="pattern-results-container">
            <div class="empty-state">
              <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>
              <h3 class="empty-title">${t.pattern.emptyTitle}</h3>
              <p class="empty-desc">${t.pattern.emptyDesc}</p>
            </div>
          </div>
        </section>

        <!-- TAB 4: Anagram Arena Game Mode -->
        <section id="tab-content-game" class="tab-pane" style="display:none;">
          <div class="hero-section">
            <h2 class="hero-title">${t.arena.title}</h2>
            <p class="hero-subtitle">
              ${t.arena.subtitle}
            </p>
          </div>

          <div class="game-container">
            <!-- Game Stats Header -->
            <div class="game-header-card">
              <div class="game-stat">
                <span class="stat-label">${t.arena.difficulty}</span>
                <select id="game-difficulty-select" class="field-select" style="height:32px; font-weight:700;">
                  <option value="easy">Casual (4-5 letters)</option>
                  <option value="medium" selected>Standard (6-7 letters)</option>
                  <option value="hard">Master (8+ letters)</option>
                </select>
              </div>
              <div class="game-stat">
                <span class="stat-label">${t.arena.score}</span>
                <span class="stat-val" id="game-score-val">0</span>
              </div>
              <div class="game-stat">
                <span class="stat-label">${t.arena.streak}</span>
                <span class="stat-val" id="game-streak-val">🔥 0</span>
              </div>
              <div class="game-stat">
                <span class="stat-label">${t.arena.time}</span>
                <span class="stat-val" id="game-timer-val">0s</span>
              </div>
            </div>

            <!-- Game Board Card -->
            <div class="game-board-card">
              <!-- Target Guess Slots -->
              <div class="target-slots-wrap" id="game-guess-slots">
                <!-- Dynamically populated guess slots -->
              </div>

              <!-- Available Scrambled Tiles -->
              <div class="scrambled-tiles-rack" id="game-scrambled-rack">
                <!-- Dynamically populated tiles -->
              </div>

              <!-- Game Actions -->
              <div class="game-actions-bar">
                <button class="btn-secondary" id="game-clear-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  <span>${t.arena.clearBtn}</span>
                </button>
                <button class="btn-secondary" id="game-shuffle-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/></svg>
                  <span>${t.arena.shuffleBtn}</span>
                </button>
                <button class="btn-secondary" id="game-hint-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
                  <span>${t.arena.hintBtn} (<span id="game-hints-count">2</span>)</span>
                </button>
                <button class="btn-primary" id="game-next-btn">
                  <span>${t.arena.nextBtn}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>

              <!-- Hint Box -->
              <div class="hint-box" id="game-hint-box" style="display:none;">
                <!-- Populated with hint text -->
              </div>
            </div>
          </div>
        </section>

        <!-- TAB 5: 2-Letter Scrabble & WWF Cheat Sheet -->
        <section id="tab-content-two-letters" class="tab-pane" style="display:none;">
          <div class="hero-section">
            <h2 class="hero-title">${t.twoLetter.title}</h2>
            <p class="hero-subtitle">
              ${t.twoLetter.subtitle}
            </p>
          </div>

          <div class="search-card">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:1rem; flex-wrap:wrap;">
              <input type="text" id="two-letter-search" class="field-input" placeholder="${t.twoLetter.searchPlaceholder}" style="flex:1; max-width:400px;" />
              <div class="rack-btns">
                <button class="btn-chip active" id="sort-2letter-alpha">${t.twoLetter.sortAlpha}</button>
                <button class="btn-chip" id="sort-2letter-points">${t.twoLetter.sortPoints}</button>
              </div>
            </div>
          </div>

          <div class="word-grid" id="two-letter-grid" style="padding:0;">
            <!-- Dynamically populated 2-letter word cards -->
          </div>
        </section>
      </main>

      <!-- Structured SEO Sections: How It Works, Features, Educational Guide, & FAQ -->
      <section class="how-it-works-section" id="how-it-works">
        <div class="section-eyebrow">${t.howItWorks.eyebrow}</div>
        <h2 class="section-h2">${t.howItWorks.h2}</h2>
        <p class="section-lead">
          ${t.howItWorks.lead}
        </p>

        <div class="steps-grid">
          <!-- Step 1 -->
          <div class="step-card">
            <div class="step-badge">1</div>
            <h3 class="step-title">${t.howItWorks.step1Title}</h3>
            <p class="step-desc">
              ${t.howItWorks.step1Desc}
            </p>
          </div>

          <!-- Step 2 -->
          <div class="step-card">
            <div class="step-badge">2</div>
            <h3 class="step-title">${t.howItWorks.step2Title}</h3>
            <p class="step-desc">
              ${t.howItWorks.step2Desc}
            </p>
          </div>

          <!-- Step 3 -->
          <div class="step-card">
            <div class="step-badge">3</div>
            <h3 class="step-title">${t.howItWorks.step3Title}</h3>
            <p class="step-desc">
              ${t.howItWorks.step3Desc}
            </p>
          </div>
        </div>
      </section>

      <!-- Feature Highlights Section -->
      <section class="features-highlight-section" style="margin: 3.5rem 0 2rem 0;">
        <div class="section-eyebrow" style="text-align:center;">${t.features.eyebrow}</div>
        <h2 class="section-h2" style="text-align:center;">${t.features.h2}</h2>
        <p class="section-lead" style="text-align:center;">
          ${t.features.lead}
        </p>

        <div class="feature-cards-grid">
          <div class="feature-seo-card">
            <h4>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
              <span>${t.features.f1Title}</span>
            </h4>
            <p>
              ${t.features.f1Desc}
            </p>
          </div>

          <div class="feature-seo-card">
            <h4>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <span>${t.features.f2Title}</span>
            </h4>
            <p>
              ${t.features.f2Desc}
            </p>
          </div>

          <div class="feature-seo-card">
            <h4>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19.5 12.572 12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572Z"/><path d="M12 6v14"/></svg>
              <span>${t.features.f3Title}</span>
            </h4>
            <p>
              ${t.features.f3Desc}
            </p>
          </div>

          <div class="feature-seo-card">
            <h4>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <span>${t.features.f4Title}</span>
            </h4>
            <p>
              ${t.features.f4Desc}
            </p>
          </div>
        </div>
      </section>

      <!-- Educational Section: What is an Anagram? & Guide -->
      <section class="educational-guide-section" style="margin: 3.5rem 0 2rem 0; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); padding: 2.25rem 2rem;">
        <div class="section-eyebrow">${t.whatIsAnagram.eyebrow}</div>
        <h2 class="section-h2">${t.whatIsAnagram.h2}</h2>
        <div style="color: var(--text-secondary); font-size: 1rem; line-height: 1.7; display: flex; flex-direction: column; gap: 1rem;">
          <p>
            ${t.whatIsAnagram.p1}
          </p>
          <p>
            ${t.whatIsAnagram.p2}
          </p>
          <div style="background: var(--bg-elevated); border-left: 3px solid var(--primary); padding: 1rem 1.25rem; border-radius: var(--radius-sm); margin: 0.5rem 0;">
            <strong style="color: var(--text-primary); font-size: 1.05rem;">${t.whatIsAnagram.boxTitle}</strong>
            <p style="margin-top: 0.35rem; font-size: 0.95rem;">
              ${t.whatIsAnagram.boxDesc}
            </p>
          </div>
        </div>
      </section>

      <!-- FAQ Section (Long-Tail Questions & SEO Accordion) -->
      <section class="faq-section" id="faq">
        <div class="section-eyebrow" style="text-align:center;">${t.faq.eyebrow}</div>
        <h2 class="section-h2" style="text-align:center;">${t.faq.h2}</h2>
        <p class="section-lead" style="text-align:center;">
          ${t.faq.lead}
        </p>

        <div class="faq-list">
          <!-- FAQ 1 -->
          <div class="faq-item active">
            <button class="faq-question" type="button">
              <span>${t.faq.q1}</span>
              <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="faq-answer">
              <p>${t.faq.a1}</p>
            </div>
          </div>

          <!-- FAQ 2 -->
          <div class="faq-item">
            <button class="faq-question" type="button">
              <span>${t.faq.q2}</span>
              <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="faq-answer">
              <p>${t.faq.a2}</p>
            </div>
          </div>

          <!-- FAQ 3 -->
          <div class="faq-item">
            <button class="faq-question" type="button">
              <span>${t.faq.q3}</span>
              <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="faq-answer">
              <p>${t.faq.a3}</p>
            </div>
          </div>

          <!-- FAQ 4 -->
          <div class="faq-item">
            <button class="faq-question" type="button">
              <span>${t.faq.q4}</span>
              <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="faq-answer">
              <p>${t.faq.a4}</p>
            </div>
          </div>

          <!-- FAQ 5 -->
          <div class="faq-item">
            <button class="faq-question" type="button">
              <span>${t.faq.q5}</span>
              <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="faq-answer">
              <p>${t.faq.a5}</p>
            </div>
          </div>

          <!-- FAQ 6 -->
          <div class="faq-item">
            <button class="faq-question" type="button">
              <span>${t.faq.q6}</span>
              <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="faq-answer">
              <p>${t.faq.a6}</p>
            </div>
          </div>

          <!-- FAQ 7 -->
          <div class="faq-item">
            <button class="faq-question" type="button">
              <span>${t.faq.q7}</span>
              <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="faq-answer">
              <p>${t.faq.a7}</p>
            </div>
          </div>

          <!-- FAQ 8 -->
          <div class="faq-item">
            <button class="faq-question" type="button">
              <span>${t.faq.q8}</span>
              <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="faq-answer">
              <p>${t.faq.a8}</p>
            </div>
          </div>

          <!-- FAQ 9 -->
          <div class="faq-item">
            <button class="faq-question" type="button">
              <span>${t.faq.q9}</span>
              <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="faq-answer">
              <p>${t.faq.a9}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer Section -->
      <footer class="seo-guide-section" style="margin-top:4rem; border-top:1px solid var(--border-subtle); padding-top:2.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem;">
          <div>
            <h4 style="font-family:var(--font-heading); font-size:1.15rem; color:var(--text-primary); margin-bottom:0.25rem;">
              ${t.footer.title}
            </h4>
            <p style="color:var(--text-muted); font-size:0.85rem;">
              ${t.footer.subtitle}
            </p>
          </div>
          <div style="display:flex; gap:1.25rem; font-size:0.85rem; flex-wrap:wrap;">
            <a href="#how-it-works" style="color:var(--text-accent); text-decoration:none;">${t.footer.howItWorks}</a>
            <a href="#faq" style="color:var(--text-accent); text-decoration:none;">${t.footer.faq}</a>
            <a href="#" id="footer-top-btn" style="color:var(--text-accent); text-decoration:none;">${t.footer.backToTop}</a>
          </div>
        </div>

        <!-- Legal Navigation Links -->
        <div class="footer-legal-links">
          <a href="/privacy.html" class="footer-legal-link">${t.footer.privacy}</a>
          <span style="color:var(--border-subtle);">&bull;</span>
          <a href="/terms.html" class="footer-legal-link">${t.footer.terms}</a>
          <span style="color:var(--border-subtle);">&bull;</span>
          <a href="/disclaimer.html" class="footer-legal-link">${t.footer.disclaimer}</a>
          <span style="color:var(--border-subtle);">&bull;</span>
          <a href="/cookies.html" class="footer-legal-link">${t.footer.cookies}</a>
        </div>

        <div style="text-align:center; color:var(--text-muted); font-size:0.8rem; padding-top:1rem; border-top:1px solid var(--border-subtle); line-height:1.6;">
          <p>
            ${t.footer.disclaimerNotice}
          </p>
          <p style="margin-top:0.4rem;">
            ${t.footer.copyright}
          </p>
        </div>
      </footer>
    </div>

    <!-- Definition & Word Details Popover Modal -->
    <div class="modal-overlay" id="definition-modal" role="dialog" aria-modal="true">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <span class="modal-word" id="modal-word-text">WORD</span>
            <span class="modal-phonetic" id="modal-phonetic-text"></span>
          </div>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <button class="icon-btn" id="modal-pronounce-btn" title="${t.modals.pronounce}" aria-label="${t.modals.pronounce}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            </button>
            <button class="icon-btn" id="modal-close-btn" title="${t.modals.close}" aria-label="${t.modals.close}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </div>

        <div class="modal-body" id="modal-body-content">
          <!-- Point Breakdown Section -->
          <div class="breakdown-section">
            <div class="breakdown-title">${t.modals.tileBreakdown}</div>
            <div class="breakdown-tiles" id="modal-score-tiles">
              <!-- Dynamically populated tiles -->
            </div>
            <div style="display:flex; gap:1rem; margin-top:0.75rem; font-size:0.85rem; font-family:var(--font-mono);">
              <span>Scrabble: <strong id="modal-scrabble-total" style="color:var(--text-accent);">0 pts</strong></span>
              <span>Words With Friends: <strong id="modal-wwf-total" style="color:var(--accent-emerald);">0 pts</strong></span>
            </div>
          </div>

          <!-- Definitions List -->
          <div id="modal-definitions-list">
            <!-- Dynamically populated meanings -->
          </div>
        </div>

        <div class="modal-footer">
          <div class="external-links">
            <a href="#" target="_blank" rel="noopener noreferrer" class="ext-link" id="modal-merriam-link">
              <span>Merriam-Webster</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" class="ext-link" id="modal-wiktionary-link">
              <span>Wiktionary</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
            </a>
          </div>
          <button class="btn-chip" id="modal-save-word-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span id="modal-save-text">${t.modals.saveWord}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Saved Words Drawer Modal -->
    <div class="modal-overlay" id="saved-drawer" role="dialog" aria-modal="true">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <span class="modal-word">${t.modals.savedWordsTitle}</span>
            <span class="modal-phonetic" id="saved-count-text">(0 words)</span>
          </div>
          <button class="icon-btn" id="saved-close-btn" title="${t.modals.close}" aria-label="${t.modals.close}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div class="modal-body" id="saved-words-list">
          <!-- Dynamically populated saved words -->
        </div>

        <div class="modal-footer">
          <button class="btn-chip" id="clear-saved-btn">${t.modals.clearAll}</button>
          <button class="btn-chip" id="export-saved-btn">${t.modals.exportSaved}</button>
        </div>
      </div>
    </div>

    <!-- Toast Notification Container -->
    <div class="toast-container" id="toast-container"></div>

    <script type="module" src="/src/main.js"></script>
  </body>
</html>`;
}

// Generate files
for (const lang of languages) {
  const jsonPath = path.join(rootDir, 'translations', `${lang}.json`);
  const t = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const html = renderHtml(t, lang);
  const outDir = path.join(rootDir, lang);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outFile = path.join(outDir, 'index.html');
  fs.writeFileSync(outFile, html, 'utf-8');
  console.log(`Generated ${outFile} (${(html.length / 1024).toFixed(1)} KB)`);
}

console.log('All localized pages generated successfully!');
