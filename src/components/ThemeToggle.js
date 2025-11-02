'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && theme) {
      const htmlElement = document.documentElement;
      const bodyElement = document.body;
      
      if (theme === 'dark') {
        htmlElement.classList.add('dark');
        htmlElement.setAttribute('data-theme', 'dark');
        htmlElement.style.backgroundColor = '#000000';
        bodyElement.style.backgroundColor = '#000000';
      } else {
        htmlElement.classList.remove('dark');
        htmlElement.setAttribute('data-theme', 'light');
        htmlElement.style.backgroundColor = '#ffffff';
        bodyElement.style.backgroundColor = '#ffffff';
      }
    }
  }, [theme, mounted]);

  // Show button immediately with default icon to prevent layout shift
  const currentTheme = mounted ? (theme || 'light') : 'light';
  const isDark = currentTheme === 'dark';

  const handleToggle = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Force immediate update
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    if (newTheme === 'dark') {
      htmlElement.classList.add('dark');
      htmlElement.setAttribute('data-theme', 'dark');
      htmlElement.style.backgroundColor = '#000000';
      if (bodyElement) bodyElement.style.backgroundColor = '#000000';
    } else {
      htmlElement.classList.remove('dark');
      htmlElement.setAttribute('data-theme', 'light');
      htmlElement.style.backgroundColor = '#ffffff';
      if (bodyElement) bodyElement.style.backgroundColor = '#ffffff';
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="relative p-2 rounded-lg bg-white/70 dark:bg-black/50 backdrop-blur-lg border-2 border-indigo-500/20 dark:border-indigo-400/70 dark:shadow-[0_0_20px_rgba(129,140,248,0.6)] hover:scale-105 hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(129,140,248,0.9),0_0_60px_rgba(167,139,250,0.7)] dark:hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-300 min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <svg
          className="w-5 h-5 text-yellow-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}

