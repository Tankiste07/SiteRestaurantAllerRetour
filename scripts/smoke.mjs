/**
 * TEST DE FUMÉE
 * ---------------------------------------------------------------------------
 * Monte réellement l'application dans un DOM (jsdom) et vérifie, page par
 * page, qu'elle rend du contenu, un <h1> unique et le bon <title>, sans
 * erreur console.
 *
 *   npm i --no-save jsdom
 *   npx vite build --config scripts/vite.smoke.config.ts
 *   node scripts/smoke.mjs
 *
 * jsdom ne sachant pas exécuter les modules ESM, le test s'appuie sur un
 * bundle IIFE dédié (`dist-smoke/app.js`) — jamais sur le build de production.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { JSDOM, VirtualConsole } from 'jsdom';

const BUNDLE = readFileSync(fileURLToPath(new URL('../dist-smoke/app.js', import.meta.url)), 'utf8');

const ROUTES = [
  { path: '/', h1: 'aller' },
  { path: '/le-restaurant', h1: 'Le Restaurant' },
  { path: '/la-carte', h1: 'La Carte' },
  { path: '/la-viande', h1: 'La Viande' },
  { path: '/la-cave', h1: 'La Cave' },
  { path: '/galerie', h1: 'Galerie' },
  { path: '/contact', h1: 'Venir' },
  { path: '/mentions-legales', h1: 'Mentions' },
  { path: '/confidentialite', h1: 'confidentialité' },
  { path: '/route-inexistante', h1: 'introuvable' },
];

const SHELL = `<!doctype html><html lang="fr"><head>
  <title>L'Aller Retour — Viandes &amp; Vins</title>
  <meta name="description" content="">
  <meta property="og:title" content=""><meta property="og:description" content="">
  <meta name="twitter:title" content=""><meta name="twitter:description" content="">
</head><body><div id="root"></div></body></html>`;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let failures = 0;

for (const route of ROUTES) {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', (e) => errors.push(e.message));
  virtualConsole.on('error', (...args) => errors.push(args.map(String).join(' ')));

  const dom = new JSDOM(SHELL, {
    url: `http://localhost${route.path}`,
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    virtualConsole,
  });

  const { window } = dom;

  // Compléments absents de jsdom, présents dans tout navigateur moderne.
  // MessageChannel est indispensable : c'est le canal utilisé par le
  // planificateur de React pour vider les effets.
  window.MessageChannel = MessageChannel;
  window.queueMicrotask = queueMicrotask;
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  window.scrollTo = () => {};
  if (!window.matchMedia) {
    window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  }

  try {
    window.eval(BUNDLE);
    await window.__monter(route.path);
    await wait(50);

    const { document } = window;
    const root = document.getElementById('root');
    const text = (root?.textContent ?? '').replace(/\s+/g, ' ').trim();
    const headings = [...document.querySelectorAll('h1')];
    const h1 = headings[0]?.textContent?.replace(/\s+/g, ' ').trim() ?? '';

    const problems = [];
    if (text.length < 300) problems.push(`contenu trop court (${text.length} car.)`);
    if (headings.length === 0) problems.push('aucun <h1>');
    if (headings.length > 1) problems.push(`${headings.length} <h1> (un seul attendu)`);
    if (h1 && !h1.toLowerCase().includes(route.h1.toLowerCase())) {
      problems.push(`h1 inattendu : "${h1}"`);
    }
    if (!document.title.includes("L'Aller Retour")) problems.push(`titre : "${document.title}"`);
    if (!document.querySelector('script[type="application/ld+json"]')) {
      problems.push('JSON-LD absent');
    }
    if (errors.length) problems.push(`console : ${errors.slice(0, 2).join(' | ')}`);

    if (problems.length) {
      failures += 1;
      console.log(`ECHEC ${route.path.padEnd(20)} ${problems.join(' ; ')}`);
    } else {
      console.log(
        `OK    ${route.path.padEnd(20)} h1="${h1}" · ${text.length} car. · "${document.title}"`,
      );
    }
  } catch (error) {
    failures += 1;
    console.log(`ECHEC ${route.path.padEnd(20)} ${error.message}`);
  } finally {
    window.close();
  }
}

console.log(
  failures === 0
    ? '\nToutes les pages se montent correctement.'
    : `\n${failures} page(s) en échec.`,
);

/* -------------------------------------------------------------------------- */
/*  LA CAVE — vérifie que la carte structurée par catégories s'affiche         */
/*  (toutes les sections de la carte papier), sans erreur console.             */
/* -------------------------------------------------------------------------- */

console.log('\nPage La Cave :');

{
  const virtualConsole = new VirtualConsole();
  const errors = [];
  virtualConsole.on('jsdomError', (e) => errors.push(e.message));
  virtualConsole.on('error', (...a) => errors.push(a.map(String).join(' ')));

  const dom = new JSDOM(SHELL, {
    url: 'http://localhost/la-cave',
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    virtualConsole,
  });
  const { window } = dom;
  window.MessageChannel = MessageChannel;
  window.queueMicrotask = queueMicrotask;
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  window.scrollTo = () => {};
  if (!window.matchMedia) {
    window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  }

  const check = (label, condition, detail) => {
    if (condition) {
      console.log(`OK    ${label.padEnd(38)} ${detail}`);
    } else {
      failures += 1;
      console.log(`ECHEC ${label.padEnd(38)} ${detail}`);
    }
  };

  try {
    window.eval(BUNDLE);
    await window.__monter('/la-cave');

    const { document } = window;
    const text = document.body.textContent;

    const sections = ['Pet Nat / Crémant', 'Champagne', 'Vins Blancs', 'Macérations', 'Rosé', 'Vins rouges'];
    const missing = sections.filter((s) => !text.includes(s));
    check('sections de la carte affichées', missing.length === 0, missing.length ? `manquantes : ${missing.join(', ')}` : `${sections.length} sections`);

    const cards = document.querySelectorAll('article').length;
    check('bouteilles rendues', cards > 0, `${cards} fiches`);

    if (errors.length) {
      failures += 1;
      console.log(`ECHEC console                                ${errors.slice(0, 2).join(' | ')}`);
    }
  } catch (error) {
    failures += 1;
    console.log(`ECHEC page cave                              ${error.message}`);
  } finally {
    window.close();
  }
}

console.log(failures === 0 ? '\nTest de fumée : tout est vert.' : `\n${failures} échec(s).`);
process.exit(failures === 0 ? 0 : 1);
