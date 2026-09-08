import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';

interface MenuNavProps {
  sections: { id: string; label: string }[];
}

/**
 * Sommaire collant de la carte, avec repérage de la section courante.
 * Il défile horizontalement sur mobile pour rester atteignable au pouce.
 */
export function MenuNav({ sections }: MenuNavProps) {
  const [active, setActive] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      // La bande active correspond au tiers supérieur de l'écran.
      { rootMargin: '-25% 0px -60% 0px', threshold: 0 },
    );

    for (const section of sections) {
      const node = document.getElementById(section.id);
      if (node) observer.observe(node);
    }

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="Sommaire de la carte"
      className="sticky top-[4.5rem] z-30 border-y border-or/12 bg-noir/92 backdrop-blur-xl md:top-[5.25rem]"
    >
      <ul className="u-container flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] sm:justify-center sm:gap-3 [&::-webkit-scrollbar]:hidden">
        {sections.map((section) => (
          <li key={section.id} className="shrink-0">
            <a
              href={`#${section.id}`}
              aria-current={active === section.id ? 'true' : undefined}
              className={cn(
                'block border px-4 py-2.5 font-sans text-[0.625rem] font-medium tracking-[0.22em] uppercase transition-colors duration-400 sm:px-5',
                active === section.id
                  ? 'border-or/50 bg-or/10 text-or-clair'
                  : 'border-transparent text-sable hover:border-or/25 hover:text-creme',
              )}
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
