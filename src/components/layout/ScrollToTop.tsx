import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Ramène en haut de page à chaque navigation, sauf lorsqu'une ancre
 * est présente dans l'URL (les liens « #entrees » de la carte).
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  return null;
}
