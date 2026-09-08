import { useEffect, useRef } from 'react';

/**
 * Parallaxe verticale légère, calculée dans une frame d'animation et
 * appliquée en `transform` (donc composée par le GPU, sans reflow).
 * Neutralisée si l'utilisateur a demandé moins d'animations.
 */
export function useParallax<T extends HTMLElement>(strength = 0.22) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) return;

    // On mesure le parent, jamais l'élément déplacé : transformer l'élément
    // modifierait sa propre position et provoquerait une boucle de retour.
    const anchor = node.parentElement ?? node;
    let frame = 0;

    const update = () => {
      frame = 0;
      const { top, height } = anchor.getBoundingClientRect();
      // Hors écran : inutile de recalculer.
      if (top > window.innerHeight || top + height < 0) return;
      node.style.transform = `translate3d(0, ${Math.round(-top * strength)}px, 0)`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [strength]);

  return ref;
}
