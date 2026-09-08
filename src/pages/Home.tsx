import { CELLAR, SITE_DESCRIPTION } from '@/data/site';
import { useSeo } from '@/hooks/useSeo';
import { CaveTeaser } from '@/components/home/CaveTeaser';
import { ContactTeaser } from '@/components/home/ContactTeaser';
import { DessertsSection } from '@/components/home/DessertsSection';
import { Hero } from '@/components/home/Hero';
import { Intro } from '@/components/home/Intro';
import { MeatSection } from '@/components/home/MeatSection';
import { NonCarnivores } from '@/components/home/NonCarnivores';
import { StartersSection } from '@/components/home/StartersSection';

export default function Home() {
  useSeo({
    title: '',
    description: `${SITE_DESCRIPTION} Cave de plus de ${CELLAR.announcedReferences} références.`,
  });

  return (
    <>
      <Hero />
      <Intro />
      <MeatSection />
      <NonCarnivores />
      <StartersSection />
      <DessertsSection />
      <CaveTeaser />
      <ContactTeaser />
    </>
  );
}
