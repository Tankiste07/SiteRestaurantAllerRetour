import type { MenuItem } from '@/data/menu';
import { IMAGES } from '@/data/images';
import { cn } from '@/utils/cn';
import { formatPrice, joinDefined } from '@/utils/format';
import { SmartImage } from '../ui/SmartImage';
import { Tag } from '../ui/Tag';
import { Price } from './Price';

interface MenuCardProps {
  item: MenuItem;
  /** Format d'image — `tall` pour la grille des viandes, `wide` pour les mises en avant. */
  ratio?: 'tall' | 'square' | 'wide';
  className?: string;
}

const RATIOS = {
  tall: 'aspect-[4/5]',
  square: 'aspect-square',
  wide: 'aspect-[16/10]',
} as const;

/**
 * Carte d'un plat : visuel, nom, précisions, prix.
 * Le survol reste discret — le filet passe à l'or, l'image respire
 * de quelques pour cent, rien de plus.
 */
export function MenuCard({ item, ratio = 'tall', className }: MenuCardProps) {
  const image = item.imageKey ? IMAGES[item.imageKey] : undefined;
  const meta = joinDefined([item.serves, item.detail]);

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col border border-or/12 bg-charbon/60',
        'transition-[border-color,background-color,transform] duration-600 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:border-or/35 hover:bg-charbon',
        className,
      )}
    >
      {image && (
        <div className={cn('relative overflow-hidden', RATIOS[ratio])}>
          <SmartImage
            image={image}
            className="h-full w-full"
            imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          />
          {/* Fondu vers le bas : la carte et l'image ne se coupent jamais net. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-charbon to-transparent" />

          {item.tags && item.tags.length > 0 && (
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className="font-display text-[1.375rem] leading-snug text-creme transition-colors duration-500 group-hover:text-or-clair sm:text-2xl">
          {item.name}
        </h3>

        {item.description && (
          <p className="mt-2.5 text-sm leading-relaxed text-sable">{item.description}</p>
        )}

        {meta && (
          <p className="mt-2.5 font-sans text-[0.6875rem] tracking-[0.18em] text-cendre uppercase">
            {meta}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <span
            aria-hidden="true"
            className="mb-1.5 h-px flex-1 bg-or/20 transition-colors duration-500 group-hover:bg-or/45"
          />
          <Price item={item} size="lg" />
        </div>

        {item.options?.map((option) => (
          <p
            key={option.label}
            className="mt-3 border-t border-or/10 pt-3 text-right font-sans text-xs tracking-wide text-sable"
          >
            + {option.label} —{' '}
            <span className="tnum text-or-clair">{formatPrice(option.price)}</span>
          </p>
        ))}
      </div>
    </article>
  );
}
