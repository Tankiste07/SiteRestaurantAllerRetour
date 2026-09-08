import { useCallback, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'aller-retour-theme';
const DEFAULT_THEME: Theme = 'dark';

const THEME_COLOR: Record<Theme, string> = {
  dark: '#0A0908',
  light: '#F7F1E4',
};

function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : DEFAULT_THEME;
  } catch {
    // Stockage indisponible (navigation privée stricte, par exemple) : le
    // thème reste fonctionnel pour la session, simplement non mémorisé.
    return DEFAULT_THEME;
  }
}

function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
}

/**
 * Thème clair / sombre du site — sombre par défaut.
 * Le script bloquant dans `index.html` a déjà posé `data-theme` avant le
 * premier rendu ; ce hook prend ensuite le relais pour piloter le bouton
 * et mémoriser le choix.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document === 'undefined'
      ? DEFAULT_THEME
      : ((document.documentElement.dataset.theme as Theme | undefined) ?? readStoredTheme()),
  );

  useEffect(() => {
    applyTheme(theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Rien à faire : le thème reste appliqué pour la session en cours.
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggle } as const;
}
