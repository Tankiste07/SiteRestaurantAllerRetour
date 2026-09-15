import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import logoBadge from '@/assets/brand/logo-badge.png';

interface LogoProps {
  /** Version resserrée pour l'en-tête après défilement. */
  compact?: boolean;
  /** Masque la ligne « Viandes & Vins ». */
  minimal?: boolean;
  className?: string;
  /** Rend un simple bloc au lieu d'un lien (utile dans le pied de page). */
  asText?: boolean;
  /** Taille du sceau. `lg` pour les emplacements de signature (pied de page). */
  badgeSize?: 'sm' | 'lg';
}

/**
 * Signature de la maison : le sceau (logo fourni) accompagné du nom en
 * serif très espacé, surmonté d'un filet, avec la spécialité en petites
 * capitales.
 */
export function Logo({
  compact = false,
  minimal = false,
  className,
  asText = false,
  badgeSize = 'sm',
}: LogoProps) {
  const content = (
    <span className="flex items-center gap-3">
      <img
        src={logoBadge}
        alt=""
        aria-hidden="true"
        className={cn(
          'shrink-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          badgeSize === 'lg' ? 'h-16 sm:h-20' : compact ? 'h-9 sm:h-10' : 'h-10 sm:h-11',
        )}
      />

      <span className="flex flex-col items-start leading-none">
        <span
          className={cn(
            'font-display uppercase text-creme transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
            compact
              ? 'text-[1.0625rem] tracking-[0.22em] sm:text-lg'
              : 'text-[1.1875rem] tracking-[0.24em] sm:text-xl md:text-[1.375rem]',
          )}
        >
          L'Aller Retour
        </span>
        {!minimal && (
          <span
            aria-hidden="true"
            className={cn(
              'mt-1.5 flex w-full items-center gap-2 transition-opacity duration-500',
              compact ? 'opacity-0 sm:opacity-100' : 'opacity-100',
            )}
          >
            <span className="font-sans text-[0.5rem] font-medium tracking-[0.34em] text-or/80 uppercase">
              Viandes &amp; Vins
            </span>
          </span>
        )}
      </span>
    </span>
  );

  if (asText) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link
      to="/"
      aria-label="L'Aller Retour — retour à l'accueil"
      className={cn('inline-block', className)}
    >
      {content}
    </Link>
  );
}
