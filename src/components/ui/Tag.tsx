import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface TagProps {
  children: ReactNode;
  /** `gold` pour une distinction (Prestige), `neutral` pour une mention (Sans gluten). */
  tone?: 'neutral' | 'gold';
  className?: string;
}

/** Étiquette en petites capitales — mention diététique, distinction, format. */
export function Tag({ children, tone = 'neutral', className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center border px-2.5 py-1 font-sans text-[0.5625rem] font-medium tracking-[0.2em] uppercase backdrop-blur-sm',
        tone === 'gold'
          ? 'border-or/45 bg-noir/55 text-or-clair'
          : 'border-creme/25 bg-noir/55 text-ivoire',
        className,
      )}
    >
      {children}
    </span>
  );
}
