import type { ReactNode } from 'react';
import { IMAGES } from '@/data/images';
import { desserts, entrees, nonCarnivores, viandes } from '@/data/menu';
import { useSeo } from '@/hooks/useSeo';
import { MenuList } from '@/components/menu/MenuList';
import { MenuNav } from '@/components/menu/MenuNav';
import { PageHero } from '@/components/layout/PageHero';
import { ReservationButton } from '@/components/ReservationButton';
import { Button } from '@/components/ui/Button';
import { Ornament } from '@/components/ui/Ornament';
import { Reveal } from '@/components/ui/Reveal';
import { SectionTitle } from '@/components/ui/SectionTitle';

const SECTIONS = [
  { id: 'entrees', label: 'Entrées' },
  { id: 'plats', label: 'Plats' },
  { id: 'desserts', label: 'Desserts' },
];

export default function Menu() {
  useSeo({
    title: 'La Carte',
    description:
      "Entrées, viandes rouges et desserts de L'Aller Retour : tartare au couteau, côte de bœuf pour deux, os à moelle, moelleux aux noisettes sans gluten.",
  });

  return (
    <>
      <PageHero
        eyebrow="Entrées · Plats · Desserts"
        title="La Carte"
        image={IMAGES.heroCarte}
        size="sm"
        intro={
          <p>
            La carte de la maison, telle qu'elle est servie en salle. Les viandes en occupent le
            cœur ; la cave fait le reste.
          </p>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <ReservationButton>Réserver une table</ReservationButton>
          <Button to="/la-cave" variant="outline">
            La carte des vins
          </Button>
        </div>
      </PageHero>

      <MenuNav sections={SECTIONS} />

      {/* ------------------------------ ENTRÉES ------------------------------ */}
      <MenuSection id="entrees" eyebrow="Pour commencer" title="Entrées" tone="noir">
        <MenuList items={entrees} columns={2} />
      </MenuSection>

      {/* ------------------------------- PLATS ------------------------------- */}
      <MenuSection
        id="plats"
        eyebrow="Le cœur de la maison"
        title="Plats"
        tone="charbon"
      >
        <MenuList items={viandes} columns={2} />

        {/* Sous-section volontairement plus discrète, mais bien identifiée. */}
        <Reveal delay={120} className="mt-16">
          <div className="border border-or/18 bg-noir/45 px-6 py-8 sm:px-10">
            <h3 className="eyebrow">Pour les non-carnivores</h3>
            <MenuList items={nonCarnivores} className="mt-2" />
          </div>
        </Reveal>
      </MenuSection>

      {/* ----------------------------- DESSERTS ------------------------------ */}
      <MenuSection id="desserts" eyebrow="Pour finir" title="Desserts" tone="noir">
        <MenuList items={desserts} columns={2} />
      </MenuSection>

      {/* ------------------------------ RAPPEL ------------------------------- */}
      <section className="border-t border-or/12 bg-charbon py-16 md:py-20">
        <div className="u-container-narrow text-center">
          <Reveal>
            <p className="font-display text-2xl leading-snug text-creme sm:text-3xl">
              Une table vous attend.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-8 flex justify-center">
              <ReservationButton size="lg">Réserver une table</ReservationButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* -------------------------------------------------------------------------- */

interface MenuSectionProps {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  tone: 'noir' | 'charbon';
  children: ReactNode;
}

/** Une catégorie de la carte, présentée comme une page de menu imprimé. */
function MenuSection({ id, eyebrow, title, intro, tone, children }: MenuSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`titre-${id}`}
      className={`grain scroll-mt-32 py-20 md:py-28 ${tone === 'noir' ? 'bg-noir' : 'bg-charbon'}`}
    >
      <div className="u-container relative z-10">
        <SectionTitle
          id={`titre-${id}`}
          eyebrow={eyebrow}
          title={title}
          size="lg"
          align="center"
          intro={intro}
        />

        <Reveal delay={140} className="mx-auto mt-12 max-w-5xl md:mt-16">
          <div className="relative border border-or/18 bg-charbon/40 px-6 py-8 sm:px-10 sm:py-12 md:px-14">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-2 border border-or/8 sm:inset-3"
            />
            <div className="relative">
              {children}
              <Ornament className="mt-12" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
