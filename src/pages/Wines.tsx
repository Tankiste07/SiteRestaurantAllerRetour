import { useMemo, useState } from 'react';
import { AlertCircle, SlidersHorizontal, Wine as WineIcon } from 'lucide-react';
import { IMAGES } from '@/data/images';
import { CELLAR } from '@/data/site';
import { wineCategories, wines } from '@/data/wines';
import { useSeo } from '@/hooks/useSeo';
import { useWineCatalog } from '@/hooks/useWineCatalog';
import { cn } from '@/utils/cn';
import { formatPrice, plural } from '@/utils/format';
import { SORT_OPTIONS, type WineSortKey } from '@/utils/wine';
import { PageHero } from '@/components/layout/PageHero';
import { ReservationButton } from '@/components/ReservationButton';
import { Reveal } from '@/components/ui/Reveal';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { FilterDrawer } from '@/components/wines/FilterDrawer';
import { WineCard } from '@/components/wines/WineCard';
import { WineFilters } from '@/components/wines/WineFilters';
import { WineSearch } from '@/components/wines/WineSearch';
import { WineSection } from '@/components/wines/WineSection';

/** Ancre HTML lisible, sans accents ni espaces — pour la navigation par sections. */
function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function Wines() {
  useSeo({
    title: 'La Cave',
    description: `Plus de ${CELLAR.announcedReferences} références de vins, de ${CELLAR.priceMin} € à ${CELLAR.priceMax} €. Recherchez par domaine, appellation, région, millésime ou cépage.`,
  });

  const catalog = useWineCatalog(wines);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const hasByTheGlass = useMemo(() => wines.some((w) => w.byTheGlass), []);
  const countLabel = `${catalog.results.length} ${plural(catalog.results.length, 'référence')}`;

  /* Aucune recherche ni filtre actif : on affiche la carte structurée par
     catégories, comme la carte papier, plutôt que la grille filtrée. */
  const isBrowsing = catalog.filters.query.trim() === '' && catalog.activeCount === 0;
  const showSections = isBrowsing && wines.length > 0;

  const filtersPanel = (
    <WineFilters
      facets={catalog.facets}
      filters={catalog.filters}
      bounds={catalog.bounds}
      activeCount={catalog.activeCount}
      onToggle={catalog.toggleFacet}
      onClearFacet={catalog.clearFacet}
      onPriceRange={catalog.setPriceRange}
      onToggleByTheGlass={catalog.toggleByTheGlass}
      onReset={catalog.reset}
      hasByTheGlass={hasByTheGlass}
    />
  );

  return (
    <>
      <PageHero
        eyebrow={`De ${formatPrice(CELLAR.priceMin)} à ${formatPrice(CELLAR.priceMax)}`}
        title="La Cave"
        image={IMAGES.heroCave}
        intro={
          <p>
            Plus de <span className="text-creme">{CELLAR.announcedReferences} références</span>.
            Une cave à parcourir bouteille par bouteille — par région, appellation, domaine,
            millésime ou cépage.
          </p>
        }
      >
        <ReservationButton variant="outline">Réserver une table</ReservationButton>
      </PageHero>

      <AvailabilityNotice />

      <section className="grain relative bg-noir py-14 md:py-20" aria-labelledby="titre-selection">
        <div className="u-container relative z-10">
          <h2 id="titre-selection" className="sr-only">
            Rechercher dans la cave
          </h2>

          {/* -------------------- Recherche -------------------- */}
          <WineSearch
            value={catalog.filters.query}
            onChange={catalog.setQuery}
            resultsLabel={countLabel}
            className="mx-auto max-w-3xl"
          />

          {/* -------------------- Barre d'outils -------------------- */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-or/12 py-4">
            <p className="font-sans text-xs tracking-[0.2em] text-sable uppercase">
              <span className="tnum text-creme">{catalog.results.length}</span>{' '}
              {plural(catalog.results.length, 'référence')}
              {catalog.activeCount > 0 && (
                <span className="text-cendre"> · sur {catalog.totalCount}</span>
              )}
            </p>

            <div className="flex items-center gap-3">
              {!showSections && <SortSelect value={catalog.sort} onChange={catalog.setSort} />}

              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-2.5 border border-or/25 px-4 py-2.5 font-sans text-[0.625rem] tracking-[0.2em] text-ivoire uppercase transition-colors duration-300 hover:border-or/50 hover:text-creme lg:hidden"
              >
                <SlidersHorizontal size={14} strokeWidth={1.4} />
                Filtrer
                {catalog.activeCount > 0 && (
                  <span className="tnum text-or-clair">{catalog.activeCount}</span>
                )}
              </button>
            </div>
          </div>

          {/* -------------------- Navigation rapide -------------------- */}
          {showSections && (
            <nav
              aria-label="Aller à une catégorie"
              className="mt-8 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {wineCategories.map((cat) => (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  className="shrink-0 whitespace-nowrap border border-or/20 px-4 py-2 font-sans text-[0.625rem] tracking-[0.18em] text-sable uppercase transition-colors duration-300 hover:border-or/50 hover:text-creme"
                >
                  {cat.title}
                </a>
              ))}
            </nav>
          )}

          {/* -------------------- Filtres + résultats -------------------- */}
          <div className="mt-10 grid gap-10 lg:grid-cols-[17rem_1fr] lg:gap-14 xl:grid-cols-[19rem_1fr]">
            <aside className="hidden lg:block" aria-label="Filtres">
              <div className="sticky top-28 max-h-[calc(100svh-9rem)] overflow-y-auto pr-2">
                {filtersPanel}
              </div>
            </aside>

            <div>
              {showSections ? (
                <div className="space-y-16">
                  {wineCategories.map((cat) =>
                    cat.subcategories ? (
                      <div key={cat.id} id={cat.id} className="scroll-mt-28">
                        <SectionTitle as="h2" size="md" title={cat.title} />
                        <div className="mt-10 space-y-12">
                          {cat.subcategories.map((sub) => (
                            <WineSection
                              key={sub.title}
                              id={`${cat.id}-${slugify(sub.title)}`}
                              title={sub.title}
                              wines={sub.wines}
                              sub
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <WineSection key={cat.id} id={cat.id} title={cat.title} wines={cat.wines ?? []} />
                    ),
                  )}
                </div>
              ) : catalog.results.length === 0 ? (
                <EmptyState
                  hasFilters={catalog.activeCount > 0}
                  onReset={catalog.reset}
                  totalCount={catalog.totalCount}
                />
              ) : (
                <>
                  <ul className="grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
                    {catalog.displayed.map((wine, index) => (
                      <Reveal
                        key={wine.id}
                        as="li"
                        delay={(index % 3) * 90}
                        threshold={0.05}
                        className="h-full"
                      >
                        <WineCard wine={wine} />
                      </Reveal>
                    ))}
                  </ul>

                  {catalog.hasMore && (
                    <div className="mt-12 flex flex-col items-center gap-4">
                      <button
                        type="button"
                        onClick={catalog.showMore}
                        className="border border-or/35 px-9 py-4 font-sans text-[0.6875rem] font-medium tracking-[0.22em] text-creme uppercase transition-colors duration-400 hover:border-or hover:bg-or/10"
                      >
                        Voir plus de bouteilles
                      </button>
                      <p className="font-sans text-[0.6875rem] tracking-[0.18em] text-cendre uppercase">
                        <span className="tnum">{catalog.remaining}</span> restantes
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* -------------------- Filtres mobile -------------------- */}
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        confirmLabel={`Voir ${catalog.results.length} ${plural(catalog.results.length, 'bouteille')}`}
      >
        {filtersPanel}
      </FilterDrawer>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  DISPONIBILITÉ                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Une cave vivante voit ses stocks bouger : certaines références peuvent
 * s'épuiser sans que la carte en ligne ne soit mise à jour dans l'instant.
 */
function AvailabilityNotice() {
  return (
    <div className="border-y border-or/20 bg-bordeaux/20">
      <div className="u-container flex flex-col items-center gap-2.5 py-3.5 text-center sm:flex-row sm:gap-3 sm:text-left">
        <AlertCircle size={16} strokeWidth={1.4} className="shrink-0 text-or/80" />
        <p className="text-[0.8125rem] leading-relaxed text-ivoire/90">
          Notre cave évolue au fil des arrivages : certaines références peuvent être
          exceptionnellement indisponibles. N'hésitez pas à nous demander confirmation
          directement sur place.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  TRI                                                                        */
/* -------------------------------------------------------------------------- */

function SortSelect({
  value,
  onChange,
}: {
  value: WineSortKey;
  onChange: (value: WineSortKey) => void;
}) {
  return (
    <label className="relative">
      <span className="sr-only">Trier les bouteilles</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as WineSortKey)}
        className={cn(
          'cursor-pointer appearance-none border border-or/25 bg-charbon/60 py-2.5 pr-9 pl-4',
          'font-sans text-[0.625rem] tracking-[0.2em] text-ivoire uppercase',
          'transition-colors duration-300 hover:border-or/50 focus:border-or/60 focus:outline-none',
        )}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.key} value={option.key} className="bg-charbon text-ivoire normal-case">
            {option.label}
          </option>
        ))}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-or/70"
      >
        <svg width="9" height="6" viewBox="0 0 9 6" fill="none" stroke="currentColor" strokeWidth="1.3">
          <path d="M1 1l3.5 3.5L8 1" />
        </svg>
      </span>
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/*  ÉTATS PARTICULIERS                                                         */
/* -------------------------------------------------------------------------- */

function EmptyState({
  hasFilters,
  onReset,
  totalCount,
}: {
  hasFilters: boolean;
  onReset: () => void;
  totalCount: number;
}) {
  /* Aucune donnée du tout : la cave réelle n'a pas encore été intégrée. */
  if (totalCount === 0) {
    return (
      <div className="border border-or/15 bg-charbon/40 px-6 py-16 text-center sm:px-12">
        <WineIcon size={30} strokeWidth={1} aria-hidden="true" className="mx-auto text-or/60" />
        <h3 className="mt-6 font-display text-2xl text-creme sm:text-3xl">
          La cave arrive bientôt
        </h3>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-sable">
          Les {CELLAR.announcedReferences} références de la maison sont en cours d'intégration.
          En attendant, l'équipe vous guidera volontiers au moment du service.
        </p>
        <div className="mt-8 flex justify-center">
          <ReservationButton variant="outline">Réserver une table</ReservationButton>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-or/15 bg-charbon/40 px-6 py-16 text-center sm:px-12">
      <WineIcon size={30} strokeWidth={1} aria-hidden="true" className="mx-auto text-or/60" />
      <h3 className="mt-6 font-display text-2xl text-creme sm:text-3xl">Aucune bouteille</h3>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-sable">
        Aucune référence ne correspond à cette recherche. Essayez une autre région, un autre
        millésime, ou repartez de la cave complète.
      </p>
      {hasFilters && (
        <button
          type="button"
          onClick={onReset}
          className="mt-8 border border-or/35 px-8 py-3.5 font-sans text-[0.6875rem] font-medium tracking-[0.22em] text-creme uppercase transition-colors duration-400 hover:border-or hover:bg-or/10"
        >
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );
}
