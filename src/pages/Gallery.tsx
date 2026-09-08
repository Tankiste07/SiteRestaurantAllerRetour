import { useMemo, useState } from 'react';
import { Expand } from 'lucide-react';
import { GALLERY_CATEGORIES, galleryItems, type GalleryCategoryId } from '@/data/gallery';
import { IMAGES } from '@/data/images';
import { useSeo } from '@/hooks/useSeo';
import { cn } from '@/utils/cn';
import { Lightbox } from '@/components/gallery/Lightbox';
import { PageHero } from '@/components/layout/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SmartImage } from '@/components/ui/SmartImage';

type Filter = GalleryCategoryId | 'tout';

export default function Gallery() {
  useSeo({
    title: 'Galerie',
    description:
      "Le restaurant, les viandes, la cave et les desserts de L'Aller Retour en images.",
  });

  const [filter, setFilter] = useState<Filter>('tout');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = useMemo(
    () => (filter === 'tout' ? galleryItems : galleryItems.filter((i) => i.category === filter)),
    [filter],
  );

  const images = useMemo(() => items.map((item) => IMAGES[item.imageKey]), [items]);

  const changeFilter = (next: Filter) => {
    setFilter(next);
    setOpenIndex(null);
  };

  return (
    <>
      <PageHero
        eyebrow="En images"
        title="Galerie"
        image={IMAGES.galerieSalle1}
        size="sm"
        intro={
          <p>
            La salle, les pièces de viande, la cave et les desserts.
          </p>
        }
      />

      <Section spacing="md" textured className="bg-noir">
        <div className="u-container relative z-10">
          {/* ---------------------- Catégories ---------------------- */}
          <nav aria-label="Catégories de la galerie">
            <ul className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {[{ id: 'tout' as const, label: 'Tout' }, ...GALLERY_CATEGORIES].map((category) => (
                <li key={category.id}>
                  <button
                    type="button"
                    onClick={() => changeFilter(category.id)}
                    aria-pressed={filter === category.id}
                    className={cn(
                      'border px-5 py-2.5 font-sans text-[0.625rem] font-medium tracking-[0.22em] uppercase transition-colors duration-400',
                      filter === category.id
                        ? 'border-or/55 bg-or/10 text-or-clair'
                        : 'border-or/18 text-sable hover:border-or/40 hover:text-creme',
                    )}
                  >
                    {category.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* ---------------------- Grille ---------------------- */}
          <ul className="mt-12 grid auto-rows-[minmax(0,1fr)] grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {items.map((item, index) => {
              const image = IMAGES[item.imageKey];
              return (
                <Reveal
                  key={item.id}
                  as="li"
                  delay={(index % 4) * 80}
                  threshold={0.05}
                  className={cn(item.wide && 'lg:col-span-2')}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(index)}
                    className="group relative block w-full overflow-hidden border border-or/12 transition-colors duration-500 hover:border-or/35"
                  >
                    <SmartImage
                      image={image}
                      className={cn('w-full', item.wide ? 'aspect-[16/10]' : 'aspect-square')}
                      imgClassName="transition-transform duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                      sizes="(min-width: 1024px) 25vw, 50vw"
                    />

                    {/* Voile + libellé au survol */}
                    <span className="absolute inset-0 flex items-end justify-between gap-3 bg-gradient-to-t from-noir/85 via-noir/10 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                      <span className="text-left font-sans text-[0.625rem] leading-snug tracking-[0.16em] text-creme uppercase">
                        {image.alt}
                      </span>
                      <Expand
                        size={15}
                        strokeWidth={1.3}
                        aria-hidden="true"
                        className="shrink-0 text-or-clair"
                      />
                    </span>

                    <span className="sr-only">Agrandir : {image.alt}</span>
                  </button>
                </Reveal>
              );
            })}
          </ul>

          <p className="mt-10 text-center text-xs leading-relaxed text-cendre">
            {/* Mention transparente tant que les photographies réelles ne sont pas fournies. */}
            Les photographies du restaurant seront ajoutées prochainement.
          </p>
        </div>
      </Section>

      <Lightbox
        images={images}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </>
  );
}
