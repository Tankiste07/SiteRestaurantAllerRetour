import { IMAGES } from '@/data/images';
import { nonCarnivores } from '@/data/menu';
import { EyebrowRule } from '../ui/Ornament';
import { Price } from '../menu/Price';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { SmartImage } from '../ui/SmartImage';

/**
 * Section volontairement plus modeste que celle consacrée à la viande,
 * mais parfaitement lisible et accessible.
 */
export function NonCarnivores() {
  return (
    <Section id="non-carnivores" spacing="sm" className="bg-noir">
      <div className="u-container">
        <Reveal className="mx-auto max-w-3xl">
          <div className="group flex flex-col items-stretch border border-or/15 bg-charbon/50 transition-colors duration-600 hover:border-or/30 sm:flex-row">
            <SmartImage
              image={IMAGES.salade}
              className="aspect-[16/9] w-full shrink-0 sm:aspect-square sm:w-44 md:w-52"
              imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
              sizes="(min-width: 640px) 13rem, 90vw"
            />

            <div className="flex flex-1 flex-col justify-center p-6 sm:p-8">
              <p className="flex items-center gap-3">
                <EyebrowRule />
                <span className="eyebrow">Pour les non-carnivores</span>
              </p>

              {nonCarnivores.map((item) => (
                <div
                  key={item.id}
                  className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-2"
                >
                  <h2 className="font-display text-2xl text-creme transition-colors duration-500 group-hover:text-or-clair sm:text-[1.75rem]">
                    {item.name}
                  </h2>
                  <span aria-hidden="true" className="dot-leader hidden sm:block" />
                  <Price item={item} size="lg" className="ml-auto sm:ml-0" />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
