import { cn } from '@/utils/cn';

interface OrnamentProps {
  className?: string;
  /** Filet seul, sans le losange central. */
  bare?: boolean;
}

/**
 * Filet doré au losange central — séparateur discret repris de la
 * typographie des cartes de restaurant anciennes.
 */
export function Ornament({ className, bare = false }: OrnamentProps) {
  return (
    <div aria-hidden="true" className={cn('flex items-center gap-3 text-or/45', className)}>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-current" />
      {!bare && <span className="size-1.5 rotate-45 border border-current" />}
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-current" />
    </div>
  );
}

/** Petit filet horizontal placé avant un sur-titre. */
export function EyebrowRule({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-block h-px w-8 shrink-0 bg-or/60 align-middle', className)}
    />
  );
}
