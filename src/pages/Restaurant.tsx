import { Beef, Wine, Users } from 'lucide-react';
import { IMAGES } from '@/data/images';
import { CELLAR } from '@/data/site';
import { useSeo } from '@/hooks/useSeo';
import { PageHero } from '@/components/layout/PageHero';
import { ReservationButton } from '@/components/ReservationButton';
import { Button } from '@/components/ui/Button';
import { Ornament } from '@/components/ui/Ornament';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { SmartImage } from '@/components/ui/SmartImage';
import { formatPrice } from '@/utils/format';

const PILLARS = [
  {
    icon: Beef,
    title: 'La viande',
    text: 'Bœuf en pièces entières, tartare coupé au couteau, côte de bœuf pour deux.',
    to: '/la-viande',
    link: 'Voir les viandes',
  },
  {
    icon: Wine,
    title: 'La cave',
    text: `Plus de ${CELLAR.announcedReferences} références, de ${formatPrice(CELLAR.priceMin)} à ${formatPrice(CELLAR.priceMax)}.`,
    to: '/la-cave',
    link: 'Explorer la cave',
  },
  {
    icon: Users,
    title: 'La table',
    text: 'Des pièces à partager, une carte qui se prolonge dans la cave.',
    to: '/la-carte',
    link: 'Voir la carte',
  },
];

export default function Restaurant() {
  useSeo({
    title: 'Le Restaurant',
    description:
      "L'Aller Retour, c'est avant tout une histoire de viande, de vin et de convivialité. Découvrez l'esprit de la maison.",
  });

  return (
    <>
      <PageHero
        eyebrow="La maison"
        title="Le Restaurant"
        image={IMAGES.heroRestaurant}
        intro={
          <p>
            L'Aller Retour, c'est avant tout une histoire de viande, de vin et de convivialité.
          </p>
        }
      >
        <ReservationButton>Réserver une table</ReservationButton>
      </PageHero>

      {/* ------------------------------ L'ESPRIT ----------------------------- */}
      <Section spacing="lg" textured className="bg-noir">
        <div className="u-container relative z-10 grid items-center gap-14 lg:grid-cols-[0.9fr_1fr] lg:gap-20">
          <Reveal variant="left" className="relative order-2 lg:order-1">
            <span
              aria-hidden="true"
              className="absolute -top-4 -left-4 right-4 bottom-4 border border-or/25 sm:-top-6 sm:-left-6 sm:right-6 sm:bottom-6"
            />
            <SmartImage
              image={IMAGES.intro}
              className="relative aspect-[4/5] w-full"
              sizes="(min-width: 1024px) 42vw, 90vw"
            />
          </Reveal>

          <div className="order-1 lg:order-2">
            <SectionTitle
              eyebrow="L'esprit"
              title={
                <>
                  La viande et le vin,
                  <br />
                  <span className="text-or-clair italic">au centre</span> de la table
                </>
              }
              size="lg"
            />

            <Reveal delay={140}>
              <div className="mt-9 space-y-5 text-[0.975rem] leading-[1.9] text-sable sm:text-base">
                <p>
                  La carte est construite autour des belles pièces de bœuf : tartare coupé au
                  couteau, onglet, pavé d'Angus, noix d'entrecôte, filet, et la côte de bœuf
                  annoncée pour deux personnes.
                </p>
                <p>
                  En face, une véritable cave :{' '}
                  <span className="text-creme">
                    plus de {CELLAR.announcedReferences} références
                  </span>
                  , de {formatPrice(CELLAR.priceMin)} à {formatPrice(CELLAR.priceMax)}.
                </p>
                <p>
                  Et pour ceux qui ne viennent pas pour la viande, la salade du moment reste à la
                  carte.
                </p>
              </div>
            </Reveal>

            <Reveal delay={220}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button to="/la-carte">Découvrir la carte</Button>
                <Button to="/galerie" variant="outline">
                  La galerie
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ------------------------------ PILIERS ------------------------------ */}
      <Section spacing="lg" className="bg-charbon">
        <div className="u-container">
          <SectionTitle eyebrow="En trois mots" title="La maison" size="lg" align="center" />

          <ul className="mt-14 grid gap-6 md:grid-cols-3 lg:gap-8">
            {PILLARS.map((pillar, index) => (
              <Reveal key={pillar.title} as="li" delay={index * 120} className="h-full">
                <article className="group flex h-full flex-col items-center border border-or/12 bg-noir/40 px-7 py-12 text-center transition-colors duration-600 hover:border-or/35">
                  <pillar.icon
                    size={22}
                    strokeWidth={1}
                    aria-hidden="true"
                    className="text-or/75 transition-colors duration-500 group-hover:text-or-clair"
                  />
                  <h3 className="mt-6 font-display text-2xl text-creme">{pillar.title}</h3>
                  <Ornament className="mt-5 w-16" bare />
                  <p className="mt-5 flex-1 text-sm leading-relaxed text-sable">{pillar.text}</p>
                  <Button to={pillar.to} variant="ghost" size="sm" className="mt-6">
                    {pillar.link}
                  </Button>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* ------------------------------- APPEL ------------------------------- */}
      <Section spacing="md" textured className="bg-noir">
        <div className="u-container-narrow relative z-10 text-center">
          <Reveal>
            <h2 className="font-display text-[clamp(2rem,6vw,3.25rem)] leading-tight text-creme">
              Réserver une table
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <div className="mt-9 flex justify-center">
              <ReservationButton size="lg" />
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
