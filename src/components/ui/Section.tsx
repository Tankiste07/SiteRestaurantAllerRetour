import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  /** Rythme vertical. `lg` pour les grandes respirations éditoriales. */
  spacing?: 'sm' | 'md' | 'lg';
  /** Ajoute la texture de grain (aplats sombres). */
  textured?: boolean;
  'aria-labelledby'?: string;
}

const SPACING = {
  sm: 'py-14 sm:py-16 md:py-20',
  md: 'py-20 sm:py-24 md:py-28',
  lg: 'py-24 sm:py-28 md:py-36',
} as const;

/** Enveloppe de section : garantit un rythme vertical homogène sur tout le site. */
export function Section({
  children,
  id,
  className,
  spacing = 'md',
  textured = false,
  ...rest
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn('relative', SPACING[spacing], textured && 'grain', className)}
      {...rest}
    >
      {children}
    </section>
  );
}
