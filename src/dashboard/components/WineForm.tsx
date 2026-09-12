import { useMemo, useState } from 'react';
import * as api from '../api';
import type { DbWine, Meta, WineCategoryId, WineColor } from '../api';
import { useData } from '../DataStore';
import { useToast } from './Toast';
import { Modal } from './Modal';

interface WineFormProps {
  meta: Meta;
  category: WineCategoryId;
  subcategory?: string;
  /** Vin existant à modifier ; absent pour une création. */
  item?: DbWine;
  onClose: () => void;
}

export function WineForm({ meta, category, subcategory, item, onClose }: WineFormProps) {
  const { refetch } = useData();
  const notify = useToast();

  const [saving, setSaving] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<WineCategoryId>(item?.category ?? category);
  const subcategoryOptions = meta.wineSubcategoryOrder[selectedCategory];
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>(
    item?.subcategory ?? subcategory ?? subcategoryOptions?.[0],
  );

  const [name, setName] = useState(item?.name ?? '');
  const [producer, setProducer] = useState(item?.producer ?? '');
  const [appellation, setAppellation] = useState(item?.appellation ?? '');
  const [region, setRegion] = useState(item?.region ?? '');
  const [type, setType] = useState<WineColor | ''>(item?.type ?? '');
  const [grape, setGrape] = useState(item?.grape ?? '');
  const [vintage, setVintage] = useState(item?.vintage !== undefined ? String(item.vintage) : '');
  const [volume, setVolume] = useState(item?.volume ?? '');
  const [hasPrice, setHasPrice] = useState(item?.price !== undefined);
  const [price, setPrice] = useState(item?.price ?? 0);
  const [description, setDescription] = useState(item?.description ?? '');
  const [byTheGlass, setByTheGlass] = useState(Boolean(item?.byTheGlass));

  const isNew = !item;

  const parsedVintage = useMemo((): string | number | undefined => {
    const trimmed = vintage.trim();
    if (!trimmed) return undefined;
    return /^\d+$/.test(trimmed) ? Number(trimmed) : trimmed;
  }, [vintage]);

  const buildPayload = (): api.WineInput => ({
    category: selectedCategory,
    subcategory: selectedSubcategory,
    name: name.trim() || undefined,
    producer: producer.trim() || undefined,
    appellation: appellation.trim() || undefined,
    region: region.trim() || undefined,
    type: type || undefined,
    grape: grape.trim() || undefined,
    vintage: parsedVintage,
    volume: volume.trim() || undefined,
    price: hasPrice ? price : undefined,
    description: description.trim() || undefined,
    byTheGlass,
  });

  const handleCategoryChange = (next: WineCategoryId) => {
    setSelectedCategory(next);
    setSelectedSubcategory(meta.wineSubcategoryOrder[next]?.[0]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() && !producer.trim()) {
      notify('Indiquez au moins un nom de cuvée ou un producteur.', 'error');
      return;
    }
    if (subcategoryOptions && !selectedSubcategory) {
      notify('Choisissez une sous-catégorie.', 'error');
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        await api.createWine(buildPayload());
        notify('Vin ajouté.');
      } else {
        await api.updateWine(item.id, buildPayload());
        notify('Vin mis à jour.');
      }
      await refetch();
      onClose();
    } catch (err) {
      notify(err instanceof Error ? err.message : String(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={isNew ? 'Nouveau vin' : `Modifier « ${item?.name ?? item?.producer} »`} onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="db-label" htmlFor="wi-name">
              Nom de la cuvée <span className="normal-case text-[var(--color-muted)]">(facultatif)</span>
            </label>
            <input
              id="wi-name"
              className="db-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="db-label" htmlFor="wi-producer">
              Domaine / Producteur <span className="normal-case text-[var(--color-muted)]">(facultatif)</span>
            </label>
            <input
              id="wi-producer"
              className="db-field"
              value={producer}
              onChange={(e) => setProducer(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="db-label" htmlFor="wi-category">
              Catégorie
            </label>
            <select
              id="wi-category"
              className="db-field"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value as WineCategoryId)}
            >
              {meta.wineCategoryOrder.map((c) => (
                <option key={c} value={c}>
                  {meta.wineCategoryMeta[c].title}
                </option>
              ))}
            </select>
          </div>
          {subcategoryOptions && (
            <div>
              <label className="db-label" htmlFor="wi-subcategory">
                Sous-catégorie
              </label>
              <select
                id="wi-subcategory"
                className="db-field"
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
              >
                {subcategoryOptions.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="db-label" htmlFor="wi-appellation">
              Appellation <span className="normal-case text-[var(--color-muted)]">(facultatif)</span>
            </label>
            <input
              id="wi-appellation"
              className="db-field"
              value={appellation}
              onChange={(e) => setAppellation(e.target.value)}
            />
          </div>
          <div>
            <label className="db-label" htmlFor="wi-region">
              Région <span className="normal-case text-[var(--color-muted)]">(facultatif)</span>
            </label>
            <input
              id="wi-region"
              className="db-field"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="db-label" htmlFor="wi-vintage">
              Millésime <span className="normal-case text-[var(--color-muted)]">(facultatif)</span>
            </label>
            <input
              id="wi-vintage"
              className="db-field"
              placeholder="2022, NM, 2022/2023…"
              value={vintage}
              onChange={(e) => setVintage(e.target.value)}
            />
          </div>
          <div>
            <label className="db-label" htmlFor="wi-type">
              Type <span className="normal-case text-[var(--color-muted)]">(facultatif)</span>
            </label>
            <select
              id="wi-type"
              className="db-field"
              value={type}
              onChange={(e) => setType(e.target.value as WineColor | '')}
            >
              <option value="">—</option>
              {meta.wineColors.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="db-label" htmlFor="wi-volume">
              Contenance <span className="normal-case text-[var(--color-muted)]">(facultatif)</span>
            </label>
            <input
              id="wi-volume"
              className="db-field"
              placeholder="75 cl, Magnum (1,5 L)…"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="db-label" htmlFor="wi-grape">
            Cépage(s) <span className="normal-case text-[var(--color-muted)]">(facultatif)</span>
          </label>
          <input
            id="wi-grape"
            className="db-field"
            placeholder="Chardonnay, Pinot Noir…"
            value={grape}
            onChange={(e) => setGrape(e.target.value)}
          />
        </div>

        <fieldset className="db-card p-4">
          <legend className="db-label px-1">Prix</legend>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={hasPrice}
              onChange={(e) => setHasPrice(e.target.checked)}
            />
            Prix connu
          </label>
          {hasPrice && (
            <input
              type="number"
              step="0.01"
              min={0}
              className="db-field mt-3 w-32"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          )}
        </fieldset>

        <div>
          <label className="db-label" htmlFor="wi-description">
            Description <span className="normal-case text-[var(--color-muted)]">(facultatif)</span>
          </label>
          <textarea
            id="wi-description"
            className="db-field"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={byTheGlass}
            onChange={(e) => setByTheGlass(e.target.checked)}
          />
          Servi au verre
        </label>

        <div className="flex justify-end gap-2 border-t border-[var(--color-border)] pt-4">
          <button type="button" onClick={onClose} className="db-btn db-btn-secondary">
            Annuler
          </button>
          <button type="submit" disabled={saving} className="db-btn db-btn-primary">
            {saving ? 'Enregistrement…' : isNew ? 'Ajouter le vin' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
