/**
 * TEST DE FUMÉE DU TABLEAU DE BORD
 * ---------------------------------------------------------------------------
 * Monte réellement le tableau de bord dans un DOM (jsdom) et vérifie qu'il
 * charge les données depuis l'API déjà démarrée (`npm run dashboard`),
 * affiche la carte, et qu'un parcours de base (créer un plat, prévisualiser
 * la publication) fonctionne de bout en bout.
 *
 *   npm run dashboard                                    (dans un terminal)
 *   npx vite build --config scripts/vite.dashboard-smoke.config.ts
 *   node scripts/dashboard-smoke.mjs
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { JSDOM, VirtualConsole } from 'jsdom';

const BUNDLE = readFileSync(
  fileURLToPath(new URL('../dist-dashboard-smoke/dashboard-app.js', import.meta.url)),
  'utf8',
);

const SHELL = `<!doctype html><html><head><title>t</title></head><body><div id="dashboard-root"></div></body></html>`;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const virtualConsole = new VirtualConsole();
const errors = [];
virtualConsole.on('jsdomError', (e) => errors.push(e.message));
virtualConsole.on('error', (...a) => errors.push(a.map(String).join(' ')));

const dom = new JSDOM(SHELL, {
  url: 'http://localhost:5174/dashboard.html',
  runScripts: 'outside-only',
  pretendToBeVisual: true,
  virtualConsole,
});
const { window } = dom;

window.MessageChannel = MessageChannel;
window.queueMicrotask = queueMicrotask;
window.fetch = fetch;
window.FormData = FormData;
window.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
window.scrollTo = () => {};
if (!window.matchMedia) {
  window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
}

let failures = 0;
const check = (label, condition, detail) => {
  if (condition) {
    console.log(`OK    ${label.padEnd(38)} ${detail ?? ''}`);
  } else {
    failures += 1;
    console.log(`ECHEC ${label.padEnd(38)} ${detail ?? ''}`);
  }
};

try {
  window.eval(BUNDLE);
  await wait(600); // laisse React monter + le premier fetch se résoudre

  const { document } = window;
  const text = () => document.body.textContent.replace(/\s+/g, ' ').trim();

  check('tableau de bord chargé', text().includes('Tableau de bord'), text().slice(0, 60));
  check(
    'catégories de la carte affichées',
    text().includes('Entrées') && text().includes('La Viande') && text().includes('Desserts'),
  );
  check('aucune erreur console', errors.length === 0, errors.slice(0, 2).join(' | '));

  // --- Création d'un plat de bout en bout ---
  const addButtons = [...document.querySelectorAll('button')].filter((b) =>
    b.textContent.includes('Ajouter un plat'),
  );
  check('bouton « Ajouter un plat » présent', addButtons.length > 0);

  if (addButtons.length > 0) {
    addButtons[0].click();
    await wait(150);

    const nameInput = document.getElementById('mi-name');
    check('formulaire de création ouvert', Boolean(nameInput));

    if (nameInput) {
      const setValue = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      ).set;
      const testName = `Plat de test ${Date.now()}`;
      setValue.call(nameInput, testName);
      nameInput.dispatchEvent(new window.Event('input', { bubbles: true }));

      const priceInput = document.getElementById('mi-price');
      setValue.call(priceInput, '19.5');
      priceInput.dispatchEvent(new window.Event('input', { bubbles: true }));

      const submitButton = [...document.querySelectorAll('button[type="submit"]')][0];
      submitButton.click();
      await wait(900);

      check(
        'plat créé et visible dans la liste',
        document.body.textContent.includes(testName),
        testName,
      );

      // Nettoyage : supprime le plat de test créé pour ne pas polluer la carte.
      const row = [...document.querySelectorAll('li')].find((li) =>
        li.textContent.includes(testName),
      );
      const deleteBtn = row?.querySelector('button[aria-label="Supprimer"]');
      if (deleteBtn) {
        // Ferme d'abord la modale de création si encore ouverte.
        const closeButtons = [...document.querySelectorAll('button')].filter(
          (b) => b.textContent.trim() === 'Terminer' || b.textContent.trim() === 'Annuler',
        );
        closeButtons[0]?.click();
        await wait(250);
        const freshRow = [...document.querySelectorAll('li')].find((li) =>
          li.textContent.includes(testName),
        );
        freshRow?.querySelector('button[aria-label="Supprimer"]')?.click();
        await wait(250);
        const confirmBtn = [...document.querySelectorAll('button')].find(
          (b) => b.textContent.trim() === 'Supprimer' && b.closest('[role="dialog"]'),
        );
        confirmBtn?.click();
        await wait(600);
        check(
          'plat de test nettoyé',
          !document.body.textContent.includes(testName),
        );
      }
    }
  }

  // --- Onglet Publier ---
  const publishTab = [...document.querySelectorAll('button')].find(
    (b) => b.textContent.trim() === 'Publier',
  );
  publishTab?.click();
  await wait(600);
  check(
    'onglet Publier fonctionnel',
    document.body.textContent.includes('publier') ||
      document.body.textContent.includes('Publier') ||
      document.body.textContent.includes('publication'),
  );
} catch (error) {
  failures += 1;
  console.log(`ECHEC exécution                            ${error.stack ?? error.message}`);
} finally {
  window.close();
}

console.log(failures === 0 ? '\nTableau de bord : tout est vert.' : `\n${failures} échec(s).`);
process.exit(failures === 0 ? 0 : 1);
