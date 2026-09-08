import { useMemo, useState } from 'react';
import { Check, ChevronDown, RotateCcw } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils/format';
import type { PriceBounds, WineFacet, WineFacetKey, WineFilters as Filters } from '@/utils/wine';

interface WineFiltersProps {
  facets: WineFacet[];
  filters: Filters;
  bounds: PriceBounds | null;
  activeCount: number;
  onToggle: (key: WineFacetKey, value: string) => void;
  onClearFacet: (key: WineFacetKey) => void;
  onPriceRange: (min: number | null, max: number | null) => void;
  onToggleByTheGlass: () => void;
  onReset: () => void;
  /** Au moins une bouteille est-elle servie au verre ? */
  hasByTheGlass: boolean;
}

/** Nombre d'options visibles avant le bouton « Voir plus ». */
const VISIBLE_OPTIONS = 7;

export function WineFilters({
  facets,
  filters,
  bounds,
  activeCount,
  onToggle,
  onClearFacet,
  onPriceRange,
  onToggleByTheGlass,
  onReset,
  hasByTheGlass,
}: WineFiltersProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-4 pb-5">
        <h2 className="eyebrow">Affiner</h2>
        <button
          type="button"
          onClick={onReset}
          disabled={activeCount === 0}
          className={cn(
            'flex items-center gap-2 font-sans text-[0.625rem] tracking-[0.2em] uppercase transition-colors duration-300',
            activeCount === 0
              ? 'cursor-not-allowed text-cendre/50'
              : 'text-sable hover:text-or-clair',
          )}
        >
          <RotateCcw size={12} strokeWidth={1.5} />
          Réinitialiser
          {activeCount > 0 && <span className="tnum text-or-clair">({activeCount})</span>}
        </button>
      </div>

      {bounds && (
        <PriceFilter
          bounds={bounds}
          min={filters.priceMin}
          max={filters.priceMax}
          onChange={onPriceRange}
        />
      )}

      {hasByTheGlass && (
        <div className="border-t border-or/10 py-5">
          <Option
            checked={filters.byTheGlass}
            onChange={onToggleByTheGlass}
            label="Servi au verre"
          />
        </div>
      )}

      {facets.map((facet) => (
        <FacetGroup
          key={facet.key}
          facet={facet}
          selected={filters[facet.key]}
          onToggle={onToggle}
          onClear={onClearFacet}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  GROUPE DE FACETTE                                                          */
/* -------------------------------------------------------------------------- */

interface FacetGroupProps {
  facet: WineFacet;
  selected: string[];
  onToggle: (key: WineFacetKey, value: string) => void;
  onClear: (key: WineFacetKey) => void;
}

function FacetGroup({ facet, selected, onToggle, onClear }: FacetGroupProps) {
  /* Les deux premières facettes sont ouvertes d'emblée ; les autres se déplient. */
  const [open, setOpen] = useState(facet.key === 'type' || facet.key === 'region');
  const [expanded, setExpanded] = useState(false);

  const options = expanded ? facet.options : facet.options.slice(0, VISIBLE_OPTIONS);
  const hidden = facet.options.length - options.length;
  const panelId = `facette-${facet.key}`;

  return (
    <div className="border-t border-or/10">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-3 py-5 text-left transition-colors duration-300 hover:text-creme"
        >
          <span className="flex items-baseline gap-2.5">
            <span className="font-sans text-xs font-medium tracking-[0.18em] text-ivoire uppercase">
              {facet.label}
            </span>
            {selected.length > 0 && (
              <span className="tnum font-sans text-[0.625rem] text-or-clair">
                {selected.length}
              </span>
            )}
          </span>
          <ChevronDown
            size={15}
            strokeWidth={1.4}
            aria-hidden="true"
            className={cn(
              'shrink-0 text-or/70 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]',
              open && 'rotate-180',
            )}
          />
        </button>
      </h3>

      <div id={panelId} hidden={!open} className="pb-5">
        <ul className="flex flex-col gap-1">
          {options.map((option) => (
            <li key={option.value}>
              <Option
                checked={selected.includes(option.value)}
                onChange={() => onToggle(facet.key, option.value)}
                label={option.value}
                count={option.count}
                disabled={option.count === 0 && !selected.includes(option.value)}
              />
            </li>
          ))}
        </ul>

        <div className="mt-3 flex items-center gap-4">
          {hidden > 0 && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="font-sans text-[0.625rem] tracking-[0.2em] text-or/80 uppercase transition-colors duration-300 hover:text-or-clair"
            >
              Voir les {hidden} autres
            </button>
          )}
          {expanded && facet.options.length > VISIBLE_OPTIONS && (
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="font-sans text-[0.625rem] tracking-[0.2em] text-cendre uppercase transition-colors duration-300 hover:text-sable"
            >
              Réduire
            </button>
          )}
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => onClear(facet.key)}
              className="ml-auto font-sans text-[0.625rem] tracking-[0.2em] text-cendre uppercase transition-colors duration-300 hover:text-sable"
            >
              Effacer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  CASE À COCHER                                                              */
/* -------------------------------------------------------------------------- */

interface OptionProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  count?: number;
  disabled?: boolean;
}

function Option({ checked, onChange, label, count, disabled }: OptionProps) {
  return (
    <label
      className={cn(
        'group flex cursor-pointer items-center gap-3 py-2 transition-colors duration-300',
        disabled && 'cursor-not-allowed opacity-40',
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          'flex size-4.5 shrink-0 items-center justify-center border transition-colors duration-300',
          'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-or-clair',
          checked ? 'border-or bg-or/18 text-or-clair' : 'border-or/30 group-hover:border-or/60',
        )}
      >
        {checked && <Check size={11} strokeWidth={2.4} />}
      </span>

      <span
        className={cn(
          'flex-1 text-[0.875rem] transition-colors duration-300',
          checked ? 'text-creme' : 'text-sable group-hover:text-ivoire',
        )}
      >
        {label}
      </span>

      {count !== undefined && (
        <span className="tnum font-sans text-[0.6875rem] text-cendre">{count}</span>
      )}
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/*  PRIX                                                                       */
/* -------------------------------------------------------------------------- */

interface PriceFilterProps {
  bounds: PriceBounds;
  min: number | null;
  max: number | null;
  onChange: (min: number | null, max: number | null) => void;
}

function PriceFilter({ bounds, min, max, onChange }: PriceFilterProps) {
  /* Paliers construits à partir de la fourchette réelle des données. */
  const presets = useMemo(() => {
    const candidates: { label: string; min: number | null; max: number | null }[] = [
      { label: `Moins de ${formatPrice(50)}`, min: null, max: 50 },
      { label: `${formatPrice(50)} – ${formatPrice(100)}`, min: 50, max: 100 },
      { label: `${formatPrice(100)} – ${formatPrice(200)}`, min: 100, max: 200 },
      { label: `Plus de ${formatPrice(200)}`, min: 200, max: null },
    ];
    return candidates.filter(
      (p) => (p.min ?? bounds.min) <= bounds.max && (p.max ?? bounds.max) >= bounds.min,
    );
  }, [bounds]);

  const isActive = (p: { min: number | null; max: number | null }) =>
    p.min === min && p.max === max;

  return (
    <div className="border-t border-or/10 py-5">
      <h3 className="font-sans text-xs font-medium tracking-[0.18em] text-ivoire uppercase">
        Prix
      </h3>
      <p className="mt-2 font-sans text-[0.6875rem] tracking-wide text-cendre">
        De {formatPrice(bounds.min)} à {formatPrice(bounds.max)}
      </p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <li key={preset.label}>
            <button
              type="button"
              onClick={() =>
                isActive(preset) ? onChange(null, null) : onChange(preset.min, preset.max)
              }
              aria-pressed={isActive(preset)}
              className={cn(
                'border px-3 py-2 font-sans text-[0.6875rem] tracking-[0.1em] transition-colors duration-300',
                isActive(preset)
                  ? 'border-or/60 bg-or/12 text-or-clair'
                  : 'border-or/20 text-sable hover:border-or/45 hover:text-creme',
              )}
            >
              {preset.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center gap-3">
        <NumberField
          label="Prix minimum"
          placeholder={String(bounds.min)}
          value={min}
          onChange={(value) => onChange(value, max)}
        />
        <span aria-hidden="true" className="text-cendre">
          —
        </span>
        <NumberField
          label="Prix maximum"
          placeholder={String(bounds.max)}
          value={max}
          onChange={(value) => onChange(min, value)}
        />
      </div>
    </div>
  );
}

interface NumberFieldProps {
  label: string;
  placeholder: string;
  value: number | null;
  onChange: (value: number | null) => void;
}

function NumberField({ label, placeholder, value, onChange }: NumberFieldProps) {
  return (
    <label className="relative flex-1">
      <span className="sr-only">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(event) => {
          const next = event.target.value;
          onChange(next === '' ? null : Number(next));
        }}
        className="tnum w-full border border-or/20 bg-charbon/60 py-2.5 pr-8 pl-3 text-sm text-creme transition-colors duration-300 placeholder:text-cendre focus:border-or/60 focus:outline-none"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-cendre"
      >
        €
      </span>
    </label>
  );
}
