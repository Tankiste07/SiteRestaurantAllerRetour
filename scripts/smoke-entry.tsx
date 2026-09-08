/**
 * Point d'entrée du test de fumée.
 * Reprend exactement l'arborescence de routes de `src/App.tsx`, mais avec des
 * imports statiques (jsdom n'exécute pas les imports dynamiques) et un routeur
 * en mémoire. Expose `window.__monter(chemin)` pour monter une page à la volée.
 */

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { StructuredData } from '@/components/StructuredData';
import Home from '@/pages/Home';
import Restaurant from '@/pages/Restaurant';
import Menu from '@/pages/Menu';
import Meat from '@/pages/Meat';
import Wines from '@/pages/Wines';
import Gallery from '@/pages/Gallery';
import Contact from '@/pages/Contact';
import Legal from '@/pages/Legal';
import Privacy from '@/pages/Privacy';
import NotFound from '@/pages/NotFound';

function SmokeApp({ path }: { path: string }) {
  return (
    <MemoryRouter initialEntries={[path]}>
      <StructuredData />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/le-restaurant" element={<Restaurant />} />
          <Route path="/la-carte" element={<Menu />} />
          <Route path="/la-viande" element={<Meat />} />
          <Route path="/la-cave" element={<Wines />} />
          <Route path="/galerie" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mentions-legales" element={<Legal />} />
          <Route path="/confidentialite" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

let root: Root | null = null;

declare global {
  interface Window {
    __monter: (path: string) => Promise<void>;
    __agir: (action: () => void) => Promise<void>;
    IS_REACT_ACT_ENVIRONMENT: boolean;
  }
}

/** Exécute une interaction et attend que React ait fini de réagir. */
window.__agir = async (action: () => void) => {
  await act(async () => {
    action();
  });
};

/* `act` garantit que le rendu ET les effets sont vidés avant les assertions. */
window.IS_REACT_ACT_ENVIRONMENT = true;

window.__monter = async (path: string) => {
  const container = document.getElementById('root');
  if (!container) throw new Error('#root introuvable');
  root ??= createRoot(container);
  await act(async () => {
    root!.render(<SmokeApp path={path} />);
  });
};
