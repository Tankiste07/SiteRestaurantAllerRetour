/**
 * LA CARTE — L'ALLER RETOUR
 * ---------------------------------------------------------------------------
 * Source de vérité unique pour tous les plats du site.
 *
 * RÈGLE : ne contient QUE les informations communiquées par le restaurant.
 * Aucune description d'origine, de cuisson ou de préparation n'a été ajoutée.
 * Les champs absents sont volontairement absents.
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

/* -------------------------------------------------------------------------- */
/*  ENTRÉES                                                                    */
/* -------------------------------------------------------------------------- */

export const entrees: MenuItem[] = [
  {
    id: 'escargots-bourgogne',
    name: 'Escargots de Bourgogne',
    detail: '6 unités',
    price: 9,
    imageKey: 'escargots',
  },
  {
    id: 'boudins-bearnais',
    name: 'Boudins béarnais et ses pommes',
    price: 9,
    imageKey: 'boudin',
  },
  {
    id: 'pate-campagne',
    name: 'Pâté de campagne',
    price: 8,
    imageKey: 'pate',
  },
  {
    id: 'os-a-moelle',
    name: 'Os à moelle fendu',
    description: 'Pain grillé & fleur de sel',
    price: 8.5,
    imageKey: 'osAMoelle',
  },
  {
    id: 'burrata-roquette',
    name: 'Burrata & roquette',
    description: "Pousses d'épinard, tomates cerises",
    price: 9.5,
    imageKey: 'burrata',
  },
  {
    id: 'tartare-onglet-moelle',
    name: "Tartare d'onglet & moelle",
    price: 12,
    imageKey: 'tartareOnglet',
  },
];

/* -------------------------------------------------------------------------- */
/*  LA VIANDE                                                                  */
/* -------------------------------------------------------------------------- */

export const viandes: MenuItem[] = [
  {
    id: 'tartare-charolais',
    name: 'Tartare de Bœuf au couteau Charolais',
    price: 18,
    imageKey: 'tartareCharolais',
  },
  {
    id: 'onglet-irlandais',
    name: 'Onglet de Bœuf Irlandais',
    price: 19,
    imageKey: 'onglet',
  },
  {
    id: 'pave-angus',
    name: "Pavé d'Angus",
    price: 23,
    imageKey: 'paveAngus',
  },
  {
    id: 'noix-entrecote-argentine',
    name: "Noix d'entrecôte d'Argentine",
    variants: [
      { label: '250 g', price: 28 },
      { label: '350 g', price: 36 },
    ],
    imageKey: 'noixEntrecote',
  },
  {
    id: 'filet-de-boeuf',
    name: 'Filet de Bœuf',
    price: 25,
    imageKey: 'filet',
  },
  {
    id: 'cote-de-boeuf',
    name: 'Côte de Bœuf',
    serves: 'Pour 2 personnes',
    detail: 'Environ 1 kg',
    price: 74,
    imageKey: 'coteDeBoeuf',
  },
  {
    id: 'faux-filet',
    name: 'Faux-Filet',
    serves: 'Pour 2 personnes',
    detail: 'Grammage selon arrivage',
    price: 9,
    priceUnit: '/ 100 g',
    imageKey: 'fauxFilet',
  },
  {
    id: 'entrecote-de-veau',
    name: 'Entrecôte de Veau',
    price: 23,
    imageKey: 'entrecoteVeau',
  },
  {
    id: 'andouillette-aaaaa',
    name: 'Andouillette AAAAA',
    price: 18,
    imageKey: 'andouillette',
  },
];

/* -------------------------------------------------------------------------- */
/*  POUR LES NON-CARNIVORES                                                    */
/* -------------------------------------------------------------------------- */

export const nonCarnivores: MenuItem[] = [
  {
    id: 'salade-du-moment',
    name: 'La salade du moment',
    price: 14,
    imageKey: 'salade',
  },
];

/* -------------------------------------------------------------------------- */
/*  DESSERTS                                                                   */
/* -------------------------------------------------------------------------- */

export const desserts: MenuItem[] = [
  {
    id: 'assiette-de-fromage',
    name: 'Assiette de fromage',
    price: 9,
    options: [{ label: 'Verre de vin en accord', price: 20 }],
    imageKey: 'fromage',
  },
  {
    id: 'tarte-citron-meringuee',
    name: 'Tarte citron meringuée',
    price: 9,
    imageKey: 'tarteCitron',
  },
  {
    id: 'tarte-chocolat-noir',
    name: 'Tarte chocolat noir',
    price: 9,
    imageKey: 'tarteChocolat',
  },
  {
    id: 'moelleux-noisettes',
    name: 'Moelleux aux noisettes',
    description: 'Praliné amande',
    price: 10.5,
    tags: ['SANS GLUTEN'],
    imageKey: 'moelleux',
  },
];

/* -------------------------------------------------------------------------- */
/*  ASSEMBLAGE                                                                 */
/* -------------------------------------------------------------------------- */

export const menuCategories: MenuCategory[] = [
  {
    id: 'entrees',
    title: 'Entrées',
    eyebrow: 'Pour commencer',
    items: entrees,
  },
  {
    id: 'viandes',
    title: 'La Viande',
    eyebrow: 'Le cœur de la maison',
    items: viandes,
  },
  {
    id: 'non-carnivores',
    title: 'Pour les non-carnivores',
    eyebrow: 'Une alternative',
    items: nonCarnivores,
  },
  {
    id: 'desserts',
    title: 'Desserts',
    eyebrow: 'Pour finir',
    items: desserts,
  },
];

/** Tous les plats, toutes catégories confondues. */
export const allMenuItems: MenuItem[] = menuCategories.flatMap((c) => c.items);
