import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { cn } from '@/utils/cn';

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Libellé du bouton de validation, ex. « Voir les 48 vins ». */
  confirmLabel: string;
}

/**
 * Panneau de filtres mobile, ancré en bas de l'écran.
 * Les commandes principales (fermeture, validation) restent dans le pouce :
 * la cave se manipule à une main.
 */
export function FilterDrawer({ open, onClose, children, confirmLabel }: FilterDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    panelRef.current?.focus();
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <div
      className={cn('fixed inset-0 z-60 lg:hidden', !open && 'pointer-events-none')}
      aria-hidden={!open}
      /* `inert` retire tout le panneau du parcours clavier tant qu'il est fermé. */
      inert={!open}
    >
      {/* Voile */}
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        aria-label="Fermer les filtres"
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-noir/80 backdrop-blur-sm transition-opacity duration-400',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />

      {/* Panneau */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal={open}
        aria-label="Filtrer la cave"
        tabIndex={-1}
        className={cn(
          'grain absolute inset-x-0 bottom-0 flex max-h-[88svh] flex-col border-t border-or/25 bg-noir',
          'transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          open ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        {/* Poignée */}
        <div className="relative z-10 flex items-center justify-between gap-4 border-b border-or/12 px-5 py-4">
          <span className="font-display text-xl text-creme">Filtrer la cave</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer les filtres"
            className="flex size-10 items-center justify-center text-sable transition-colors duration-300 hover:text-creme"
          >
            <X size={18} strokeWidth={1.4} />
          </button>
        </div>

        <div className="relative z-10 flex-1 overflow-y-auto overscroll-contain px-5 pb-4">
          {children}
        </div>

        <div className="relative z-10 border-t border-or/12 bg-noir px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-creme py-4 font-sans text-[0.6875rem] font-medium tracking-[0.22em] text-noir uppercase transition-colors duration-400 hover:bg-or-clair"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
