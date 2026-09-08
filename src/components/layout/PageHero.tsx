import type { ReactNode } from 'react';
import type { ImageAsset } from '@/data/images';
import { useParallax } from '@/hooks/useParallax';
import { cn } from '@/utils/cn';
import { EyebrowRule } from '../ui/Ornament';
import { SmartImage } from '../ui/SmartImage';

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  image: ImageAsset;
  children?: ReactNode;
  /** Hauteur du bandeau. */
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Ouverture des pages intérieures : image plein cadre, titre en serif,
 * hauteur mesurée pour ne pas repousser le contenu trop bas.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  children,
  size = 'md',
  className,
}: PageHeroProps) {
  const parallaxRef = useParallax<HTMLDivElement>(0.14);

  return (
    // Figé en sombre : le texte clair repose sur une photo, quel que soit
    // le thème du site.
    <section
      data-theme="dark"
      className={cn(
        'relative flex items-end overflow-hidden',
        size === 'sm' ? 'min-h-[52vh] md:min-h-[58vh]' : 'min-h-[64vh] md:min-h-[72vh]',
        className,
      )}
    >
      <div className="absolute inset-0 -z-10">
        <div ref={parallaxRef} className="absolute -inset-x-0 -top-[10%] h-[120%]">
          <SmartImage image={image} priority className="h-full w-full" sizes="100vw" />
        </div>
        <div className="scrim absolute inset-0" />
      </div>

      <div className="u-container relative z-10 pt-36 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="flex items-center gap-3 motion-safe:animate-[ar-fade-up_0.9s_cubic-bezier(0.22,1,0.36,1)_0.1s_both]">
              <EyebrowRule />
              <span className="eyebrow">{eyebrow}</span>
            </p>
          )}

          <h1 className="mt-6 font-display text-[clamp(2.5rem,9vw,5.5rem)] leading-[0.98] font-light tracking-[0.02em] text-creme uppercase motion-safe:animate-[ar-fade-up_1s_cubic-bezier(0.22,1,0.36,1)_0.22s_both]">
            {title}
          </h1>

          {intro && (
            <div className="mt-7 max-w-xl text-[0.975rem] leading-[1.85] text-ivoire/85 sm:text-base motion-safe:animate-[ar-fade-up_1s_cubic-bezier(0.22,1,0.36,1)_0.38s_both]">
              {intro}
            </div>
          )}

          {children && (
            <div className="mt-9 motion-safe:animate-[ar-fade-up_1s_cubic-bezier(0.22,1,0.36,1)_0.5s_both]">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
