import { IMAGES } from '@/data/images';
import { viandes } from '@/data/menu';
import { CELLAR } from '@/data/site';
import { useSeo } from '@/hooks/useSeo';
import { PageHero } from '@/components/layout/PageHero';
import { MenuCard } from '@/components/menu/MenuCard';
import { MenuGrid } from '@/components/menu/MenuGrid';
import { ReservationButton } from '@/components/ReservationButton';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';

/** Les pièces annoncées « pour 2 personnes » sur la carte. */
const toShare = viandes.filter((item) => Boolean(item.serves));
const others = viandes.filter((item) => !item.serves);

export default function Meat() {
  useSeo({
    title: 'La Viande',
    description:
      "Les viandes de L'Aller Retour : tartare de bœuf au couteau Charolais, onglet irlandais, pavé d'Angus, noix d'entrecôte d'Argentine, côte de bœuf pour deux.",
  });

  return (
    <>
      <PageHero
        eyebrow="Le cœur de la maison"
        title="La Viande"
        image={IMAGES.heroViande}
        intro={
          <p>
            Du tartare coupé au couteau à la côte de bœuf pour deux : les pièces de la carte, et
            une cave de plus de {CELLAR.announcedReferences} références pour les accompagner.
          </p>
        }
      >
        <ReservationButton>Réserver une table</ReservationButton>
      </PageHero>

      {/* ---------------------------- À PARTAGER ---------------------------- */}
      {toShare.length > 0 && (
        <Section spacing="lg" textured className="bg-noir">
          <div className="u-container relative z-10">
            <SectionTitle
              eyebrow="À partager"
              title="Les grandes pièces"
              size="lg"
              intro="Les pièces de la carte annoncées pour deux personnes."
            />

            <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:gap-8">
              {toShare.map((item, index) => (
                <Reveal key={item.id} as="li" delay={index * 120} className="h-full">
                  <MenuCard item={item} ratio="wide" className="border-or/25" />
                </Reveal>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {/* ------------------------- TOUTES LES PIÈCES ------------------------ */}
      <Section spacing="lg" className="bg-charbon">
        <div className="u-container">
          <SectionTitle eyebrow="La carte des viandes" title="Toutes les pièces" size="lg" />
          <MenuGrid items={others} ratio="wide" className="mt-14 md:mt-16" />
        </div>
      </Section>

      {/* ---------------------------- ACCORD VIN ---------------------------- */}
      <Section spacing="md" textured className="bg-noir">
        <div className="u-container-narrow relative z-10 text-center">
          <Reveal>
            <p className="eyebrow">L'accord</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-6 font-display text-[clamp(2rem,6vw,3.5rem)] leading-tight text-creme">
              Une viande, une bouteille
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="mx-auto mt-6 max-w-xl text-[0.975rem] leading-[1.9] text-sable">
              La cave compte plus de {CELLAR.announcedReferences} références. Parcourez-la par
              région, appellation ou millésime.
            </p>
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              <Button to="/la-cave" size="lg">
                Explorer la cave
              </Button>
              <Button to="/la-carte" variant="outline" size="lg">
                Voir toute la carte
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
