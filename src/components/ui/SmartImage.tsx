import { useState } from 'react';
import type { ImageAsset, ImageMotif, ImageTone } from '@/data/images';
import { cn } from '@/utils/cn';

/* -------------------------------------------------------------------------- */
/*  AMBIANCES CHROMATIQUES                                                     */
/* -------------------------------------------------------------------------- */

const TONE_BACKGROUND: Record<ImageTone, string> = {
  braise: [
    'radial-gradient(120% 90% at 22% 88%, rgba(161,44,44,0.42) 0%, rgba(161,44,44,0) 58%)',
    'radial-gradient(90% 70% at 78% 10%, rgba(184,151,79,0.16) 0%, rgba(184,151,79,0) 62%)',
    'linear-gradient(160deg, #2a1d16 0%, #150f0d 46%, #0a0908 100%)',
  ].join(','),
  cave: [
    'radial-gradient(100% 80% at 50% 112%, rgba(94,15,28,0.42) 0%, rgba(94,15,28,0) 62%)',
    'radial-gradient(70% 60% at 18% 6%, rgba(184,151,79,0.15) 0%, rgba(184,151,79,0) 66%)',
    'linear-gradient(200deg, #1b1411 0%, #0f0c0b 55%, #080706 100%)',
  ].join(','),
  salle: [
    'radial-gradient(80% 60% at 50% -6%, rgba(214,187,126,0.22) 0%, rgba(214,187,126,0) 62%)',
    'radial-gradient(90% 70% at 86% 96%, rgba(74,53,39,0.55) 0%, rgba(74,53,39,0) 60%)',
    'linear-gradient(180deg, #261c15 0%, #15110f 60%, #0a0908 100%)',
  ].join(','),
  bois: [
    'radial-gradient(90% 70% at 28% 18%, rgba(74,53,39,0.6) 0%, rgba(74,53,39,0) 62%)',
    'radial-gradient(80% 60% at 82% 102%, rgba(125,22,38,0.24) 0%, rgba(125,22,38,0) 60%)',
    'linear-gradient(150deg, #2c2018 0%, #181310 55%, #0d0b0a 100%)',
  ].join(','),
  nappe: [
    'radial-gradient(85% 65% at 50% 12%, rgba(244,237,226,0.14) 0%, rgba(244,237,226,0) 62%)',
    'radial-gradient(80% 60% at 14% 98%, rgba(74,53,39,0.45) 0%, rgba(74,53,39,0) 60%)',
    'linear-gradient(170deg, #28221d 0%, #191513 58%, #0c0b0a 100%)',
  ].join(','),
};

/* -------------------------------------------------------------------------- */
/*  GRAVURES AU TRAIT                                                          */
/* -------------------------------------------------------------------------- */

/** Motifs dessinés au trait, dans l'esprit d'une gravure de menu ancien. */
const MOTIF_PATHS: Record<ImageMotif, string[]> = {
  steak: [
    'M22 62C22 40 44 27 66 29c24 2 34 19 30 37-4 18-24 28-44 26S22 80 22 62Z',
    'M40 55c10-6 22-5 30 2',
    'M44 70c11-7 24-5 33 2',
  ],
  cote: [
    'M28 62C28 41 48 29 68 33c16 3 24 17 20 31-4 17-24 27-42 23-14-3-18-13-18-25Z',
    'M88 52c9-4 16 1 14 10-2 8-10 11-15 7',
    'M87 62 71 61',
  ],
  tartare: [
    'M60 16a44 44 0 1 0 .1 0Z',
    'M38 70c3-14 15-21 22-21s19 7 22 21Z',
    'M50 58c4-4 16-4 20 0',
  ],
  bouteille: [
    'M52 14h16v20c0 7 10 12 10 27v42a7 7 0 0 1-7 7H49a7 7 0 0 1-7-7V61c0-15 10-20 10-27Z',
    'M42 72h36',
    'M42 92h36',
    'M55 14h10',
  ],
  verre: [
    'M38 24h44c0 24-9 37-22 39-13-2-22-15-22-39Z',
    'M60 63v27',
    'M43 92h34',
    'M44 40h32',
  ],
  fromage: ['M22 84 82 38l14 13v33Z', 'M82 38v13h14', 'M44 74a4 4 0 1 0 .1 0Z', 'M62 62a5 5 0 1 0 .1 0Z'],
  dessert: [
    'M28 76c0-22 64-22 64 0',
    'M18 80h84',
    'M60 44c-4-6 2-10 0-14',
    'M40 68c8-6 32-6 40 0',
  ],
  salade: [
    'M24 54c0 28 72 28 72 0Z',
    'M46 50c-2-14 8-22 16-19',
    'M62 50c8-12 20-11 24-4',
    'M36 50c-6-8-2-15 4-16',
  ],
  escargot: [
    'M60 20a40 40 0 1 1-.1 0Z',
    'M62 34a26 26 0 1 0 .1 0Z',
    'M58 48a13 13 0 1 1-.1 0Z',
    'M60 60h4',
  ],
  os: ['M60 18a42 42 0 1 0 .1 0Z', 'M60 44a16 16 0 1 0 .1 0Z', 'M60 18v10', 'M60 92v-10'],
  assiette: ['M60 16a44 44 0 1 0 .1 0Z', 'M60 30a30 30 0 1 0 .1 0Z'],
  salle: [
    'M20 96V54a40 40 0 0 1 80 0v42',
    'M60 10v14',
    'M47 24h26l-7 14H54Z',
    'M34 96V62a26 26 0 0 1 52 0v34',
  ],
  flamme: [
    'M60 16c14 23 28 29 28 49a28 28 0 0 1-56 0c0-20 14-26 28-49Z',
    'M60 48c8 12 12 14 12 24a12 12 0 0 1-24 0c0-10 4-12 12-24Z',
  ],
};

