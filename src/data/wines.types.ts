/**
 * TYPES DE LA CAVE — L'ALLER RETOUR
 * ---------------------------------------------------------------------------
 * Fichier stable, jamais régénéré : `src/data/wines.ts` (les DONNÉES) est
 * généré par le tableau de bord et importe ces types.
 */

export type WineColor = 'Rouge' | 'Blanc' | 'Rosé' | 'Champagne' | 'Effervescent' | 'Vin doux';

export interface Wine {
  /** Identifiant stable (numéro de cave, référence interne…). */
  id: string;
  /** Nom de la cuvée. */
  name?: string;
  /** Domaine, château, maison. */
  producer?: string;
  appellation?: string;
  region?: string;
  /** Couleur / famille du vin. */
  type?: WineColor;
  /** Cépage ou assemblage, ex. « Cabernet Sauvignon · Merlot ». */
  grape?: string;
  /** Millésime. `'NM'` pour un champagne non millésimé, ou un intervalle libre (« 2022/2023 »). */
  vintage?: string | number;
  /** Contenance, ex. « 75 cl », « Magnum (1,5 L) ». */
  volume?: string;
  /** Prix à la bouteille, en euros. */
  price?: number;
  /** Commentaire de dégustation, si le restaurant en fournit un. */
  description?: string;
  /** Servi au verre. */
  byTheGlass?: boolean;
  /** Nombre de bouteilles restantes, si la cave est suivie. */
  stock?: number;
}

export type WineCategoryId =
  | 'petillants'
  | 'champagne'
  | 'blancs-doux'
  | 'blancs'
  | 'macerations'
  | 'rose'
  | 'rouges';

/** Sous-section d'une catégorie (ex. « Loire », « Bourgogne » au sein des Blancs). */
export interface WineSubcategory {
  title: string;
  wines: Wine[];
}

/**
 * Catégorie de la carte. `wines` pour les catégories plates, `subcategories`
 * pour celles subdivisées (Vins Blancs, Vins rouges) — jamais les deux.
 */
export interface WineCategory {
  id: WineCategoryId;
  title: string;
  wines?: Wine[];
  subcategories?: WineSubcategory[];
}
