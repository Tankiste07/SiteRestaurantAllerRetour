import { desserts } from '@/data/menu';
import { MenuCard } from '../menu/MenuCard';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { SectionTitle } from '../ui/SectionTitle';
import { cn } from '@/utils/cn';

/**
 * Les desserts.
 * Le moelleux sans gluten est distingué par un filet doré plus marqué,
 * en complément de son étiquette « Sans gluten ».
 */
export function DessertsSection() {
  return (
    <Section id="desserts" spacing="lg" className="bg-charbon">
      <div className="u-container">
        <SectionTitle eyebrow="Pour finir" title="Desserts" size="lg" align="center" />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-7">
          {desserts.map((item, index) => {
            const highlighted = item.tags?.includes('SANS GLUTEN');
            return (
              <Reveal key={item.id} as="li" delay={index * 100} className="h-full">
                <MenuCard
                  item={item}
                  ratio="square"
                  className={cn(highlighted && 'border-or/40 hover:border-or/60')}
                />
              </Reveal>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
