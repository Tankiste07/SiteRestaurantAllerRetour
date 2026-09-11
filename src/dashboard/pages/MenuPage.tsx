import { useState } from 'react';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react';
import * as api from '../api';
import type { DbMenuItem, MenuCategoryId } from '../api';
import { useData } from '../DataStore';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ImageThumb } from '../components/ImageEditor';
import { MenuItemForm } from '../components/MenuItemForm';
import { useToast } from '../components/Toast';

function formatPrice(item: DbMenuItem): string {
  if (item.priceMissing) return 'Prix à préciser';
  if (item.variants?.length) {
    return item.variants.map((v) => `${v.label} — ${v.price} €`).join(' · ');
  }
  if (item.price === undefined) return '—';
  return `${item.price} €${item.priceUnit ? ` ${item.priceUnit}` : ''}`;
}

export function MenuPage() {
  const { meta, images, menu, refetch } = useData();
  const notify = useToast();
  const [formState, setFormState] = useState<{ category: MenuCategoryId; item?: DbMenuItem } | null>(
    null,
  );
  const [toDelete, setToDelete] = useState<DbMenuItem | null>(null);

  if (!meta) return null;

  const move = async (category: MenuCategoryId, items: DbMenuItem[], index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const ordered = [...items];
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
    try {
      await api.reorderCategory(category, ordered.map((i) => i.id));
      await refetch();
    } catch (err) {
      notify(err instanceof Error ? err.message : String(err), 'error');
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await api.deleteMenuItem(toDelete.id);
      await refetch();
      notify('Plat supprimé.');
    } catch (err) {
      notify(err instanceof Error ? err.message : String(err), 'error');
    } finally {
      setToDelete(null);
    }
  };

  return (
    <div className="space-y-8">
      {meta.categoryOrder.map((category) => {
        const items = menu
          .filter((item) => item.category === category)
          .sort((a, b) => a.order - b.order);

        return (
          <section key={category} className="db-card">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-3.5">
              <div>
                <h2 className="text-sm font-semibold">{meta.categoryMeta[category].title}</h2>
                <p className="text-xs text-[var(--color-muted)]">
                  {meta.categoryMeta[category].eyebrow} · {items.length}{' '}
                  {items.length > 1 ? 'plats' : 'plat'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormState({ category })}
                className="db-btn db-btn-primary"
              >
                <Plus size={14} /> Ajouter un plat
              </button>
            </div>

            {items.length === 0 ? (
              <p className="px-5 py-6 text-sm text-[var(--color-muted)]">
                Aucun plat dans cette catégorie.
              </p>
            ) : (
              <ul className="divide-y divide-[var(--color-border)]">
                {items.map((item, index) => {
                  const image = images.find((i) => i.key === item.imageKey);
                  return (
                    <li key={item.id} className="flex items-center gap-3 px-5 py-3">
                      {image && <ImageThumb image={image} size={44} />}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{item.name}</p>
                        <p className="truncate text-xs text-[var(--color-muted)]">
                          {formatPrice(item)}
                          {item.tags?.length ? ` · ${item.tags.join(', ')}` : ''}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => move(category, items, index, -1)}
                          disabled={index === 0}
                          className="db-btn db-btn-ghost !px-1.5 !py-1.5"
                          aria-label="Monter"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => move(category, items, index, 1)}
                          disabled={index === items.length - 1}
                          className="db-btn db-btn-ghost !px-1.5 !py-1.5"
                          aria-label="Descendre"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormState({ category, item })}
                          className="db-btn db-btn-secondary !px-2 !py-1.5"
                        >
                          <Pencil size={13} /> Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => setToDelete(item)}
                          className="db-btn db-btn-ghost !px-1.5 !py-1.5 text-[var(--color-danger)]"
                          aria-label="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}

      {formState && (
        <MenuItemForm
          meta={meta}
          category={formState.category}
          item={formState.item}
          onClose={() => {
            setFormState(null);
            refetch();
          }}
        />
      )}

      {toDelete && (
        <ConfirmDialog
          title="Supprimer ce plat ?"
          message={`« ${toDelete.name} » sera retiré de la carte. Cette action n'est effective sur le site qu'après publication.`}
          confirmLabel="Supprimer"
          danger
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
