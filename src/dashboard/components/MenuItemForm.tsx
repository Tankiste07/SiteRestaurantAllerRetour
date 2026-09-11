import { useState } from 'react';
import * as api from '../api';
import type { DbImage, DbMenuItem, MenuCategoryId, Meta } from '../api';
import { useData } from '../DataStore';
import { useToast } from './Toast';
import { ImageEditor } from './ImageEditor';
import { Modal } from './Modal';
import { PriceListEditor, type PriceRow } from './PriceListEditor';

type PriceMode = 'simple' | 'variants' | 'missing';

interface MenuItemFormProps {
  meta: Meta;
  category: MenuCategoryId;
  /** Plat existant à modifier ; absent pour une création. */
  item?: DbMenuItem;
  onClose: () => void;
}

function priceModeOf(item: DbMenuItem | undefined): PriceMode {
  if (!item) return 'simple';
  if (item.priceMissing) return 'missing';
  if (item.variants && item.variants.length > 0) return 'variants';
  return 'simple';
}

export function MenuItemForm({ meta, category, item, onClose }: MenuItemFormProps) {
  const { images, refetch } = useData();
  const notify = useToast();

  const [saving, setSaving] = useState(false);
  const [createdItem, setCreatedItem] = useState<DbMenuItem | null>(null);
  const [createdImage, setCreatedImage] = useState<DbImage | null>(null);

  const editing = createdItem ?? item;
  const isNew = !item;

  const [name, setName] = useState(item?.name ?? '');
  const [selectedCategory, setSelectedCategory] = useState<MenuCategoryId>(category);
  const [description, setDescription] = useState(item?.description ?? '');
  const [detail, setDetail] = useState(item?.detail ?? '');
  const [serves, setServes] = useState(item?.serves ?? '');
  const [priceMode, setPriceMode] = useState<PriceMode>(priceModeOf(item));
  const [price, setPrice] = useState(item?.price ?? 0);
  const [priceUnit, setPriceUnit] = useState(item?.priceUnit ?? '');
  const [variants, setVariants] = useState<PriceRow[]>(item?.variants ?? [{ label: '', price: 0 }]);
  const [options, setOptions] = useState<PriceRow[]>(item?.options ?? []);
  const [glutenFree, setGlutenFree] = useState(Boolean(item?.tags?.includes('SANS GLUTEN')));

  const linkedImage = editing?.imageKey
    ? (createdImage ?? images.find((i) => i.key === editing.imageKey))
    : undefined;

  const buildPayload = (): api.MenuItemInput => ({
    category: selectedCategory,
    name: name.trim(),
    description: description.trim() || undefined,
    detail: detail.trim() || undefined,
    serves: serves.trim() || undefined,
    price: priceMode === 'simple' ? price : undefined,
    priceUnit: priceMode === 'simple' ? priceUnit.trim() || undefined : undefined,
    variants:
      priceMode === 'variants'
        ? variants.filter((v) => v.label.trim() && v.price > 0)
        : undefined,
    options: options.filter((o) => o.label.trim() && o.price > 0),
    tags: glutenFree ? ['SANS GLUTEN'] : undefined,
    priceMissing: priceMode === 'missing',
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      notify('Le nom du plat est requis.', 'error');
      return;
    }
    if (priceMode === 'variants' && variants.every((v) => !v.label.trim() || v.price <= 0)) {
      notify('Ajoutez au moins un format avec un prix.', 'error');
      return;
    }

    setSaving(true);
    try {
      if (isNew && !createdItem) {
        const created = await api.createMenuItem(buildPayload());
        setCreatedItem(created);
        await refetch();
        const image = (await api.getImages()).find((i) => i.key === created.imageKey) ?? null;
        setCreatedImage(image);
        notify('Plat créé. Vous pouvez maintenant y ajouter une photo.');
      } else if (editing) {
        await api.updateMenuItem(editing.id, buildPayload());
        await refetch();
        notify('Plat mis à jour.');
        onClose();
      }
    } catch (err) {
      notify(err instanceof Error ? err.message : String(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={isNew ? 'Nouveau plat' : `Modifier « ${item?.name} »`} onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="db-label" htmlFor="mi-name">
              Nom du plat
            </label>
            <input
              id="mi-name"
              className="db-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={Boolean(createdItem)}
            />
          </div>
          <div>
            <label className="db-label" htmlFor="mi-category">
              Catégorie
            </label>
            <select
              id="mi-category"
              className="db-field"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as MenuCategoryId)}
              disabled={Boolean(createdItem)}
            >
              {meta.categoryOrder.map((c) => (
                <option key={c} value={c}>
                  {meta.categoryMeta[c].title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="db-label" htmlFor="mi-description">
              Description <span className="normal-case text-[var(--color-muted)]">(facultatif)</span>
            </label>
            <input
              id="mi-description"
              className="db-field"
              placeholder="Accompagnement, garniture…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={Boolean(createdItem)}
            />
          </div>
          <div>
            <label className="db-label" htmlFor="mi-detail">
              Précision <span className="normal-case text-[var(--color-muted)]">(facultatif)</span>
            </label>
            <input
              id="mi-detail"
              className="db-field"
              placeholder="6 unités, Environ 1 kg…"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              disabled={Boolean(createdItem)}
            />
          </div>
        </div>

        <div>
          <label className="db-label" htmlFor="mi-serves">
            Nombre de couverts <span className="normal-case text-[var(--color-muted)]">(facultatif)</span>
          </label>
          <input
            id="mi-serves"
            className="db-field max-w-xs"
            placeholder="Pour 2 personnes"
            value={serves}
            onChange={(e) => setServes(e.target.value)}
            disabled={Boolean(createdItem)}
          />
        </div>

        <fieldset className="db-card p-4" disabled={Boolean(createdItem)}>
          <legend className="db-label px-1">Prix</legend>
          <div className="flex flex-wrap gap-4 text-sm">
            {(
              [
                ['simple', 'Prix simple'],
                ['variants', 'Plusieurs formats'],
                ['missing', 'Prix à préciser'],
              ] as [PriceMode, string][]
            ).map(([mode, label]) => (
              <label key={mode} className="flex items-center gap-1.5">
                <input
                  type="radio"
                  name="price-mode"
                  checked={priceMode === mode}
                  onChange={() => setPriceMode(mode)}
                />
                {label}
              </label>
            ))}
          </div>

          {priceMode === 'simple' && (
            <div className="mt-3 flex gap-2.5">
              <div>
                <label className="db-label" htmlFor="mi-price">
                  Prix (€)
                </label>
                <input
                  id="mi-price"
                  type="number"
                  step="0.01"
                  min={0}
                  className="db-field w-28"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="db-label" htmlFor="mi-unit">
                  Unité <span className="normal-case">(facultatif)</span>
                </label>
                <input
                  id="mi-unit"
                  className="db-field w-36"
                  placeholder="/ 100 g"
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value)}
                />
              </div>
            </div>
          )}

          {priceMode === 'variants' && (
            <div className="mt-3">
              <PriceListEditor
                label="Formats"
                rows={variants}
                onChange={setVariants}
                labelPlaceholder="250 g"
              />
            </div>
          )}

          {priceMode === 'missing' && (
            <p className="mt-3 text-xs text-[var(--color-muted)]">
              Affiche « Prix à préciser » sur le site — à utiliser tant que le prix n'a pas été
              communiqué. N'inventez jamais un montant.
            </p>
          )}
        </fieldset>

        <fieldset disabled={Boolean(createdItem)}>
          <PriceListEditor
            label="Suppléments (facultatif)"
            rows={options}
            onChange={setOptions}
            labelPlaceholder="Verre de vin en accord"
          />
        </fieldset>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={glutenFree}
            onChange={(e) => setGlutenFree(e.target.checked)}
            disabled={Boolean(createdItem)}
          />
          Sans gluten
        </label>

        {linkedImage && (
          <div className="db-card bg-[var(--color-surface-muted)] p-4">
            <p className="db-label">Photo du plat</p>
            <ImageEditor
              image={linkedImage}
              tones={meta.tones}
              motifs={meta.motifs}
              onUpdated={(img) => {
                setCreatedImage(img);
                refetch();
              }}
              compact
            />
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-[var(--color-border)] pt-4">
          <button type="button" onClick={onClose} className="db-btn db-btn-secondary">
            {createdItem ? 'Terminer' : 'Annuler'}
          </button>
          {!createdItem && (
            <button type="submit" disabled={saving} className="db-btn db-btn-primary">
              {saving ? 'Enregistrement…' : isNew ? 'Créer le plat' : 'Enregistrer'}
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
