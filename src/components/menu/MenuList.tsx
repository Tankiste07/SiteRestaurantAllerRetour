import type { MenuItem } from '@/data/menu';
import { cn } from '@/utils/cn';
import { Reveal } from '../ui/Reveal';
import { MenuRow } from './MenuRow';

interface MenuListProps {
  items: MenuItem[];
  /** Deux colonnes sur grand écran, comme une carte imprimée dépliée. */
  columns?: 1 | 2;
  className?: string;
}

export function MenuList({ items, columns = 1, className }: MenuListProps) {
  return (
    <ul
      className={cn(
        '[&>li:last-child>div]:border-b-0',
        columns === 2 && 'md:grid md:grid-cols-2 md:gap-x-14 lg:gap-x-20',
        className,
      )}
    >
      {items.map((item, index) => (
        <Reveal key={item.id} as="li" delay={Math.min(index, 5) * 70}>
          <MenuRow item={item} />
        </Reveal>
      ))}
    </ul>
  );
}
