import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { MAIN_NAV } from '@/data/navigation';
import { CONTACT } from '@/data/site';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { cn } from '@/utils/cn';
import { ReservationButton } from '../ReservationButton';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Logo } from './Logo';

/**
 * En-tête fixe.
 * Transparent au-dessus du premier écran, il se densifie au défilement
 * (fond charbon, flou, filet doré) pour rester lisible sur tout le site.
 */
export function Header() {
  /* Initialisé à la valeur réelle : l'en-tête est déjà dense si la page est
     restaurée en cours de défilement. */
  const [scrolled, setScrolled] = useState(() => window.scrollY > 24);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useLockBodyScroll(open);

  /* Densification de l'en-tête au défilement. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Le menu se referme à chaque navigation.
     Ajustement pendant le rendu plutôt que dans un effet : pas de rendu
     intermédiaire où le panneau resterait ouvert sur la nouvelle page. */
  const [renderedPath, setRenderedPath] = useState(location.pathname);
  if (location.pathname !== renderedPath) {
    setRenderedPath(location.pathname);
    if (open) setOpen(false);
  }

  /* Échap referme le menu et rend le focus au bouton. */
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  /* Le focus entre dans le panneau à son ouverture. */
  useEffect(() => {
    if (open) panelRef.current?.querySelector<HTMLElement>('a, button')?.focus();
  }, [open]);

  return (
    <>
      {/* Figé en sombre : l'en-tête chevauche toujours une section héros
          (Hero ou PageHero), elle-même verrouillée en sombre, en haut de
          chaque page — sa navigation doit y rester lisible en permanence. */}
      <header
        data-theme="dark"
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          'border-b',
          scrolled || open
            ? 'border-or/15 bg-noir/92 py-3 backdrop-blur-xl md:py-4'
            : 'border-transparent bg-gradient-to-b from-noir/75 to-transparent py-5 md:py-7',
        )}
      >
        <div className="u-container flex items-center justify-between gap-6">
          {/* --- Navigation gauche (desktop) --- */}
          <nav aria-label="Navigation principale" className="hidden flex-1 lg:block">
            <ul className="flex items-center gap-7 xl:gap-9">
              {MAIN_NAV.slice(0, 4).map((item) => (
                <li key={item.to}>
                  <HeaderLink {...item} />
                </li>
              ))}
            </ul>
          </nav>

          {/* --- Signature centrale --- */}
          <Logo compact={scrolled} className="lg:mx-auto" />

          {/* --- Navigation droite (desktop) --- */}
          <div className="hidden flex-1 items-center justify-end gap-7 lg:flex xl:gap-9">
            <nav aria-label="Navigation secondaire">
              <ul className="flex items-center gap-7 xl:gap-9">
                {MAIN_NAV.slice(4).map((item) => (
                  <li key={item.to}>
                    <HeaderLink {...item} />
                  </li>
                ))}
              </ul>
            </nav>
            <ThemeToggle />
            <ReservationButton size="sm" variant="outline">
              Réserver
            </ReservationButton>
          </div>

          {/* --- Commandes mobile & tablette --- */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              className="-mr-2 flex size-11 items-center justify-center text-creme transition-colors duration-300 hover:text-or-clair"
            >
              {open ? <X size={22} strokeWidth={1.25} /> : <Menu size={22} strokeWidth={1.25} />}
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/*  PANNEAU MOBILE                                                     */}
      {/*  Rendu hors de <header> : un ancêtre portant `backdrop-filter`      */}
      {/*  deviendrait bloc conteneur et fausserait le positionnement fixe.   */}
      {/* ------------------------------------------------------------------ */}
      <div
        id="menu-mobile"
        data-theme="dark"
        ref={panelRef}
        hidden={!open}
        className={cn(
          'fixed inset-0 z-40 overflow-y-auto overscroll-contain',
          'grain bg-noir/98 pt-24 backdrop-blur-xl lg:hidden',
        )}
        style={open ? { animation: 'ar-panel-in 0.45s cubic-bezier(0.22,1,0.36,1) both' } : undefined}
      >
        <nav aria-label="Navigation mobile" className="u-container relative z-10 pb-10">
          <ul className="flex flex-col">
            {MAIN_NAV.map((item, index) => (
              <li key={item.to} className="border-b border-or/10 last:border-0">
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  style={{ animationDelay: `${90 + index * 45}ms` }}
                  className={({ isActive }) =>
                    cn(
                      'flex items-baseline gap-4 py-4 font-display text-[1.75rem] tracking-wide transition-colors duration-300 sm:text-3xl',
                      'motion-safe:animate-[ar-fade-up_0.6s_cubic-bezier(0.22,1,0.36,1)_both]',
                      isActive ? 'text-or-clair' : 'text-creme hover:text-or-clair',
                    )
                  }
                >
                  <span className="font-sans text-[0.625rem] tracking-[0.3em] text-or/50 tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-9">
            <ReservationButton block size="lg">
              Réserver une table
            </ReservationButton>

            {CONTACT.phoneDisplay ? (
              <a
                href={`tel:${CONTACT.phone ?? ''}`}
                className="mt-5 block text-center font-sans text-xs tracking-[0.22em] text-sable uppercase"
              >
                {CONTACT.phoneDisplay}
              </a>
            ) : (
              <p className="mt-5 text-center font-sans text-xs tracking-[0.22em] text-cendre uppercase">
                {/* Le numéro apparaîtra ici dès qu'il sera renseigné. */}
                Réservation par téléphone
              </p>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function HeaderLink({ label, to }: { label: string; to: string }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        cn(
          'group relative block font-sans text-[0.6875rem] font-medium tracking-[0.2em] uppercase transition-colors duration-400',
          isActive ? 'text-or-clair' : 'text-ivoire/85 hover:text-creme',
        )
      }
    >
      {({ isActive }) => (
        <>
          {label}
          <span
            aria-hidden="true"
            className={cn(
              'absolute -bottom-1.5 left-0 h-px w-full origin-right scale-x-0 bg-or transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
              'group-hover:origin-left group-hover:scale-x-100',
              isActive && 'origin-left scale-x-100',
            )}
          />
        </>
      )}
    </NavLink>
  );
}
