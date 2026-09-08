import type { ReactNode } from 'react';
import { CONTACT, RESERVATION_URL, RESERVATION_OPENS_NEW_TAB } from '@/data/site';
import { Button } from './ui/Button';

interface ReservationButtonProps {
  children?: ReactNode;
  variant?: 'primary' | 'outline' | 'ghost' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  block?: boolean;
}

/**
 * Bouton « Réserver », utilisé partout sur le site.
 *
 * Sa destination suit une cascade, sans jamais inventer d'URL :
 *   1. `RESERVATION_URL` (module de réservation) dès qu'elle est renseignée ;
 *   2. à défaut, un appel téléphonique si le numéro est connu ;
 *   3. à défaut, la page Contact.
 *
 * Il suffit donc de renseigner `RESERVATION_URL` dans `src/data/site.ts`
 * pour que tous les boutons du site pointent vers le bon service.
 */
export function ReservationButton({
  children = 'Réserver une table',
  variant = 'primary',
  size = 'md',
  className,
  block,
}: ReservationButtonProps) {
  if (RESERVATION_URL) {
    return (
      <Button
        href={RESERVATION_URL}
        external={RESERVATION_OPENS_NEW_TAB}
        variant={variant}
        size={size}
        className={className}
        block={block}
      >
        {children}
      </Button>
    );
  }

  if (CONTACT.phone) {
    return (
      <Button
        href={`tel:${CONTACT.phone}`}
        variant={variant}
        size={size}
        className={className}
        block={block}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button to="/contact" variant={variant} size={size} className={className} block={block}>
      {children}
    </Button>
  );
}
