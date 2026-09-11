/**
 * LA CARTE — L'ALLER RETOUR
 * ---------------------------------------------------------------------------
 * ⚠️ FICHIER GÉNÉRÉ — ne pas modifier à la main.
 * Généré par le tableau de bord (`npm run dashboard`) à partir de
 * `server/database.json`. Toute modification directe sera écrasée à la
 * prochaine publication.
 */

export type {
  MenuCategoryId,
  PriceVariant,
  MenuOption,
  MenuTag,
  MenuItem,
  MenuCategory,
} from './menu.types';
import type { MenuItem, MenuCategory } from './menu.types';

/* -------------------------------------------------------------------------- */
/*  ENTRÉES                                                                   */
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
/*  LA VIANDE                                                                 */
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
      {
        label: '250 g',
        price: 28,
      },
      {
        label: '350 g',
        price: 36,
      },
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
    detail: 'Environ 1 kg',
    serves: 'Pour 2 personnes',
    price: 74,
    imageKey: 'coteDeBoeuf',
  },
  {
    id: 'faux-filet',
    name: 'Faux-Filet',
    detail: 'Grammage selon arrivage',
    serves: 'Pour 2 personnes',
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
/*  POUR LES NON-CARNIVORES                                                   */
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
/*  DESSERTS                                                                  */
/* -------------------------------------------------------------------------- */

export const desserts: MenuItem[] = [
  {
    id: 'assiette-de-fromage',
    name: 'Assiette de fromage',
    price: 9,
    options: [
      {
        label: 'Verre de vin en accord',
        price: 20,
      },
    ],
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
    tags: [
      'SANS GLUTEN',
    ],
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
