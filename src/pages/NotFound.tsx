import { useSeo } from '@/hooks/useSeo';
import { Button } from '@/components/ui/Button';
import { Ornament } from '@/components/ui/Ornament';

export default function NotFound() {
  useSeo({
    title: 'Page introuvable',
    description: "Cette page n'existe pas ou n'existe plus.",
  });

  return (
    <section className="grain flex min-h-[80svh] items-center bg-noir pt-32 pb-24">
      <div className="u-container-narrow relative z-10 text-center">
        <p className="eyebrow">Erreur 404</p>
        <h1 className="mt-6 font-display text-[clamp(2.5rem,9vw,5rem)] leading-tight text-creme">
          Page introuvable
        </h1>
        <Ornament className="mx-auto mt-8 max-w-xs" />
        <p className="mx-auto mt-8 max-w-md text-[0.9375rem] leading-relaxed text-sable">
          Cette page n'existe pas — ou plus. La carte et la cave, elles, sont toujours là.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
          <Button to="/">Retour à l'accueil</Button>
          <Button to="/la-carte" variant="outline">
            Voir la carte
          </Button>
        </div>
      </div>
    </section>
  );
}
