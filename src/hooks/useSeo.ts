import { useEffect } from 'react';
import { SITE_NAME } from '@/data/site';

interface SeoOptions {
  /** Titre de la page, sans le nom du restaurant (ajouté automatiquement). */
  title: string;
  description: string;
}

function setMeta(selector: string, attribute: string, value: string): void {
  const tag = document.head.querySelector(selector);
  if (tag) tag.setAttribute(attribute, value);
}

/**
 * Met à jour le titre et la meta description à chaque changement de page.
 * Le site étant une SPA, ces balises doivent être pilotées côté client.
 */
export function useSeo({ title, description }: SeoOptions): void {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Viandes & Vins`;
    document.title = fullTitle;

    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', description);
  }, [title, description]);
}
