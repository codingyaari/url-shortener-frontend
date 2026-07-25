'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  resolvedTheme: 'light',
  setTheme: () => {},
  themes: ['light', 'dark'],
});

const STORAGE_KEY = 'theme-preference';

export function ThemeProvider({ children, defaultTheme = 'light', storageKey = STORAGE_KEY }) {
  const [theme, setThemeState] = useState(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === 'light' || stored === 'dark') {
        setThemeState(stored);
        document.documentElement.classList.toggle('dark', stored === 'dark');
      }
    } catch {
      // ignore
    }
  }, [storageKey]);

  const setTheme = useCallback(
    (next) => {
      const value = typeof next === 'function' ? next(theme) : next;
      setThemeState(value);
      try {
        localStorage.setItem(storageKey, value);
      } catch {
        // ignore
      }
      document.documentElement.classList.toggle('dark', value === 'dark');
    },
    [storageKey, theme]
  );

  const value = useMemo(
    () => ({
      theme: mounted ? theme : defaultTheme,
      resolvedTheme: mounted ? theme : defaultTheme,
      setTheme,
      themes: ['light', 'dark'],
    }),
    [theme, setTheme, mounted, defaultTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