interface PlaceholderArtProps {
  tone: ImageTone;
  motif: ImageMotif;
  /** Le motif est masqué sur les très petites vignettes. */
  showMotif?: boolean;
}

/**
 * Visuel de substitution — généré, sans requête réseau, jamais cassé.
 * Il disparaît automatiquement dès qu'une vraie photo est renseignée
 * dans `src/data/images.ts`.
 */
function PlaceholderArt({ tone, motif, showMotif = true }: PlaceholderArtProps) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 grain overflow-hidden"
      style={{ backgroundImage: TONE_BACKGROUND[tone] }}
    >
      {showMotif && (
        <svg
          viewBox="0 0 120 120"
          className="absolute top-1/2 left-1/2 h-[46%] max-h-40 w-auto -translate-x-1/2 -translate-y-1/2 text-or"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.15}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.22}
        >
          {MOTIF_PATHS[motif].map((d) => (
            <path key={d} d={d} />
          ))}
        </svg>
      )}
      {/* Vignettage : concentre le regard, assombrit les bords */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(120% 100% at 50% 45%, rgba(0,0,0,0) 32%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  COMPOSANT PUBLIC                                                           */
/* -------------------------------------------------------------------------- */

interface SmartImageProps {
  image: ImageAsset;
  /** Classes du conteneur (doit porter la taille et `relative`). */
  className?: string;
  /** Classes appliquées à la photo réelle (cadrage, zoom au survol…). */
  imgClassName?: string;
  /** Chargement immédiat — à réserver au premier écran. */
  priority?: boolean;
  /** Masque la gravure (petites vignettes). */
  showMotif?: boolean;
  /** Cadrage de la photo réelle. `contain` pour la visionneuse plein écran. */
  fit?: 'cover' | 'contain';
  sizes?: string;
}

/**
 * Affiche la photographie réelle si elle existe, sinon un visuel de
 * substitution dessiné. Bascule également sur le visuel de substitution
 * si le chargement de la photo échoue : aucune image cassée n'est possible.
 */
export function SmartImage({
  image,
  className,
  imgClassName,
  priority = false,
  showMotif = true,
  fit = 'cover',
  sizes,
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const usePhoto = Boolean(image.src) && !failed;

  return (
    <div className={cn('relative overflow-hidden bg-charbon', className)}>
      {/* Le visuel généré reste en fond : il sert d'écran de chargement
          à la photo réelle, évitant tout aplat vide. */}
      <PlaceholderArt tone={image.tone} motif={image.motif} showMotif={showMotif} />

      {usePhoto && (
        <img
          src={image.src}
          alt={image.alt}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            'absolute inset-0 h-full w-full transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
            fit === 'contain' ? 'object-contain' : 'object-cover',
            loaded ? 'opacity-100' : 'opacity-0',
            imgClassName,
          )}
        />
      )}
    </div>
  );
}
