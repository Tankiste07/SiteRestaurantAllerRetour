import type { ReactNode } from 'react';
import { EyebrowRule } from '../ui/Ornament';
import { Reveal } from '../ui/Reveal';

interface LegalLayoutProps {
  eyebrow: string;
  title: string;
  children: ReactNode;
}

/** Gabarit sobre des pages légales : lecture confortable, pas de décor superflu. */
export function LegalLayout({ eyebrow, title, children }: LegalLayoutProps) {
  return (
    <article className="grain bg-noir pt-36 pb-24 md:pt-44 md:pb-32">
      <div className="u-container-narrow relative z-10">
        <header>
          <p className="flex items-center gap-3">
            <EyebrowRule />
            <span className="eyebrow">{eyebrow}</span>
          </p>
          <h1 className="mt-6 font-display text-[clamp(2.25rem,7vw,4rem)] leading-tight text-creme">
            {title}
          </h1>
        </header>

        <div className="mt-14 space-y-12">{children}</div>
      </div>
    </article>
  );
}

interface LegalBlockProps {
  title: string;
  children: ReactNode;
}

export function LegalBlock({ title, children }: LegalBlockProps) {
  return (
    <Reveal>
      <section className="border-t border-or/12 pt-8">
        <h2 className="font-display text-2xl text-creme sm:text-[1.75rem]">{title}</h2>
        <div className="mt-4 space-y-2.5 text-[0.9375rem] leading-[1.85] text-sable">
          {children}
        </div>
      </section>
    </Reveal>
  );
}
