import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LANGUAGES, TRANSLATIONS } from '../i18n/translations.js';

const STORAGE_KEY = 'mq-lang';
const LanguageContext = createContext(null);

function readSaved() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && TRANSLATIONS[saved]) return saved;
  } catch { /* storage can be blocked, fall back to English */ }
  return 'en';
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readSaved);

  const setLang = useCallback((code) => {
    if (!TRANSLATIONS[code]) return;
    setLangState(code);
    try { localStorage.setItem(STORAGE_KEY, code); } catch { /* ignore */ }
  }, []);

  // keeps <html lang="mr"> in sync (fonts, screen readers, and the CSS tweaks in navbar.css)
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  // t('home.seeFare') -> text in the current language. Falls back to English, then to the key itself.
  const t = useCallback((key) => TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key, [lang]);

  const value = useMemo(() => ({ lang, setLang, t, languages: LANGUAGES }), [lang, setLang, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>');
  return ctx;
}