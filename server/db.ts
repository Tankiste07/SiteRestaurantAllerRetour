/**
 * BASE DE DONNÉES DU TABLEAU DE BORD — L'ALLER RETOUR
 * ---------------------------------------------------------------------------
 * Stockage local (fichier JSON via lowdb) pour les images et la carte.
 * Sert de source de vérité éditable ; la publication régénère
 * `src/data/images.ts` et `src/data/menu.ts` à partir de cet état
 * (voir `codegen.ts`).
 *
 * Amorcée au premier lancement avec le contenu exact déjà présent sur le
 * site (aucune donnée n'est perdue ni inventée lors de la migration).
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSONFilePreset } from 'lowdb/node';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const SERVER_DIR = __dirname;
export const DB_PATH = path.join(__dirname, 'database.json');
export const PHOTOS_DIR = path.join(__dirname, '..', 'src', 'assets', 'photos');
export const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

/* -------------------------------------------------------------------------- */
/*  SCHÉMA                                                                     */
/* -------------------------------------------------------------------------- */

export type ImageTone = 'braise' | 'cave' | 'salle' | 'bois' | 'nappe';

export type ImageMotif =
  | 'steak'
  | 'cote'
  | 'tartare'
  | 'bouteille'
  | 'verre'
  | 'fromage'
  | 'dessert'
  | 'salade'
  | 'escargot'
  | 'os'
  | 'assiette'
  | 'salle'
  | 'flamme';

export const TONES: ImageTone[] = ['braise', 'cave', 'salle', 'bois', 'nappe'];
export const MOTIFS: ImageMotif[] = [
  'steak',
  'cote',
  'tartare',
  'bouteille',
  'verre',
  'fromage',
  'dessert',
  'salade',
  'escargot',
  'os',
  'assiette',
  'salle',
  'flamme',
];

export interface DbImage {
  /** Identifiant stable — clé exportée dans `IMAGES` (`src/data/images.ts`). */
  key: string;
  alt: string;
  tone: ImageTone;
  motif: ImageMotif;
  /** Nom de fichier dans `src/assets/photos/`, ou `null` sans photo réelle. */
  file: string | null;
  /**
   * Emplacement structurel (hero, galerie…) référencé ailleurs dans le code :
   * ne peut pas être supprimé depuis le tableau de bord, seulement modifié.
   */
  protected: boolean;
}

export type MenuCategoryId = 'entrees' | 'viandes' | 'non-carnivores' | 'desserts';

export interface DbPriceVariant {
  label: string;
  price: number;
}

export interface DbMenuOption {
  label: string;
  price: number;
}

export interface DbMenuItem {
  id: string;
  category: MenuCategoryId;
  /** Position d'affichage au sein de la catégorie. */
  order: number;
  name: string;
  description?: string;
  detail?: string;
  serves?: string;
  price?: number;
  priceUnit?: string;
  variants?: DbPriceVariant[];
  options?: DbMenuOption[];
  tags?: 'SANS GLUTEN'[];
  /** Référence une `DbImage.key`. */
  imageKey?: string;
  priceMissing?: boolean;
}

export interface DbSchema {
  images: DbImage[];
  menu: DbMenuItem[];
  meta: {
    lastPublishedAt: string | null;
    lastPublishedCommit: string | null;
  };
}

/** Emplacements structurels fixes (hero, sections d'ouverture) — toujours protégés. */
export const SITE_IMAGE_KEYS = [
  'hero',
  'heroCave',
  'heroCarte',
  'heroViande',
  'heroRestaurant',
  'intro',
  'caveTeaser',
] as const;

/** Emplacements de la galerie non liés à un plat — toujours protégés. */
export const GALLERY_ONLY_IMAGE_KEYS = [
  'galerieSalle1',
  'galerieSalle2',
  'galerieSalle3',
  'galerieViande1',
  'galerieViande2',
  'galerieViande3',
  'galerieVin1',
  'galerieVin2',
  'galerieVin3',
  'galerieDessert1',
  'galerieDessert2',
] as const;

