import { useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { ImageAsset } from '@/data/images';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { SmartImage } from '../ui/SmartImage';

interface LightboxProps {
  images: ImageAsset[];
  /** Index affiché, ou `null` si la visionneuse est fermée. */
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/**
 * Visionneuse plein écran.
 * Pilotable entièrement au clavier (← → Échap) et refermable d'un geste
 * sur mobile grâce aux commandes placées en bas de l'écran.
 */
export function Lightbox({ images, index, onClose, onNavigate }: LightboxProps) {
  const open = index !== null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const count = images.length;

  useLockBodyScroll(open);

  const goPrev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + count) % count);
  }, [index, count, onNavigate]);

  const goNext = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % count);
  }, [index, count, onNavigate]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') goPrev();
      if (event.key === 'ArrowRight') goNext();
    };

    document.addEventListener('keydown', onKeyDown);
    closeRef.current?.focus();
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose, goPrev, goNext]);

  if (!open || index === null) return null;
  const image = images[index];
  if (!image) return null;

  return (
    // Figée en sombre : la visionneuse affiche des photos plein cadre,
    // quel que soit le thème du site.
    <div
      data-theme="dark"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} sur ${count} — ${image.alt}`}
      className="fixed inset-0 z-70 flex flex-col bg-noir/97 backdrop-blur-md motion-safe:animate-[ar-fade-in_0.3s_ease-out]"
    >
      {/* ---- Barre supérieure ---- */}
      <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <span className="tnum font-sans text-[0.6875rem] tracking-[0.22em] text-sable uppercase">
          {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Fermer la galerie"
          className="flex size-11 items-center justify-center text-ivoire transition-colors duration-300 hover:text-or-clair"
        >
          <X size={20} strokeWidth={1.3} />
        </button>
      </div>

      {/* ---- Image ---- */}
      <div className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-8">
        <figure className="flex h-full w-full max-w-5xl flex-col items-center justify-center">
          <SmartImage
            key={image.alt}
            image={image}
            priority
            fit="contain"
            className="h-full max-h-[70svh] w-full motion-safe:animate-[ar-fade-in_0.4s_ease-out]"
            sizes="100vw"
          />
          <figcaption className="mt-5 text-center text-sm text-sable">{image.alt}</figcaption>
        </figure>

        {/* Flèches latérales — écrans larges uniquement */}
        {count > 1 && (
          <>
            <NavArrow side="left" onClick={goPrev} />
            <NavArrow side="right" onClick={goNext} />
          </>
        )}
      </div>

      {/* ---- Commandes basses (mobile) ---- */}
      {count > 1 && (
        <div className="flex items-center justify-center gap-4 border-t border-or/12 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:hidden">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Photo précédente"
            className="flex size-13 items-center justify-center border border-or/25 text-ivoire transition-colors duration-300 hover:border-or/50"
          >
            <ChevronLeft size={20} strokeWidth={1.3} />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Photo suivante"
            className="flex size-13 items-center justify-center border border-or/25 text-ivoire transition-colors duration-300 hover:border-or/50"
          >
            <ChevronRight size={20} strokeWidth={1.3} />
          </button>
        </div>
      )}
    </div>
  );
}

function NavArrow({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? 'Photo précédente' : 'Photo suivante'}
      className={`absolute top-1/2 hidden size-14 -translate-y-1/2 items-center justify-center border border-or/20 text-ivoire transition-colors duration-300 hover:border-or/55 hover:text-or-clair sm:flex ${
        side === 'left' ? 'left-2 lg:left-6' : 'right-2 lg:right-6'
      }`}
    >
      <Icon size={22} strokeWidth={1.2} />
    </button>
  );
}
