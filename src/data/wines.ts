/**
 * LA CAVE — L'ALLER RETOUR
 * ---------------------------------------------------------------------------
 * Le restaurant annonce PLUS DE 300 RÉFÉRENCES, de 32 € à 999 €.
 * La liste complète n'a pas encore été transmise : elle n'est donc PAS inventée.
 *
 * COMMENT INTÉGRER LA CAVE RÉELLE
 * -------------------------------
 * 1. Remplir le tableau `realWines` ci-dessous (ou importer un JSON /
 *    un export de tableur converti — la forme est identique).
 * 2. Passer `WINE_SOURCE` à `'real'`.
 * 3. C'est tout : le compteur de références, les filtres (type, région,
 *    appellation, domaine, millésime, cépage, prix) et les tris se
 *    reconstruisent automatiquement à partir des données présentes.
 *
 * Tous les champs sont optionnels : une bouteille dont on ne connaît que
 * le nom et le prix s'affiche proprement, sans champ vide ni « undefined ».
 * L'architecture supporte sans effort 300, 500 ou 2 000 références.
 */

import { demoWines } from './wines.demo';

export type WineColor = 'Rouge' | 'Blanc' | 'Rosé' | 'Champagne' | 'Effervescent' | 'Vin doux';

export interface Wine {
  /** Identifiant stable (numéro de cave, référence interne…). */
  id: string | number;
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
  /** Millésime. `'NM'` pour un champagne non millésimé. */
  vintage?: string | number;
  /** Contenance, ex. « 75 cl », « 150 cl ». */
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

/* -------------------------------------------------------------------------- */
/*  SOURCE DE DONNÉES                                                          */
/* -------------------------------------------------------------------------- */

/**
 * `'demo'` → jeu de démonstration FICTIF, uniquement destiné à visualiser
 *            l'expérience de navigation de la cave. Un bandeau explicite le
 *            signale à l'écran : aucune donnée n'est présentée comme réelle.
 * `'real'` → la vraie cave, à renseigner dans `realWines`.
 *
 * ⚠️ Basculer sur `'real'` dès réception de la liste des vins.
 */
export type WineSource = 'demo' | 'real';
export const WINE_SOURCE = 'demo' as WineSource;

/** TODO — La cave réelle du restaurant. À remplir dès réception de la liste. */
export const realWines: Wine[] = [];

export const wines: Wine[] = WINE_SOURCE === 'real' ? realWines : demoWines;

/** `true` lorsque les bouteilles affichées sont des données de démonstration. */
export const isDemoCellar = WINE_SOURCE === 'demo';

/** Nombre de références réellement présentes dans les données (jamais gonflé). */
export const wineCount = wines.length;
