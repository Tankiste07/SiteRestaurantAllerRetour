/**
 * TYPES DE LA CARTE — L'ALLER RETOUR
 * ---------------------------------------------------------------------------
 * Fichier stable, jamais régénéré : `src/data/menu.ts` (les DONNÉES) est
 * généré par le tableau de bord et importe ces types.
 */

import type { ImageKey } from './images';

export type MenuCategoryId = 'entrees' | 'viandes' | 'non-carnivores' | 'desserts';

/** Un plat proposé en plusieurs grammages / formats. */
export interface PriceVariant {
  /** Ex. « 250 g » */
  label: string;
  price: number;
}

/** Supplément proposé avec un plat. */
export interface MenuOption {
  label: string;
  price: number;
}

export type MenuTag = 'SANS GLUTEN';

export interface MenuItem {
  id: string;
  name: string;
  /** Précision fournie par le restaurant (accompagnement, garniture…). */
  description?: string;
  /** Quantité ou grammage fourni (« 6 unités », « Environ 1 kg »…). */
  detail?: string;
  /** Nombre de couverts (« Pour 2 personnes »). */
  serves?: string;
  /** Prix unique, en euros. */
  price?: number;
  /** Unité affichée après le prix (« / 100 g »). */
  priceUnit?: string;
  /** Plusieurs grammages, plusieurs prix. */
  variants?: PriceVariant[];
  /** Suppléments (ex. accord mets-vin). */
  options?: MenuOption[];
  tags?: MenuTag[];
  /** Clé vers le registre d'images (`src/data/images.ts`). */
  imageKey?: ImageKey;
  /**
   * `true` lorsque le prix n'a PAS été communiqué.
   * L'interface affiche alors « Prix à préciser » — aucun prix n'est inventé.
   */
  priceMissing?: boolean;
}

export interface MenuCategory {
  id: MenuCategoryId;
  /** Titre affiché. */
  title: string;
  /** Sur-titre éditorial. */
  eyebrow: string;
  items: MenuItem[];
}
