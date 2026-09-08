import { IMAGES } from '@/data/images';
import { CELLAR } from '@/data/site';
import { formatPrice } from '@/utils/format';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';
import { SectionTitle } from '../ui/SectionTitle';
import { Section } from '../ui/Section';
import { SmartImage } from '../ui/SmartImage';

/**
 * L'esprit de la maison.
 * Le texte s'en tient strictement aux informations communiquées :
 * viande, vin, convivialité, et l'ampleur de la cave.
 */
export function Intro() {
  return (
    <Section id="esprit" spacing="lg" textured className="bg-noir">
      <div className="u-container relative z-10 grid items-center gap-14 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
        {/* ---------------- Texte ---------------- */}
        <div>
          <SectionTitle
            eyebrow="La maison"
            size="lg"
            title={
              <>
                Une histoire de viande,
                <br />
                <span className="text-or-clair italic">de vin</span> et de convivialité
              </>
            }
          />

          <Reveal delay={120}>
            <div className="mt-9 space-y-5 text-[0.975rem] leading-[1.9] text-sable sm:text-base">
              <p>
                L'Aller Retour, c'est avant tout une histoire de viande, de vin et de
                convivialité.
              </p>
              <p>
                La viande et le vin y occupent la place centrale : une carte construite autour
                des belles pièces de bœuf, et une cave de plus de{' '}
                <span className="text-creme">{CELLAR.announcedReferences} références</span>, de{' '}
                {formatPrice(CELLAR.priceMin)} à {formatPrice(CELLAR.priceMax)}.
              </p>
              <p>
                Une table où l'on vient partager une côte de bœuf et déboucher une bouteille.
              </p>
            </div>
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button to="/la-viande" variant="primary">
                La viande
              </Button>
              <Button to="/la-cave" variant="outline">
                La cave
              </Button>
            </div>
          </Reveal>
        </div>

        {/* ---------------- Visuel ---------------- */}
        <Reveal variant="right" delay={140} className="relative">
          {/* Filet décalé : donne de la profondeur sans ombre portée */}
          <span
            aria-hidden="true"
            className="absolute -top-4 -right-4 bottom-4 left-4 border border-or/25 sm:-top-6 sm:-right-6 sm:bottom-6 sm:left-6"
          />
          <SmartImage
            image={IMAGES.intro}
            className="relative aspect-[4/5] w-full"
            sizes="(min-width: 1024px) 40vw, 90vw"
          />
        </Reveal>
      </div>
    </Section>
  );
}