/** Titres éditoriaux fixes des catégories (non gérés depuis le tableau de bord en v1). */
export const CATEGORY_META: Record<MenuCategoryId, { title: string; eyebrow: string }> = {
  entrees: { title: 'Entrées', eyebrow: 'Pour commencer' },
  viandes: { title: 'La Viande', eyebrow: 'Le cœur de la maison' },
  'non-carnivores': { title: 'Pour les non-carnivores', eyebrow: 'Une alternative' },
  desserts: { title: 'Desserts', eyebrow: 'Pour finir' },
};

export const CATEGORY_ORDER: MenuCategoryId[] = [
  'entrees',
  'viandes',
  'non-carnivores',
  'desserts',
];

/* -------------------------------------------------------------------------- */
/*  AMORÇAGE — reproduit exactement le contenu actuel du site                  */
/* -------------------------------------------------------------------------- */

const seedImages: DbImage[] = [
  // --- Images de page ---
  { key: 'hero', alt: "Pièce de viande rouge grillée servie dans la salle de L'Aller Retour", tone: 'braise', motif: 'cote', file: null, protected: true },
  { key: 'heroCave', alt: 'Bouteilles alignées dans la cave du restaurant', tone: 'cave', motif: 'bouteille', file: null, protected: true },
  { key: 'heroCarte', alt: 'Table dressée avant le service', tone: 'nappe', motif: 'assiette', file: null, protected: true },
  { key: 'heroViande', alt: 'Côte de bœuf saisie sur la braise', tone: 'braise', motif: 'flamme', file: null, protected: true },
  { key: 'heroRestaurant', alt: "Salle du restaurant L'Aller Retour", tone: 'salle', motif: 'salle', file: null, protected: true },
  { key: 'intro', alt: 'Table de restaurant, viande et verres de vin rouge', tone: 'bois', motif: 'verre', file: null, protected: true },
  { key: 'caveTeaser', alt: 'Rangées de bouteilles dans la cave', tone: 'cave', motif: 'bouteille', file: null, protected: true },

  // --- Entrées ---
  { key: 'escargots', alt: 'Escargots de Bourgogne', tone: 'bois', motif: 'escargot', file: null, protected: true },
  { key: 'boudin', alt: 'Boudins béarnais et ses pommes', tone: 'bois', motif: 'assiette', file: null, protected: true },
  { key: 'pate', alt: 'Pâté de campagne', tone: 'bois', motif: 'assiette', file: null, protected: true },
  { key: 'osAMoelle', alt: 'Os à moelle fendu, pain grillé et fleur de sel', tone: 'bois', motif: 'os', file: null, protected: true },
  { key: 'burrata', alt: 'Burrata et roquette', tone: 'nappe', motif: 'salade', file: null, protected: true },
  { key: 'tartareOnglet', alt: "Tartare d'onglet et moelle", tone: 'braise', motif: 'tartare', file: null, protected: true },

  // --- Viandes ---
  { key: 'tartareCharolais', alt: 'Tartare de bœuf au couteau Charolais, œuf et frites', tone: 'braise', motif: 'tartare', file: 'tartare-charolais.jpg', protected: true },
  { key: 'onglet', alt: 'Onglet de bœuf irlandais grillé, frites, salade et sauces', tone: 'braise', motif: 'steak', file: 'onglet.jpg', protected: true },
  { key: 'paveAngus', alt: "Pavé d'Angus", tone: 'braise', motif: 'steak', file: null, protected: true },
  { key: 'noixEntrecote', alt: "Noix d'entrecôte d'Argentine grillée, frites, salade et sauces", tone: 'braise', motif: 'steak', file: 'noix-entrecote-argentine.jpg', protected: true },
  { key: 'filet', alt: 'Filet de bœuf', tone: 'braise', motif: 'steak', file: null, protected: true },
  { key: 'coteDeBoeuf', alt: 'Côte de bœuf pour deux personnes, tranchée, servie avec salade et frites', tone: 'braise', motif: 'cote', file: 'cote-de-boeuf.jpg', protected: true },
  { key: 'fauxFilet', alt: 'Faux-filet pour deux personnes, tranché, salade et frites', tone: 'braise', motif: 'cote', file: 'faux-filet.jpg', protected: true },
  { key: 'entrecoteVeau', alt: 'Entrecôte de veau', tone: 'braise', motif: 'steak', file: null, protected: true },
  { key: 'andouillette', alt: 'Andouillette AAAAA', tone: 'bois', motif: 'assiette', file: null, protected: true },

  // --- Pour les non-carnivores ---
  { key: 'salade', alt: 'La salade du moment', tone: 'nappe', motif: 'salade', file: null, protected: true },

  // --- Desserts ---
  { key: 'fromage', alt: 'Assiette de fromage', tone: 'bois', motif: 'fromage', file: null, protected: true },
  { key: 'tarteCitron', alt: 'Tarte citron meringuée', tone: 'nappe', motif: 'dessert', file: null, protected: true },
  { key: 'tarteChocolat', alt: 'Tarte chocolat noir', tone: 'bois', motif: 'dessert', file: null, protected: true },
  { key: 'moelleux', alt: 'Moelleux aux noisettes, praliné amande', tone: 'bois', motif: 'dessert', file: null, protected: true },

  // --- Galerie ---
  { key: 'galerieSalle1', alt: 'Salle du restaurant', tone: 'salle', motif: 'salle', file: null, protected: true },
  { key: 'galerieSalle2', alt: 'Comptoir et banquettes', tone: 'bois', motif: 'salle', file: null, protected: true },
  { key: 'galerieSalle3', alt: 'Table dressée', tone: 'nappe', motif: 'assiette', file: null, protected: true },
  { key: 'galerieViande1', alt: 'Pièce de bœuf grillée', tone: 'braise', motif: 'steak', file: null, protected: true },
  { key: 'galerieViande2', alt: 'Côte de bœuf tranchée, servie avec salade et frites', tone: 'braise', motif: 'cote', file: 'cote-de-boeuf.jpg', protected: true },
  { key: 'galerieViande3', alt: 'Tartare de bœuf préparé au couteau, œuf et frites', tone: 'braise', motif: 'tartare', file: 'tartare-charolais.jpg', protected: true },
  { key: 'galerieVin1', alt: 'Bouteilles de la cave', tone: 'cave', motif: 'bouteille', file: null, protected: true },
  { key: 'galerieVin2', alt: 'Service du vin au verre', tone: 'cave', motif: 'verre', file: null, protected: true },
  { key: 'galerieVin3', alt: 'Casiers de la cave', tone: 'cave', motif: 'bouteille', file: null, protected: true },
  { key: 'galerieDessert1', alt: 'Tarte au chocolat noir', tone: 'bois', motif: 'dessert', file: null, protected: true },
  { key: 'galerieDessert2', alt: 'Assiette de fromage', tone: 'bois', motif: 'fromage', file: null, protected: true },
];

