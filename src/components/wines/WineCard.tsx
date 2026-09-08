import type { Wine } from '@/data/wines';
import { cn } from '@/utils/cn';
import { formatPrice, joinDefined } from '@/utils/format';
import { isPrestige, wineTitle } from '@/utils/wine';
import { Tag } from '../ui/Tag';

interface WineCardProps {
  wine: Wine;
  className?: string;
}

/**
 * Fiche d'une bouteille.
 *
 *   DOMAINE
 *   Nom de la cuvée
 *   Appellation · Millésime
 *   75 cl                              75 €
 *
 * Chaque ligne disparaît si l'information n'est pas renseignée :
 * une bouteille dont on ne connaît que l'appellation et le prix
 * reste parfaitement présentable.
 */
export function WineCard({ wine, className }: WineCardProps) {
  const prestige = isPrestige(wine);
  const title = wineTitle(wine);
  /* Le titre reprend parfois l'appellation : on évite alors de la répéter. */
  const subtitle = joinDefined([wine.appellation === title ? null : wine.appellation, wine.vintage]);

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden border bg-charbon/45 p-6 sm:p-7',
        'transition-[border-color,background-color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:-translate-y-1 hover:bg-charbon',
        prestige ? 'border-or/32 hover:border-or/60' : 'border-or/12 hover:border-or/35',
        className,
      )}
    >
      {/* Filet supérieur qui se déploie au survol */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-or/70 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
      />

      {prestige && (
        <Tag tone="gold" className="absolute top-5 right-5">
          Prestige
        </Tag>
      )}

      {wine.producer && (
        <p
          className={cn(
            'pr-20 font-sans text-[0.625rem] font-medium tracking-[0.26em] uppercase',
            prestige ? 'text-or' : 'text-or/75',
          )}
        >
          {wine.producer}
        </p>
      )}

      <h3
        className={cn(
          'mt-3 font-display leading-snug text-creme transition-colors duration-500 group-hover:text-or-clair',
          prestige ? 'text-2xl sm:text-[1.6875rem]' : 'text-xl sm:text-[1.375rem]',
        )}
      >
        {title}
      </h3>

      {subtitle && <p className="mt-2 text-sm text-sable">{subtitle}</p>}

      {wine.region && (
        <p className="mt-1.5 font-sans text-[0.6875rem] tracking-[0.16em] text-cendre uppercase">
          {joinDefined([wine.region, wine.type])}
        </p>
      )}

      {wine.grape && <p className="mt-3 text-[0.8125rem] text-sable/85 italic">{wine.grape}</p>}

      {wine.description && (
        <p className="mt-3 text-[0.8125rem] leading-relaxed text-sable">{wine.description}</p>
      )}

      {/* ---- Pied de carte : contenance & prix ---- */}
      <div className="mt-auto flex items-end justify-between gap-4 pt-7">
        <span className="flex flex-col gap-1.5">
          {wine.volume && (
            <span className="font-sans text-[0.6875rem] tracking-[0.16em] text-cendre uppercase">
              {wine.volume}
            </span>
          )}
          {wine.byTheGlass && (
            <span className="font-sans text-[0.625rem] tracking-[0.18em] text-or/70 uppercase">
              Aussi au verre
            </span>
          )}
        </span>

        {wine.price !== undefined && (
          <span
            className={cn(
              'tnum font-display whitespace-nowrap text-or-clair',
              prestige ? 'text-[1.75rem] sm:text-3xl' : 'text-2xl',
            )}
          >
            {formatPrice(wine.price)}
          </span>
        )}
      </div>
    </article>
  );
}
