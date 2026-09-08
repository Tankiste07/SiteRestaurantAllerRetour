import type { MenuItem } from '@/data/menu';
import { formatPrice } from '@/utils/format';
import { cn } from '@/utils/cn';

interface PriceProps {
  item: MenuItem;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: 'text-sm',
  md: 'text-base sm:text-[1.0625rem]',
  lg: 'text-lg sm:text-xl',
} as const;

/**
 * Affichage du prix d'un plat, dans tous les cas de figure prévus par la carte :
 * prix simple, prix au poids, plusieurs grammages, ou prix non communiqué.
 */
export function Price({ item, size = 'md', className }: PriceProps) {
  /* Prix non communiqué par le restaurant — aucun montant n'est inventé. */
  if (item.priceMissing) {
    return (
      <span
        className={cn(
          'font-sans text-xs tracking-[0.14em] text-cendre uppercase italic',
          className,
        )}
      >
        Prix à préciser
      </span>
    );
  }

  /* Plusieurs grammages : chaque format a son prix. */
  if (item.variants?.length) {
    return (
      <span className={cn('flex flex-col items-end gap-1', className)}>
        {item.variants.map((variant) => (
          <span key={variant.label} className="flex items-baseline gap-2.5 whitespace-nowrap">
            <span className="font-sans text-[0.6875rem] tracking-[0.16em] text-sable uppercase">
              {variant.label}
            </span>
            <span className={cn('tnum font-display text-or-clair', SIZES[size])}>
              {formatPrice(variant.price)}
            </span>
          </span>
        ))}
      </span>
    );
  }

  if (item.price === undefined) return null;

  return (
    <span className={cn('flex items-baseline gap-1.5 whitespace-nowrap', className)}>
      <span className={cn('tnum font-display text-or-clair', SIZES[size])}>
        {formatPrice(item.price)}
      </span>
      {item.priceUnit && (
        <span className="font-sans text-[0.6875rem] tracking-[0.12em] text-sable lowercase">
          {item.priceUnit}
        </span>
      )}
    </span>
  );
}
