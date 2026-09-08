import { IMAGES } from '@/data/images';
import { CELLAR } from '@/data/site';
import { formatPrice } from '@/utils/format';
import { useParallax } from '@/hooks/useParallax';
import { Button } from '../ui/Button';
import { Ornament } from '../ui/Ornament';
import { Reveal } from '../ui/Reveal';
import { SmartImage } from '../ui/SmartImage';

/**
 * Passerelle vers la cave depuis la page d'accueil.
 * Chiffre annoncé par le restaurant : plus de 300 références, de 32 € à 999 €.
 */
export function CaveTeaser() {
  const parallaxRef = useParallax<HTMLDivElement>(0.12);

  return (
    // Figé en sombre : le texte clair repose sur une photo, quel que soit
    // le thème du site.
    <section
      data-theme="dark"
      aria-labelledby="titre-cave"
      className="relative flex min-h-[80vh] items-center overflow-hidden py-24 md:min-h-[85vh] md:py-32"
    >
      <div className="absolute inset-0 -z-10">
        <div ref={parallaxRef} className="absolute -inset-x-0 -top-[10%] h-[120%]">
          <SmartImage image={IMAGES.caveTeaser} className="h-full w-full" sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-noir/72" />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(65% 60% at 50% 50%, rgba(10,9,8,0) 0%, rgba(10,9,8,0.85) 100%)',
          }}
        />
      </div>

      <div className="u-container-narrow relative z-10 text-center">
        <Reveal variant="fade">
          <p className="eyebrow">La cave</p>
        </Reveal>

        <Reveal delay={100}>
          <h2
            id="titre-cave"
            className="mt-6 font-display text-[clamp(2.5rem,9vw,5.5rem)] leading-[0.98] text-creme uppercase"
          >
            Plus de{' '}
            <span className="text-or-clair">{CELLAR.announcedReferences}</span>
            <br />
            références
          </h2>
        </Reveal>

        <Reveal delay={180}>
          <Ornament className="mx-auto mt-9 max-w-xs" />
        </Reveal>

        <Reveal delay={240}>
          <p className="mx-auto mt-9 max-w-xl text-[0.975rem] leading-[1.9] text-ivoire/85 sm:text-base">
            Une véritable cave, à parcourir bouteille par bouteille. Des vins de{' '}
            <span className="tnum text-creme">{formatPrice(CELLAR.priceMin)}</span> à{' '}
            <span className="tnum text-creme">{formatPrice(CELLAR.priceMax)}</span>, à chercher
            par région, appellation, domaine, millésime ou cépage.
          </p>
        </Reveal>

        <Reveal delay={320}>
          <div className="mt-11 flex justify-center">
            <Button to="/la-cave" size="lg" variant="primary">
              Explorer la cave
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
