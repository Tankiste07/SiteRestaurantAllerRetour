import { useState } from 'react';
import { AlertTriangle, ImageIcon, UploadCloud, UtensilsCrossed } from 'lucide-react';
import { DataStoreProvider, useData } from './DataStore';
import { ToastProvider } from './components/Toast';
import { MenuPage } from './pages/MenuPage';
import { ImagesPage } from './pages/ImagesPage';
import { PublishPage } from './pages/PublishPage';

type Tab = 'menu' | 'images' | 'publish';

const TABS: { id: Tab; label: string; icon: typeof UtensilsCrossed }[] = [
  { id: 'menu', label: 'La Carte', icon: UtensilsCrossed },
  { id: 'images', label: 'Images', icon: ImageIcon },
  { id: 'publish', label: 'Publier', icon: UploadCloud },
];

function Shell() {
  const [tab, setTab] = useState<Tab>('menu');
  const { loading, error } = useData();

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div>
            <p className="text-[0.625rem] font-semibold tracking-[0.2em] text-[var(--color-gold)] uppercase">
              L'Aller Retour
            </p>
            <h1 className="text-lg font-semibold">Tableau de bord</h1>
          </div>
          <nav aria-label="Sections" className="flex gap-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                aria-current={tab === id ? 'page' : undefined}
                className={`db-btn ${tab === id ? 'db-btn-primary' : 'db-btn-ghost'}`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        {error ? (
          <div className="db-card flex items-start gap-3 border-[var(--color-danger)] bg-[var(--color-danger-light)] p-5 text-sm text-[var(--color-danger)]">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Impossible de charger les données.</p>
              <p className="mt-1">{error}</p>
              <p className="mt-2 text-xs">
                Démarrez le serveur avec <code>npm run dashboard</code> (il démarre l'API et cette
                interface ensemble).
              </p>
            </div>
          </div>
        ) : loading ? (
          <p className="text-sm text-[var(--color-muted)]">Chargement…</p>
        ) : tab === 'menu' ? (
          <MenuPage />
        ) : tab === 'images' ? (
          <ImagesPage />
        ) : (
          <PublishPage />
        )}
      </main>
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <DataStoreProvider>
        <Shell />
      </DataStoreProvider>
    </ToastProvider>
  );
}
