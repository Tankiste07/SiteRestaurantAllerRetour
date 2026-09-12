import type { Wine } from '@/data/wines';
import { SectionTitle } from '../ui/SectionTitle';
import { Reveal } from '../ui/Reveal';
import { WineCard } from './WineCard';

interface WineSectionProps {
  id: string;
  title: string;
  wines: Wine[];
  /** Sous-titre (Blancs et Rouges) — visuellement plus discret qu'un titre de catégorie. */
  sub?: boolean;
}

/** Une section (ou sous-section) de la carte : titre ancrable + grille de fiches. */
export function WineSection({ id, title, wines, sub }: WineSectionProps) {
  if (wines.length === 0) return null;

  return (
    <div id={id} className="scroll-mt-28">
      <SectionTitle
        as={sub ? 'h3' : 'h2'}
        size={sub ? 'sm' : 'md'}
        eyebrow={sub ? undefined : `${wines.length} référence${wines.length > 1 ? 's' : ''}`}
        title={title}
      />

      <ul className={sub ? 'mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3' : 'mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3'}>
        {wines.map((wine, index) => (
          <Reveal key={wine.id} as="li" delay={(index % 3) * 90} threshold={0.05} className="h-full">
            <WineCard wine={wine} />
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
