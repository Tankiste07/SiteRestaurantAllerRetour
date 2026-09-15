/**
 * ADRESSES PARTENAIRES — L'ALLER RETOUR
 * ---------------------------------------------------------------------------
 * Liens vers d'autres établissements, affichés sur la page d'accueil.
 *
 * COMMENT BRANCHER UNE ICÔNE
 * ---------------------------
 * 1. Déposer le fichier dans `src/assets/brand/`.
 * 2. L'importer en haut de ce fichier :
 *      import leBaravIcon from '@/assets/brand/le-barav.png';
 * 3. Renseigner `icon: leBaravIcon` sur l'entrée correspondante.
 *
 * Tant qu'aucune icône n'est fournie, un médaillon avec l'initiale du nom
 * s'affiche à la place — jamais d'image cassée.
 */

import leBaravIcon from '@/assets/brand/le-barav.png';
import lilotIcon from '@/assets/brand/lilot.png';

export interface PartnerSite {
  id: string;
  name: string;
  url: string;
  /** Laissé `undefined` tant que l'icône réelle n'est pas fournie. */
  icon?: string;
}

export const PARTNER_SITES: PartnerSite[] = [
  {
    id: 'le-barav',
    name: 'Le Barav',
    url: 'https://www.lebarav.fr/',
    icon: leBaravIcon,
  },
  {
    id: 'lilot',
    name: 'Lilot',
    url: 'https://lilot-restaurant.com/accueil/',
    icon: lilotIcon,
  },
];
