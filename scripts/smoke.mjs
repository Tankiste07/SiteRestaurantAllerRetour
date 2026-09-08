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
/*  LA CAVE — parcours complet : recherche, filtre, tri, réinitialisation      */
/* -------------------------------------------------------------------------- */

console.log('\nParcours de la cave :');

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
    const cards = () => document.querySelectorAll('article').length;
    /* Compteur de résultats annoncé aux lecteurs d'écran (zone aria-live). */
    const announced = () => {
      const node = document.querySelector('p[aria-live="polite"]');
      return Number((node?.textContent ?? '').match(/\d+/)?.[0] ?? -1);
    };

    const total = announced();
    check('cave chargée', total > 0 && cards() > 0, `${total} références, ${cards()} cartes rendues`);

    /* --- Recherche --- */
    const input = document.getElementById('recherche-vin');
    const setValue = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    ).set;

    await window.__agir(() => {
      setValue.call(input, 'bourgogne');
      input.dispatchEvent(new window.Event('input', { bubbles: true }));
    });
    const searched = announced();
    check(
      'recherche « bourgogne »',
      searched > 0 && searched < total,
      `${searched} sur ${total}`,
    );

    /* --- Réinitialisation via la croix du champ --- */
    await window.__agir(() => {
      setValue.call(input, '');
      input.dispatchEvent(new window.Event('input', { bubbles: true }));
    });
    check('recherche effacée', announced() === total, `${announced()} références`);

    /* --- Filtre par facette (première case à cocher du panneau) --- */
    const checkbox = document.querySelector('aside input[type="checkbox"]');
    const facetLabel = checkbox?.closest('label')?.textContent?.trim() ?? '?';
    await window.__agir(() => checkbox.click());
    const filtered = announced();
    check('filtre par facette', filtered > 0 && filtered < total, `« ${facetLabel} » → ${filtered}`);

    /* --- Tri par prix croissant --- */
    const select = document.querySelector('select');
    const setSelect = Object.getOwnPropertyDescriptor(
      window.HTMLSelectElement.prototype,
      'value',
    ).set;
    await window.__agir(() => {
      setSelect.call(select, 'price-asc');
      select.dispatchEvent(new window.Event('change', { bubbles: true }));
    });
    const prices = [...document.querySelectorAll('article')]
      .map((a) => a.textContent.match(/(\d+)\s*€/g)?.at(-1))
      .filter(Boolean)
      .map((s) => Number(s.replace(/\D/g, '')));
    const sorted = prices.every((p, i) => i === 0 || prices[i - 1] <= p);
    check('tri par prix croissant', sorted && prices.length > 1, `${prices.slice(0, 4).join(' ≤ ')} …`);

    /* --- Réinitialiser tous les filtres --- */
    const resetButton = [...document.querySelectorAll('aside button')].find((b) =>
      /réinitialiser/i.test(b.textContent ?? ''),
    );
    await window.__agir(() => resetButton.click());
    check('réinitialisation des filtres', announced() === total, `${announced()} références`);

    /* --- Recherche sans résultat --- */
    await window.__agir(() => {
      setValue.call(input, 'zzzzzz');
      input.dispatchEvent(new window.Event('input', { bubbles: true }));
    });
    const empty = document.body.textContent.includes('Aucune bouteille');
    check('état vide', empty, empty ? 'message affiché' : 'message manquant');

    if (errors.length) {
      failures += 1;
      console.log(`ECHEC console                                ${errors.slice(0, 2).join(' | ')}`);
    }
  } catch (error) {
    failures += 1;
    console.log(`ECHEC parcours cave                          ${error.message}`);
  } finally {
    window.close();
  }
}

console.log(failures === 0 ? '\nTest de fumée : tout est vert.' : `\n${failures} échec(s).`);
process.exit(failures === 0 ? 0 : 1);
