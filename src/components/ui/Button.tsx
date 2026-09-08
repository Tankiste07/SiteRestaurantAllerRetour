import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'outline' | 'ghost' | 'dark';
type Size = 'sm' | 'md' | 'lg';

const BASE =
  'group/btn inline-flex items-center justify-center gap-2.5 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.22em] ' +
  'transition-[background-color,color,border-color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ' +
  'disabled:pointer-events-none disabled:opacity-40';

/*
 * `vin` est une couleur de marque fixe (identique dans les deux thèmes) :
 * un survol qui bascule sur ce fond rouge doit toujours afficher un texte
 * clair littéral (`#f4ede2`), jamais le jeton `creme`, qui lui s'inverse
 * en texte foncé sous le thème clair et deviendrait illisible sur du rouge.
 */
const VARIANTS: Record<Variant, string> = {
  /* Aplat crème qui bascule dans le rouge du vin au survol. */
  primary: 'bg-creme text-noir hover:bg-vin hover:text-[#f4ede2]',
  /* Filet doré, fond transparent — pour les actions secondaires sur photo. */
  outline: 'border border-or/45 text-creme hover:border-or hover:bg-or/10',
  /* Sans fond ni bordure, souligné au survol. */
  ghost: 'text-creme hover:text-or-clair',
  /* Sur fond clair. */
  dark: 'bg-noir text-creme hover:bg-vin hover:text-[#f4ede2]',
};

const SIZES: Record<Size, string> = {
  sm: 'px-5 py-2.5',
  md: 'px-7 py-3.5',
  lg: 'px-9 py-4.5',
};

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Étire le bouton sur toute la largeur (utile sur mobile). */
  block?: boolean;
}

interface ButtonAsButton extends CommonProps {
  onClick?: () => void;
  type?: 'button' | 'submit';
  to?: never;
  href?: never;
  disabled?: boolean;
}

interface ButtonAsLink extends CommonProps {
  /** Navigation interne (React Router). */
  to: string;
  href?: never;
  onClick?: never;
}

interface ButtonAsAnchor extends CommonProps {
  /** Lien externe ou `tel:` / `mailto:`. */
  href: string;
  to?: never;
  /** Ouvre dans un nouvel onglet. */
  external?: boolean;
  onClick?: never;
}

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

/**
 * Bouton unique du site, décliné en variantes.
 * Rend un `<button>`, un `<Link>` ou un `<a>` selon les props reçues,
 * afin que la sémantique reste correcte pour les lecteurs d'écran.
 */
export function Button(props: ButtonProps) {
  const { children, variant = 'primary', size = 'md', className, block } = props;
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], block && 'w-full', className);

  if ('to' in props && props.to) {
    return (
      <Link to={props.to} className={classes}>
        {children}
      </Link>
    );
  }

  if ('href' in props && props.href) {
    const external = props.external ?? /^https?:/i.test(props.href);
    return (
      <a
        href={props.href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }

  const { onClick, type = 'button', disabled } = props as ButtonAsButton;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
