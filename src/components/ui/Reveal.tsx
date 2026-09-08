import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useInView } from '@/hooks/useInView';

interface RevealProps {
  children: ReactNode;
  /** Sens de l'apparition. */
  variant?: 'up' | 'fade' | 'left' | 'right';
  /** Décalage en millisecondes — sert à cascader une grille. */
  delay?: number;
  className?: string;
  as?: ElementType;
  threshold?: number;
}

/**
 * Apparition au défilement.
 * L'animation est entièrement décrite en CSS (`[data-reveal]` dans index.css)
 * et neutralisée par `prefers-reduced-motion`.
 */
export function Reveal({
  children,
  variant = 'up',
  delay = 0,
  className,
  as,
  threshold,
}: RevealProps) {
  const Tag = (as ?? 'div') as ElementType;
  const { ref, inView } = useInView<HTMLElement>({ threshold });

  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      data-revealed={inView ? 'true' : undefined}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
