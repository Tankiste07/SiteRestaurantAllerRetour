import { viandes } from '@/data/menu';
import { MenuGrid } from '../menu/MenuGrid';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { SectionTitle } from '../ui/SectionTitle';

/**
 * Le cœur du site : la viande.
 * Toutes les pièces de la carte sont présentées, sans hiérarchie inventée.
 */
export function MeatSection() {
  return (
    <Section id="la-viande" spacing="lg" textured className="bg-charbon">
      {/* Lueur de braise, en haut de section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-96 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(60% 100% at 50% 0%, rgba(125,22,38,0.28) 0%, rgba(125,22,38,0) 70%)',
        }}
      />

      <div className="u-container relative z-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionTitle
            eyebrow="Le cœur de la maison"
            title="La Viande"
            size="lg"
            intro="Les pièces de la carte, du tartare au couteau à la côte de bœuf pour deux."
          />

          <Reveal delay={220} className="shrink-0">
            <Button to="/la-carte" variant="outline">
              Voir toute la carte
            </Button>
          </Reveal>
        </div>

        {/* Format « wide », proche du cadrage des photographies : un ratio
            trop haut (« tall ») recadrerait excessivement des photos
            naturellement panoramiques (assiette, accompagnements). */}
        <MenuGrid items={viandes} ratio="wide" className="mt-14 md:mt-16" />
      </div>
    </Section>
  );
}
