import type { MenuItem } from '@/data/menu';
import { cn } from '@/utils/cn';
import { Reveal } from '../ui/Reveal';
import { MenuCard } from './MenuCard';

interface MenuGridProps {
  items: MenuItem[];
  columns?: 2 | 3;
  ratio?: 'tall' | 'square' | 'wide';
  className?: string;
}

const COLUMNS = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
} as const;

/** Grille de plats, avec apparition en cascade contenue (jamais plus de ~350 ms). */
export function MenuGrid({ items, columns = 3, ratio = 'tall', className }: MenuGridProps) {
  return (
    <ul className={cn('grid gap-5 sm:gap-6 lg:gap-8', COLUMNS[columns], className)}>
      {items.map((item, index) => (
        <Reveal
          key={item.id}
          as="li"
          delay={(index % columns) * 110}
          className="h-full"
        >
          <MenuCard item={item} ratio={ratio} />
        </Reveal>
      ))}
    </ul>
  );
}
