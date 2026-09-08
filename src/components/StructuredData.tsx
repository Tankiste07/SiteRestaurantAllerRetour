import { useEffect } from 'react';
import { buildRestaurantSchema } from '@/utils/schema';

const SCRIPT_ID = 'schema-restaurant';

/**
 * Injecte le JSON-LD « Restaurant » dans le <head>.
 * Le balisage s'enrichit tout seul au fur et à mesure que les informations
 * du restaurant sont renseignées dans `src/data/site.ts`.
 */
export function StructuredData() {
  useEffect(() => {
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(buildRestaurantSchema());
  }, []);

  return null;
}
