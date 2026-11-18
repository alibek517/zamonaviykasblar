import { useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

/**
 * Tizim sozlamasi + qo'lda dark/light rejim boshqaruvi
 */
export function useTheme(): {
  readonly theme: ThemeMode;
  readonly toggleTheme: () => void;
} {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme };
}
