import type { SocialLink } from '@/data/site';

/**
 * Marques des réseaux sociaux, dessinées au trait pour rester cohérentes
 * avec le reste de l'iconographie du site (Lucide ne fournit plus les
 * icônes de marque depuis sa version 1).
 */
export function SocialIcon({ name, size = 16 }: { name: SocialLink['icon']; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.35,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (name === 'instagram') {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === 'facebook') {
    return (
      <svg {...common}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    );
  }

  /* Tripadvisor */
  return (
    <svg {...common}>
      <circle cx="7" cy="13" r="4" />
      <circle cx="17" cy="13" r="4" />
      <circle cx="7" cy="13" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="17" cy="13" r="1.1" fill="currentColor" stroke="none" />
      <path d="M9.4 10.2 12 7l2.6 3.2" />
    </svg>
  );
}
