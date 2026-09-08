import { useCallback, useMemo, useState } from 'react';
import type { Wine } from '@/data/wines';
import {
  activeFilterCount,
  buildFacets,
  EMPTY_FILTERS,
  filterWines,
  priceBounds,
  sortWines,
  type WineFacetKey,
  type WineFilters,
  type WineSortKey,
} from '@/utils/wine';

/** Nombre de bouteilles affichées avant de cliquer sur « Voir plus ». */
const PAGE_SIZE = 24;

/**
 * Pilote la cave : recherche, filtres à facettes, tri et affichage progressif.
 * Conçu pour rester fluide avec plusieurs centaines de références.
 */
export function useWineCatalog(source: Wine[]) {
  const [filters, setFilters] = useState<WineFilters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<WineSortKey>('reference');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const bounds = useMemo(() => priceBounds(source), [source]);
  const facets = useMemo(() => buildFacets(source, filters), [source, filters]);

  const results = useMemo(
    () => sortWines(filterWines(source, filters), sort),
    [source, filters, sort],
  );

  /* Toute modification de la sélection ramène l'affichage au début.
     La remise à zéro est déclenchée par l'action de l'utilisateur, jamais
     par un effet : c'est l'événement qui la provoque, pas un rendu. */
  const resetPaging = useCallback(() => setVisible(PAGE_SIZE), []);

  const setQuery = useCallback(
    (query: string) => {
      setFilters((prev) => ({ ...prev, query }));
      resetPaging();
    },
    [resetPaging],
  );

  const toggleFacet = useCallback(
    (key: WineFacetKey, value: string) => {
      setFilters((prev) => {
        const selected = prev[key];
        return {
          ...prev,
          [key]: selected.includes(value)
            ? selected.filter((v) => v !== value)
            : [...selected, value],
        };
      });
      resetPaging();
    },
    [resetPaging],
  );

  const clearFacet = useCallback(
    (key: WineFacetKey) => {
      setFilters((prev) => ({ ...prev, [key]: [] }));
      resetPaging();
    },
    [resetPaging],
  );

  const setPriceRange = useCallback(
    (min: number | null, max: number | null) => {
      setFilters((prev) => ({ ...prev, priceMin: min, priceMax: max }));
      resetPaging();
    },
    [resetPaging],
  );

  const toggleByTheGlass = useCallback(() => {
    setFilters((prev) => ({ ...prev, byTheGlass: !prev.byTheGlass }));
    resetPaging();
  }, [resetPaging]);

  const reset = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    resetPaging();
  }, [resetPaging]);

  const changeSort = useCallback(
    (next: WineSortKey) => {
      setSort(next);
      resetPaging();
    },
    [resetPaging],
  );

  const showMore = useCallback(() => setVisible((v) => v + PAGE_SIZE), []);

  return {
    filters,
    facets,
    bounds,
    sort,
    setSort: changeSort,
    results,
    /** Sous-ensemble réellement rendu — évite de monter 300 cartes d'un coup. */
    displayed: results.slice(0, visible),
    hasMore: results.length > visible,
    remaining: Math.max(0, results.length - visible),
    showMore,
    setQuery,
    toggleFacet,
    clearFacet,
    setPriceRange,
    toggleByTheGlass,
    reset,
    activeCount: activeFilterCount(filters),
    totalCount: source.length,
  };
}
