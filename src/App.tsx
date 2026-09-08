import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { StructuredData } from '@/components/StructuredData';

/* La page d'accueil est chargée immédiatement ; les autres à la demande,
   afin de garder un premier rendu très léger. */
import Home from '@/pages/Home';

const Restaurant = lazy(() => import('@/pages/Restaurant'));
const Menu = lazy(() => import('@/pages/Menu'));
const Meat = lazy(() => import('@/pages/Meat'));
const Wines = lazy(() => import('@/pages/Wines'));
const Gallery = lazy(() => import('@/pages/Gallery'));
const Contact = lazy(() => import('@/pages/Contact'));
const Legal = lazy(() => import('@/pages/Legal'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const NotFound = lazy(() => import('@/pages/NotFound'));

/** Écran d'attente entre deux pages — discret, sans clignotement. */
function PageFallback() {
  return (
    <div className="flex min-h-[70svh] items-center justify-center bg-noir">
      <span className="sr-only">Chargement de la page…</span>
      <span
        aria-hidden="true"
        className="h-px w-24 bg-gradient-to-r from-transparent via-or/60 to-transparent motion-safe:animate-[ar-fade-in_1s_ease-in-out_infinite_alternate]"
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <StructuredData />
      <Suspense fallback={<PageFallback />}>
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
      </Suspense>
    </BrowserRouter>
  );
}
