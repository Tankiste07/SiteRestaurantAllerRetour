import type { MenuItem } from '@/data/menu';
import { cn } from '@/utils/cn';
import { formatPrice, joinDefined } from '@/utils/format';
import { Tag } from '../ui/Tag';
import { Price } from './Price';

interface MenuRowProps {
  item: MenuItem;
  className?: string;
}

/**
 * Une ligne de carte, dans la tradition typographique des menus imprimés :
 * intitulé à gauche, conduite pointillée, prix à droite.
 * Sur mobile, la conduite disparaît au profit d'une mise en page empilée
 * pour rester parfaitement lisible.
 */
export function MenuRow({ item, className }: MenuRowProps) {
  const meta = joinDefined([item.serves, item.detail]);

  return (
    <div className={cn('group border-b border-or/10 py-6 sm:py-7', className)}>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-2 sm:flex-nowrap">
        <h3 className="font-display text-[1.3125rem] leading-snug text-creme transition-colors duration-500 group-hover:text-or-clair sm:text-2xl">
          {item.name}
        </h3>

        {item.tags?.map((tag) => (
          <Tag key={tag} className="translate-y-[-1px]">
            {tag}
          </Tag>
        ))}

        <span aria-hidden="true" className="dot-leader hidden sm:block" />

        <Price item={item} size="md" className="ml-auto sm:ml-0" />
      </div>

      {item.description && (
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-sable">{item.description}</p>
      )}

      {meta && (
        <p className="mt-2 font-sans text-[0.6875rem] tracking-[0.18em] text-cendre uppercase">
          {meta}
        </p>
      )}

      {item.options?.map((option) => (
        <p
          key={option.label}
          className="mt-3 flex items-baseline gap-2 font-sans text-xs tracking-wide text-sable"
        >
          <span aria-hidden="true" className="text-or/60">
            +
          </span>
          {option.label}
          <span className="tnum text-or-clair">{formatPrice(option.price)}</span>
        </p>
      ))}
    </div>
  );
}
