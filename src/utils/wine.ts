/**
 * MOTEUR DE LA CAVE
 * ---------------------------------------------------------------------------
 * Recherche, filtres et tris entièrement dérivés des données présentes dans
 * `src/data/wines.ts`. Aucune liste de régions, d'appellations ou de cépages
 * n'est codée en dur : ajoutez 300 bouteilles, les filtres se construisent
 * seuls. Retirez un champ, le filtre correspondant disparaît.
 */

import type { Wine } from '@/data/wines';
import { CELLAR } from '@/data/site';
import { normalize } from './format';

/* -------------------------------------------------------------------------- */
/*  TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export type WineFacetKey = 'type' | 'region' | 'appellation' | 'producer' | 'vintage' | 'grape';

export const FACET_LABELS: Record<WineFacetKey, string> = {
  type: 'Type de vin',
  region: 'Région',
  appellation: 'Appellation',
  producer: 'Domaine',
  vintage: 'Millésime',
  grape: 'Cépage',
};

export interface FacetOption {
  value: string;
  /** Nombre de bouteilles correspondantes, compte tenu des autres filtres. */
  count: number;
}

export interface WineFacet {
  key: WineFacetKey;
  label: string;
  options: FacetOption[];
}

export interface WineFilters {
  query: string;
  type: string[];
  region: string[];
  appellation: string[];
  producer: string[];
  vintage: string[];
  grape: string[];
  priceMin: number | null;
  priceMax: number | null;
  byTheGlass: boolean;
}

export type WineSortKey = 'reference' | 'price-asc' | 'price-desc' | 'name-asc' | 'vintage-desc';

export const SORT_OPTIONS: { key: WineSortKey; label: string }[] = [
  { key: 'reference', label: 'Sélection de la maison' },
  { key: 'price-asc', label: 'Prix croissant' },
  { key: 'price-desc', label: 'Prix décroissant' },
  { key: 'name-asc', label: 'Ordre alphabétique' },
  { key: 'vintage-desc', label: 'Millésime le plus récent' },
];

export const EMPTY_FILTERS: WineFilters = {
  query: '',
  type: [],
  region: [],
  appellation: [],
  producer: [],
  vintage: [],
  grape: [],
  priceMin: null,
  priceMax: null,
  byTheGlass: false,
};

export const FACET_ORDER: WineFacetKey[] = [
  'type',
  'region',
  'appellation',
  'producer',
  'vintage',
  'grape',
];

/* -------------------------------------------------------------------------- */
/*  HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

/** Un assemblage « Syrah · Grenache » devient deux cépages filtrables. */
export function splitGrapes(grape?: string): string[] {
  if (!grape) return [];
  return grape
    .split(/[·,/]|\s+et\s+/i)
    .map((g) => g.trim())
    .filter(Boolean);
}

/** Valeurs d'une facette pour une bouteille donnée (0, 1 ou plusieurs). */
function facetValues(wine: Wine, key: WineFacetKey): string[] {
  if (key === 'grape') return splitGrapes(wine.grape);
  const raw = wine[key];
  return raw === undefined || raw === null || raw === '' ? [] : [String(raw)];
}

/** Intitulé principal affiché sur la carte d'un vin. */
export function wineTitle(wine: Wine): string {
  return wine.name ?? wine.appellation ?? wine.producer ?? 'Bouteille';
}

/** Clé de tri alphabétique : domaine puis cuvée. */
export function wineSortName(wine: Wine): string {
  return normalize(`${wine.producer ?? ''} ${wineTitle(wine)}`);
}

/** Une bouteille d'exception reçoit le badge « Prestige ». */
export function isPrestige(wine: Wine): boolean {
  return wine.price !== undefined && wine.price >= CELLAR.prestigeThreshold;
}

/** Texte indexé par la recherche plein texte. */
function searchIndex(wine: Wine): string {
  return normalize(
    [
      wine.name,
      wine.producer,
      wine.appellation,
      wine.region,
      wine.type,
      wine.grape,
      wine.vintage,
      wine.description,
    ]
      .filter(Boolean)
      .join(' '),
  );
}

/* -------------------------------------------------------------------------- */
/*  FILTRAGE                                                                   */
/* -------------------------------------------------------------------------- */

function matchesQuery(wine: Wine, query: string): boolean {
  const q = normalize(query);
  if (!q) return true;
  const haystack = searchIndex(wine);
  // Tous les mots saisis doivent être présents : « bourgogne 2019 » fonctionne.
  return q.split(/\s+/).every((word) => haystack.includes(word));
}

function matchesFacet(wine: Wine, key: WineFacetKey, selected: string[]): boolean {
  if (selected.length === 0) return true;
  const values = facetValues(wine, key);
  return values.some((v) => selected.includes(v));
}

