import { useState } from 'react';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react';
import * as api from '../api';
import type { DbWine, WineCategoryId } from '../api';
import { useData } from '../DataStore';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { WineForm } from '../components/WineForm';
import { useToast } from '../components/Toast';

function wineLabel(wine: DbWine): string {
  return wine.name ?? wine.producer ?? 'Vin sans nom';
}

function wineSubtitle(wine: DbWine): string {
  const parts = [wine.name && wine.producer ? wine.producer : undefined, wine.appellation, wine.vintage]
    .filter((p): p is string | number => p !== undefined && p !== '')
    .map(String);
  return parts.join(' · ');
}

function formatPrice(wine: DbWine): string {
  return wine.price === undefined ? '—' : `${wine.price} €`;
}

interface Bucket {
  category: WineCategoryId;
  subcategory?: string;
  title: string;
  wines: DbWine[];
}

export function WinesPage() {
  const { meta, wines, refetch } = useData();
  const notify = useToast();
  const [formState, setFormState] = useState<{
    category: WineCategoryId;
    subcategory?: string;
    item?: DbWine;
  } | null>(null);
  const [toDelete, setToDelete] = useState<DbWine | null>(null);

  if (!meta) return null;

  const buckets: Bucket[] = meta.wineCategoryOrder.flatMap((category) => {
    const subcategories = meta.wineSubcategoryOrder[category];
    if (!subcategories) {
      return [
        {
          category,
          title: meta.wineCategoryMeta[category].title,
          wines: wines
            .filter((w) => w.category === category)
            .sort((a, b) => a.order - b.order),
        },
      ];
    }
    return subcategories.map((subcategory) => ({
      category,
      subcategory,
      title: subcategory,
      wines: wines
        .filter((w) => w.category === category && w.subcategory === subcategory)
        .sort((a, b) => a.order - b.order),
    }));
  });

  const move = async (bucket: Bucket, index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= bucket.wines.length) return;
    const ordered = [...bucket.wines];
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
    try {
      await api.reorderWineBucket(bucket.category, bucket.subcategory, ordered.map((w) => w.id));
      await refetch();
    } catch (err) {
      notify(err instanceof Error ? err.message : String(err), 'error');
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await api.deleteWine(toDelete.id);
      await refetch();
      notify('Vin supprimé.');
    } catch (err) {
      notify(err instanceof Error ? err.message : String(err), 'error');
    } finally {
      setToDelete(null);
    }
  };

  return (
    <div className="space-y-8">
      {meta.wineCategoryOrder.map((category) => {
        const categoryBuckets = buckets.filter((b) => b.category === category);
        const totalWines = categoryBuckets.reduce((n, b) => n + b.wines.length, 0);

        return (
          <section key={category} className="db-card">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-3.5">
              <div>
                <h2 className="text-sm font-semibold">{meta.wineCategoryMeta[category].title}</h2>
                <p className="text-xs text-[var(--color-muted)]">
                  {totalWines} {totalWines > 1 ? 'vins' : 'vin'}
                </p>
              </div>
              {categoryBuckets.length === 1 && !categoryBuckets[0].subcategory && (
                <button
                  type="button"
                  onClick={() => setFormState({ category })}
                  className="db-btn db-btn-primary"
                >
                  <Plus size={14} /> Ajouter un vin
                </button>
              )}
            </div>

            <div className="divide-y divide-[var(--color-border)]">
              {categoryBuckets.map((bucket) => (
                <div key={`${bucket.category}-${bucket.subcategory ?? ''}`}>
                  {bucket.subcategory && (
                    <div className="flex items-center justify-between px-5 py-2.5 bg-[var(--color-surface-muted)]">
                      <h3 className="text-xs font-semibold tracking-wide uppercase text-[var(--color-muted)]">
                        {bucket.title} · {bucket.wines.length}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setFormState({ category: bucket.category, subcategory: bucket.subcategory })}
                        className="db-btn db-btn-secondary !px-2 !py-1"
                      >
                        <Plus size={13} /> Ajouter
                      </button>
                    </div>
                  )}

                  {bucket.wines.length === 0 ? (
                    <p className="px-5 py-4 text-sm text-[var(--color-muted)]">Aucun vin ici.</p>
                  ) : (
                    <ul className="divide-y divide-[var(--color-border)]">
                      {bucket.wines.map((wine, index) => (
                        <li key={wine.id} className="flex items-center gap-3 px-5 py-3">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{wineLabel(wine)}</p>
                            <p className="truncate text-xs text-[var(--color-muted)]">
                              {wineSubtitle(wine)} {wineSubtitle(wine) ? '· ' : ''}
                              {formatPrice(wine)}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-1">
                            <button
                              type="button"
                              onClick={() => move(bucket, index, -1)}
                              disabled={index === 0}
                              className="db-btn db-btn-ghost !px-1.5 !py-1.5"
                              aria-label="Monter"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => move(bucket, index, 1)}
                              disabled={index === bucket.wines.length - 1}
                              className="db-btn db-btn-ghost !px-1.5 !py-1.5"
                              aria-label="Descendre"
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setFormState({ category: bucket.category, subcategory: bucket.subcategory, item: wine })
                              }
                              className="db-btn db-btn-secondary !px-2 !py-1.5"
                            >
                              <Pencil size={13} /> Modifier
                            </button>
                            <button
                              type="button"
                              onClick={() => setToDelete(wine)}
                              className="db-btn db-btn-ghost !px-1.5 !py-1.5 text-[var(--color-danger)]"
                              aria-label="Supprimer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {formState && (
        <WineForm
          meta={meta}
          category={formState.category}
          subcategory={formState.subcategory}
          item={formState.item}
          onClose={() => {
            setFormState(null);
            refetch();
          }}
        />
      )}

      {toDelete && (
        <ConfirmDialog
          title="Supprimer ce vin ?"
          message={`« ${wineLabel(toDelete)} » sera retiré de la cave. Cette action n'est effective sur le site qu'après publication.`}
          confirmLabel="Supprimer"
          danger
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
