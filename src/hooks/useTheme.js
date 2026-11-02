import { useCallback, useSyncExternalStore } from 'react';

// One shared theme for the whole app. Click the Dark/Light button and every component updates,
// because the choice is written on <html> as data-theme="dark" (and class="dark"), and saved in the browser.
const KEY = 'mq-theme';
const listeners = new Set();

function read() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch { /* storage can be blocked */ }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function apply(theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme; // makes scrollbars and form controls follow the theme too
}

let current = read();
apply(current); // runs as soon as the app loads, so there is no flash of the wrong theme

function setTheme(theme) {
  current = theme;
  apply(theme);
  try { localStorage.setItem(KEY, theme); } catch { /* ignore */ }
  listeners.forEach((l) => l());
}

const subscribe = (l) => { listeners.add(l); return () => listeners.delete(l); };

export default function useTheme() {
  const theme = useSyncExternalStore(subscribe, () => current, () => 'light');
  const toggle = useCallback(() => setTheme(current === 'dark' ? 'light' : 'dark'), []);
  return { theme, toggle, setTheme };
}