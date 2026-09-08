import { useEffect, useRef, useState } from 'react';

interface Options {
  /** Proportion visible déclenchant l'apparition. */
  threshold?: number;
  /** Marge autour du viewport (déclenche un peu avant l'entrée réelle). */
  rootMargin?: string;
  /** Ne déclenche qu'une seule fois (défaut). */
  once?: boolean;
}

/**
 * Détecte l'entrée d'un élément dans le viewport.
 * Utilisé pour les apparitions au défilement — un seul observateur par
 * élément, déconnecté dès qu'il a joué son rôle.
 */
export function useInView<T extends Element>({
  threshold = 0.15,
  rootMargin = '0px 0px -8% 0px',
  once = true,
}: Options = {}) {
  const ref = useRef<T | null>(null);
  // Sans IntersectionObserver (très anciens navigateurs), tout est visible
  // d'emblée : le contenu ne doit jamais rester masqué.
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView } as const;
}
