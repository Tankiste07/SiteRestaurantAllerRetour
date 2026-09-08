import { entrees } from '@/data/menu';
import { MenuList } from '../menu/MenuList';
import { Ornament } from '../ui/Ornament';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { SectionTitle } from '../ui/SectionTitle';

/**
 * Les entrées, présentées comme la page d'une carte imprimée :
 * filets dorés, conduites pointillées, papier sombre.
 */
export function StartersSection() {
  return (
    <Section id="entrees" spacing="lg" textured className="bg-noir">
      <div className="u-container relative z-10">
        <SectionTitle eyebrow="Pour commencer" title="Entrées" size="lg" align="center" />

        <Reveal delay={140} className="mx-auto mt-14 max-w-4xl md:mt-16">
          <div className="relative border border-or/18 bg-charbon/45 px-6 py-8 sm:px-10 sm:py-12 md:px-14">
            {/* Filet intérieur : effet de carte imprimée */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-2 border border-or/8 sm:inset-3"
            />
            <div className="relative">
              <MenuList items={entrees} columns={2} />
              <Ornament className="mt-10" />
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
