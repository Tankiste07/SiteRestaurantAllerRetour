import { ArrowDown } from 'lucide-react';
import { IMAGES } from '@/data/images';
import { CELLAR } from '@/data/site';
import { useParallax } from '@/hooks/useParallax';
import { ReservationButton } from '../ReservationButton';
import { Button } from '../ui/Button';
import { SmartImage } from '../ui/SmartImage';

const FACTS = [
  'Viandes d’exception',
  `Plus de ${CELLAR.announcedReferences} vins`,
  'Table conviviale',
];

/**
 * Premier écran : image plein cadre, parallaxe douce, titre en serif.
 * Tout le texte est superposé à un dégradé de lisibilité, jamais posé
 * directement sur la photo.
 */
export function Hero() {
  const parallaxRef = useParallax<HTMLDivElement>(0.18);

  return (
    // `data-theme="dark"` fige cette section en sombre quel que soit le thème
    // choisi : le texte clair posé sur la photo doit rester lisible.
    <section
      data-theme="dark"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* ---------------- Fond ---------------- */}
      <div className="absolute inset-0 -z-10">
        <div ref={parallaxRef} className="absolute -inset-x-0 -top-[12%] h-[124%] will-change-transform">
          <SmartImage
            image={IMAGES.hero}
            priority
            className="h-full w-full"
            imgClassName="ar-drift"
            sizes="100vw"
          />
        </div>
        <div className="scrim absolute inset-0" />
        {/* Halo de braise très discret, côté bas-gauche */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              'radial-gradient(70% 55% at 18% 92%, rgba(125,22,38,0.35) 0%, rgba(125,22,38,0) 62%)',
          }}
        />
      </div>

      {/* ---------------- Contenu ---------------- */}
      <div className="u-container relative flex flex-1 flex-col items-center justify-center pt-32 pb-28 text-center md:pt-36 md:pb-32">
        <p
          className="eyebrow motion-safe:animate-[ar-fade-up_1s_cubic-bezier(0.22,1,0.36,1)_0.15s_both]"
        >
          Restaurant · Viandes &amp; Vins
        </p>

        <h1 className="mt-7 font-display text-[clamp(2.9rem,13vw,9.5rem)] leading-[0.92] font-light tracking-[0.02em] text-creme uppercase motion-safe:animate-[ar-fade-up_1.1s_cubic-bezier(0.22,1,0.36,1)_0.3s_both]">
          <span className="block">L'Aller</span>
          <span className="block">Retour</span>
        </h1>

        <div
          aria-hidden="true"
          className="mt-8 h-px w-24 origin-center bg-gradient-to-r from-transparent via-or/70 to-transparent motion-safe:animate-[ar-rule-in_1.2s_cubic-bezier(0.22,1,0.36,1)_0.7s_both]"
        />

        <p className="mt-8 max-w-xl font-sans text-[0.8125rem] leading-relaxed font-light tracking-[0.26em] text-ivoire/90 uppercase sm:text-sm motion-safe:animate-[ar-fade-up_1s_cubic-bezier(0.22,1,0.36,1)_0.85s_both]">
          Viandes d'exception &amp; vins de caractère
        </p>

        <div className="mt-11 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4 motion-safe:animate-[ar-fade-up_1s_cubic-bezier(0.22,1,0.36,1)_1s_both]">
          <Button to="/la-carte" size="lg" variant="primary" className="sm:min-w-56">
            Découvrir la carte
          </Button>
          <ReservationButton size="lg" variant="outline" className="sm:min-w-56">
            Réserver une table
          </ReservationButton>
        </div>
      </div>

      {/* ---------------- Bandeau bas ---------------- */}
      <div className="relative z-10 border-t border-or/12 bg-noir/35 backdrop-blur-[2px]">
        <div className="u-container flex items-center justify-center gap-6 py-4 md:justify-between">
          <ul className="hidden items-center gap-10 md:flex lg:gap-16">
            {FACTS.map((fact) => (
              <li
                key={fact}
                className="font-sans text-[0.625rem] font-medium tracking-[0.3em] text-ivoire/70 uppercase"
              >
                {fact}
              </li>
            ))}
          </ul>

          <a
            href="#esprit"
            className="group flex items-center gap-3 font-sans text-[0.625rem] font-medium tracking-[0.3em] text-or/85 uppercase transition-colors duration-500 hover:text-or-clair"
          >
            Découvrir
            <ArrowDown
              size={14}
              strokeWidth={1.4}
              className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-1"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