const seedMenu: DbMenuItem[] = [
  // --- Entrées ---
  { id: 'escargots-bourgogne', category: 'entrees', order: 0, name: 'Escargots de Bourgogne', detail: '6 unités', price: 9, imageKey: 'escargots' },
  { id: 'boudins-bearnais', category: 'entrees', order: 1, name: 'Boudins béarnais et ses pommes', price: 9, imageKey: 'boudin' },
  { id: 'pate-campagne', category: 'entrees', order: 2, name: 'Pâté de campagne', price: 8, imageKey: 'pate' },
  { id: 'os-a-moelle', category: 'entrees', order: 3, name: 'Os à moelle fendu', description: 'Pain grillé & fleur de sel', price: 8.5, imageKey: 'osAMoelle' },
  { id: 'burrata-roquette', category: 'entrees', order: 4, name: 'Burrata & roquette', description: "Pousses d'épinard, tomates cerises", price: 9.5, imageKey: 'burrata' },
  { id: 'tartare-onglet-moelle', category: 'entrees', order: 5, name: "Tartare d'onglet & moelle", price: 12, imageKey: 'tartareOnglet' },

  // --- La Viande ---
  { id: 'tartare-charolais', category: 'viandes', order: 0, name: 'Tartare de Bœuf au couteau Charolais', price: 18, imageKey: 'tartareCharolais' },
  { id: 'onglet-irlandais', category: 'viandes', order: 1, name: 'Onglet de Bœuf Irlandais', price: 19, imageKey: 'onglet' },
  { id: 'pave-angus', category: 'viandes', order: 2, name: "Pavé d'Angus", price: 23, imageKey: 'paveAngus' },
  {
    id: 'noix-entrecote-argentine',
    category: 'viandes',
    order: 3,
    name: "Noix d'entrecôte d'Argentine",
    variants: [
      { label: '250 g', price: 28 },
      { label: '350 g', price: 36 },
    ],
    imageKey: 'noixEntrecote',
  },
  { id: 'filet-de-boeuf', category: 'viandes', order: 4, name: 'Filet de Bœuf', price: 25, imageKey: 'filet' },
  { id: 'cote-de-boeuf', category: 'viandes', order: 5, name: 'Côte de Bœuf', serves: 'Pour 2 personnes', detail: 'Environ 1 kg', price: 74, imageKey: 'coteDeBoeuf' },
  { id: 'faux-filet', category: 'viandes', order: 6, name: 'Faux-Filet', serves: 'Pour 2 personnes', detail: 'Grammage selon arrivage', price: 9, priceUnit: '/ 100 g', imageKey: 'fauxFilet' },
  { id: 'entrecote-de-veau', category: 'viandes', order: 7, name: 'Entrecôte de Veau', price: 23, imageKey: 'entrecoteVeau' },
  { id: 'andouillette-aaaaa', category: 'viandes', order: 8, name: 'Andouillette AAAAA', price: 18, imageKey: 'andouillette' },

  // --- Pour les non-carnivores ---
  { id: 'salade-du-moment', category: 'non-carnivores', order: 0, name: 'La salade du moment', price: 14, imageKey: 'salade' },

  // --- Desserts ---
  {
    id: 'assiette-de-fromage',
    category: 'desserts',
    order: 0,
    name: 'Assiette de fromage',
    price: 9,
    options: [{ label: 'Verre de vin en accord', price: 20 }],
    imageKey: 'fromage',
  },
  { id: 'tarte-citron-meringuee', category: 'desserts', order: 1, name: 'Tarte citron meringuée', price: 9, imageKey: 'tarteCitron' },
  { id: 'tarte-chocolat-noir', category: 'desserts', order: 2, name: 'Tarte chocolat noir', price: 9, imageKey: 'tarteChocolat' },
  {
    id: 'moelleux-noisettes',
    category: 'desserts',
    order: 3,
    name: 'Moelleux aux noisettes',
    description: 'Praliné amande',
    price: 10.5,
    tags: ['SANS GLUTEN'],
    imageKey: 'moelleux',
  },
];

export const defaultData: DbSchema = {
  images: seedImages,
  menu: seedMenu,
  meta: { lastPublishedAt: null, lastPublishedCommit: null },
};

/* -------------------------------------------------------------------------- */
/*  OUVERTURE                                                                  */
/* -------------------------------------------------------------------------- */

export async function openDb() {
  const db = await JSONFilePreset<DbSchema>(DB_PATH, defaultData);
  // Complète les propriétés manquantes si la base existante est plus ancienne
  // que le schéma courant (migration douce, sans jamais effacer de données).
  db.data.images ??= [];
  db.data.menu ??= [];
  db.data.meta ??= { lastPublishedAt: null, lastPublishedCommit: null };
  return db;
}

export type Db = Awaited<ReturnType<typeof openDb>>;
