import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';
import { ScrollToTop } from './ScrollToTop';

/** Coquille commune à toutes les pages. */
export function Layout() {
  return (
    <>
      <ScrollToTop />
      <a href="#contenu" className="skip-link">
        Aller au contenu
      </a>
      <Header />
      <main id="contenu" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
