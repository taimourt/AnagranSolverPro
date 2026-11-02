// AnagramSolverHub - Internationalization (i18n) Engine & Language Switcher
import en from '../translations/en.json';
import es from '../translations/es.json';
import fr from '../translations/fr.json';
import de from '../translations/de.json';
import it from '../translations/it.json';
import pt from '../translations/pt.json';

export const SUPPORTED_LANGUAGES = {
  en: { code: 'en', name: 'English', native: 'English', flag: '🇺🇸', path: '/' },
  es: { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸', path: '/es/' },
  fr: { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷', path: '/fr/' },
  de: { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪', path: '/de/' },
  it: { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹', path: '/it/' },
  pt: { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹', path: '/pt/' }
};

const TRANSLATIONS = { en, es, fr, de, it, pt };

/**
 * Detect current page language from HTML lang attribute, URL pathname, or localStorage
 */
export function getCurrentLang() {
  const htmlLang = document.documentElement.getAttribute('lang');
  if (htmlLang && SUPPORTED_LANGUAGES[htmlLang]) {
    return htmlLang;
  }

  const path = window.location.pathname;
  for (const [code, info] of Object.entries(SUPPORTED_LANGUAGES)) {
    if (code !== 'en' && (path === `/${code}` || path.startsWith(`/${code}/`))) {
      return code;
    }
  }

  return 'en';
}

/**
 * Get translation dictionary for active language
 */
export function getTranslations(lang = getCurrentLang()) {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}

/**
 * Helper to retrieve nested translation key with parameter interpolation
 * Example: t('results.foundWords', { count: 42, time: 3 })
 */
export function t(keyPath, params = {}, lang = getCurrentLang()) {
  const dict = getTranslations(lang);
  const keys = keyPath.split('.');
  let val = dict;

  for (const k of keys) {
    if (val && typeof val === 'object' && k in val) {
      val = val[k];
    } else {
      // Fallback to English
      let fallback = TRANSLATIONS.en;
      for (const fk of keys) {
        if (fallback && typeof fallback === 'object' && fk in fallback) {
          fallback = fallback[fk];
        } else {
          return keyPath;
        }
      }
      val = fallback;
      break;
    }
  }

  if (typeof val === 'string') {
    return val.replace(/\{(\w+)\}/g, (_, placeholder) => {
      return params[placeholder] !== undefined ? params[placeholder] : `{${placeholder}}`;
    });
  }

  return val;
}

/**
 * Initialize Language Switcher Dropdown in Header
 */
export function initLanguageSwitcher() {
  const currentLang = getCurrentLang();
  const dropdown = document.getElementById('lang-selector-dropdown');
  const menuBtn = document.getElementById('lang-menu-btn');
  const menu = document.getElementById('lang-menu');
  const flagEl = document.getElementById('current-lang-flag');
  const codeEl = document.getElementById('current-lang-code');

  if (!dropdown || !menuBtn || !menu) return;

  const currentInfo = SUPPORTED_LANGUAGES[currentLang] || SUPPORTED_LANGUAGES.en;
  if (flagEl) flagEl.textContent = currentInfo.flag;
  if (codeEl) codeEl.textContent = currentInfo.code.toUpperCase();

  // Mark active option in dropdown
  const options = menu.querySelectorAll('.lang-option');
  options.forEach((opt) => {
    const optLang = opt.getAttribute('data-lang');
    if (optLang === currentLang) {
      opt.classList.add('active');
    } else {
      opt.classList.remove('active');
    }

    opt.addEventListener('click', (e) => {
      e.preventDefault();
      const targetLang = opt.getAttribute('data-lang');
      switchLanguage(targetLang);
    });
  });

  // Toggle menu open/close
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  function openMenu() {
    dropdown.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    dropdown.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dropdown.classList.contains('open')) {
      closeMenu();
      menuBtn.focus();
    }
  });
}

/**
 * Navigate to localized URL preserving active query parameters
 */
export function switchLanguage(targetLang) {
  if (!SUPPORTED_LANGUAGES[targetLang]) return;

  localStorage.setItem('asp_lang', targetLang);

  const targetPath = SUPPORTED_LANGUAGES[targetLang].path;
  const currentParams = window.location.search; // preserves ?q=... or ?dict=...
  const currentHash = window.location.hash;

  window.location.href = `${targetPath}${currentParams}${currentHash}`;
}
