import type { ReactNode } from 'react';
import { EyebrowRule } from './Ornament';
import { Reveal } from './Reveal';
import { cn } from '@/utils/cn';

interface SectionTitleProps {
  /** Sur-titre en petites capitales dorées. */
  eyebrow?: string;
  title: ReactNode;
  /** Chapeau éditorial sous le titre. */
  intro?: ReactNode;
  align?: 'left' | 'center';
  /** Niveau de titre — à choisir selon la hiérarchie de la page. */
  as?: 'h1' | 'h2' | 'h3';
  /** Taille visuelle, indépendante du niveau sémantique. */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  id?: string;
  className?: string;
}

const SIZES = {
  sm: 'text-[clamp(1.75rem,4vw,2.25rem)]',
  md: 'text-[clamp(2.25rem,6vw,3.25rem)]',
  lg: 'text-[clamp(2.75rem,8vw,4.5rem)]',
  xl: 'text-[clamp(3rem,10vw,6rem)]',
} as const;

/**
 * Bloc de titre de section : sur-titre doré, titre serif, chapeau.
 * Garantit une hiérarchie typographique identique sur tout le site.
 */
export function SectionTitle({
  eyebrow,
  title,
  intro,
  align = 'left',
  as: Tag = 'h2',
  size = 'md',
  id,
  className,
}: SectionTitleProps) {
  const centered = align === 'center';

  return (
    <div className={cn(centered && 'flex flex-col items-center text-center', className)}>
      {eyebrow && (
        <Reveal variant="fade" className={cn('flex items-center gap-3', centered && 'justify-center')}>
          <EyebrowRule />
          <span className="eyebrow">{eyebrow}</span>
          {centered && <EyebrowRule />}
        </Reveal>
      )}

      <Reveal delay={eyebrow ? 90 : 0}>
        <Tag id={id} className={cn('mt-5 font-display', SIZES[size])}>
          {title}
        </Tag>
      </Reveal>

      {intro && (
        <Reveal delay={180}>
          <div
            className={cn(
              'mt-6 max-w-2xl text-[0.975rem] leading-[1.85] text-sable sm:text-base',
              centered && 'mx-auto',
            )}
          >
            {intro}
          </div>
        </Reveal>
      )}
    </div>
  );
}