function matchesPrice(wine: Wine, min: number | null, max: number | null): boolean {
  if (min === null && max === null) return true;
  if (wine.price === undefined) return false;
  if (min !== null && wine.price < min) return false;
  if (max !== null && wine.price > max) return false;
  return true;
}

/**
 * Filtre complet.
 * `exclude` permet d'ignorer une facette : indispensable pour calculer
 * les compteurs d'une facette sans qu'elle se filtre elle-même.
 */
export function filterWines(
  wines: Wine[],
  filters: WineFilters,
  exclude?: WineFacetKey,
): Wine[] {
  return wines.filter((wine) => {
    if (!matchesQuery(wine, filters.query)) return false;
    if (filters.byTheGlass && !wine.byTheGlass) return false;
    if (!matchesPrice(wine, filters.priceMin, filters.priceMax)) return false;
    return FACET_ORDER.every(
      (key) => key === exclude || matchesFacet(wine, key, filters[key]),
    );
  });
}

/* -------------------------------------------------------------------------- */
/*  FACETTES                                                                   */
/* -------------------------------------------------------------------------- */

const TYPE_ORDER = ['Rouge', 'Blanc', 'Rosé', 'Champagne', 'Effervescent', 'Vin doux'];

function sortFacetOptions(key: WineFacetKey, options: FacetOption[]): FacetOption[] {
  if (key === 'type') {
    return [...options].sort((a, b) => {
      const ia = TYPE_ORDER.indexOf(a.value);
      const ib = TYPE_ORDER.indexOf(b.value);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.value.localeCompare(b.value, 'fr');
    });
  }

  if (key === 'vintage') {
    // Millésimes du plus récent au plus ancien ; « NM » (non millésimé) en fin.
    return [...options].sort((a, b) => {
      const na = Number(a.value);
      const nb = Number(b.value);
      const aNum = Number.isFinite(na);
      const bNum = Number.isFinite(nb);
      if (aNum && bNum) return nb - na;
      if (aNum) return -1;
      if (bNum) return 1;
      return a.value.localeCompare(b.value, 'fr');
    });
  }

  return [...options].sort((a, b) => a.value.localeCompare(b.value, 'fr'));
}

/**
 * Construit toutes les facettes disponibles à partir des données.
 * Une facette dont aucune bouteille ne porte l'information n'est pas générée :
 * si aucun vin n'a de cépage renseigné, le filtre « Cépage » n'apparaît pas.
 */
export function buildFacets(wines: Wine[], filters: WineFilters): WineFacet[] {
  return FACET_ORDER.map((key) => {
    // Les compteurs tiennent compte de tous les autres filtres actifs.
    const scope = filterWines(wines, filters, key);
    const counts = new Map<string, number>();

    for (const wine of scope) {
      for (const value of facetValues(wine, key)) {
        counts.set(value, (counts.get(value) ?? 0) + 1);
      }
    }

    // Une option déjà sélectionnée reste visible même si son compte tombe à 0.
    for (const value of filters[key]) {
      if (!counts.has(value)) counts.set(value, 0);
    }

    const options = sortFacetOptions(
      key,
      [...counts.entries()].map(([value, count]) => ({ value, count })),
    );

    return { key, label: FACET_LABELS[key], options };
  }).filter((facet) => facet.options.length > 0);
}

/* -------------------------------------------------------------------------- */
/*  TRI                                                                        */
/* -------------------------------------------------------------------------- */

export function sortWines(wines: Wine[], sort: WineSortKey): Wine[] {
  const list = [...wines];

  switch (sort) {
    case 'price-asc':
      return list.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    case 'price-desc':
      return list.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    case 'name-asc':
      return list.sort((a, b) => wineSortName(a).localeCompare(wineSortName(b), 'fr'));
    case 'vintage-desc':
      return list.sort((a, b) => {
        const va = Number(a.vintage);
        const vb = Number(b.vintage);
        return (Number.isFinite(vb) ? vb : -Infinity) - (Number.isFinite(va) ? va : -Infinity);
      });
    case 'reference':
    default:
      return list;
  }
}

/* -------------------------------------------------------------------------- */
/*  BORNES DE PRIX                                                             */
/* -------------------------------------------------------------------------- */

export interface PriceBounds {
  min: number;
  max: number;
}

/** Fourchette de prix réellement présente dans les données. */
export function priceBounds(wines: Wine[]): PriceBounds | null {
  const prices = wines.map((w) => w.price).filter((p): p is number => typeof p === 'number');
  if (prices.length === 0) return null;
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

/** Nombre de filtres actifs — sert au badge « Réinitialiser ». */
export function activeFilterCount(filters: WineFilters): number {
  let count = FACET_ORDER.reduce((total, key) => total + filters[key].length, 0);
  if (filters.query.trim()) count += 1;
  if (filters.priceMin !== null || filters.priceMax !== null) count += 1;
  if (filters.byTheGlass) count += 1;
  return count;
}
