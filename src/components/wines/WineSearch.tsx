import { Search, X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface WineSearchProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  /** Nombre de résultats, annoncé aux lecteurs d'écran. */
  resultsLabel?: string;
}

/** Barre de recherche de la cave. */
export function WineSearch({ value, onChange, className, resultsLabel }: WineSearchProps) {
  return (
    <div className={cn('relative', className)}>
      <label htmlFor="recherche-vin" className="sr-only">
        Rechercher dans la cave
      </label>

      <Search
        size={17}
        strokeWidth={1.4}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-or/70"
      />

      <input
        id="recherche-vin"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Rechercher un vin, un domaine, une appellation…"
        autoComplete="off"
        spellCheck={false}
        className={cn(
          'w-full border border-or/20 bg-charbon/70 py-4 pr-12 pl-13 text-[0.9375rem] text-creme',
          'placeholder:text-cendre',
          'transition-colors duration-400 hover:border-or/35 focus:border-or/60 focus:outline-none',
        )}
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Effacer la recherche"
          className="absolute top-1/2 right-3 flex size-9 -translate-y-1/2 items-center justify-center text-sable transition-colors duration-300 hover:text-creme"
        >
          <X size={16} strokeWidth={1.5} />
        </button>
      )}

      {resultsLabel && (
        <p aria-live="polite" className="sr-only">
          {resultsLabel}
        </p>
      )}
    </div>
  );
}
