import { useMemo, useState } from 'react';
import type { DbImage } from '../api';
import { useData } from '../DataStore';
import { ImageEditor, ImageThumb } from '../components/ImageEditor';
import { Modal } from '../components/Modal';

interface Group {
  title: string;
  images: DbImage[];
}

export function ImagesPage() {
  const { meta, images, menu, refetch } = useData();
  const [selected, setSelected] = useState<DbImage | null>(null);

  const groups = useMemo<Group[]>(() => {
    if (!meta) return [];
    const byKey = new Map(images.map((img) => [img.key, img]));
    const used = new Set<string>();

    const pick = (keys: string[]) =>
      keys
        .filter((key) => byKey.has(key) && !used.has(key))
        .map((key) => {
          used.add(key);
          return byKey.get(key)!;
        });

    const result: Group[] = [{ title: 'Images de page', images: pick(meta.siteImageKeys) }];

    for (const category of meta.categoryOrder) {
      const keys = menu
        .filter((item) => item.category === category)
        .sort((a, b) => a.order - b.order)
        .map((item) => item.imageKey)
        .filter((key): key is string => Boolean(key));
      result.push({ title: meta.categoryMeta[category].title, images: pick(keys) });
    }

    result.push({ title: 'Galerie', images: pick(meta.galleryOnlyImageKeys) });

    const remaining = images.filter((img) => !used.has(img.key));
    if (remaining.length > 0) result.push({ title: 'Autres', images: remaining });

    return result.filter((g) => g.images.length > 0);
  }, [meta, images, menu]);

  if (!meta) return null;

  return (
    <div className="space-y-8">
      <p className="max-w-2xl text-sm text-[var(--color-muted)]">
        Toutes les images du site. Cliquez sur une vignette pour téléverser une photo ou modifier
        son texte alternatif. Les photos sont automatiquement compressées.
      </p>

      {groups.map((group) => (
        <section key={group.title}>
          <h2 className="mb-3 text-xs font-semibold tracking-wide text-[var(--color-muted)] uppercase">
            {group.title}
          </h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {group.images.map((image) => (
              <li key={image.key}>
                <button
                  type="button"
                  onClick={() => setSelected(image)}
                  className="db-card group flex w-full flex-col items-center gap-2 p-3 text-center transition-colors hover:border-[var(--color-accent)]"
                >
                  <ImageThumb image={image} size={72} />
                  <span className="line-clamp-2 text-xs text-[var(--color-muted)] group-hover:text-[var(--color-ink)]">
                    {image.alt}
                  </span>
                  {!image.file && (
                    <span className="text-[0.625rem] font-medium tracking-wide text-[var(--color-gold)] uppercase">
                      Sans photo
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {selected && (
        <Modal title={selected.key} onClose={() => setSelected(null)}>
          <ImageEditor
            image={images.find((i) => i.key === selected.key) ?? selected}
            tones={meta.tones}
            motifs={meta.motifs}
            onUpdated={() => refetch()}
          />
        </Modal>
      )}
    </div>
  );
}
