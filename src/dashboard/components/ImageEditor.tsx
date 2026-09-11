import { useRef, useState } from 'react';
import { ImageUp, Loader2, Trash2 } from 'lucide-react';
import * as api from '../api';
import type { DbImage, ImageMotif, ImageTone } from '../api';
import { useToast } from './Toast';

const TONE_COLORS: Record<ImageTone, string> = {
  braise: '#3a1b16',
  cave: '#2b1216',
  salle: '#332619',
  bois: '#2f2419',
  nappe: '#3a3226',
};

const TONE_LABELS: Record<ImageTone, string> = {
  braise: 'Braise',
  cave: 'Cave',
  salle: 'Salle',
  bois: 'Bois',
  nappe: 'Nappe',
};

const MOTIF_LABELS: Record<ImageMotif, string> = {
  steak: 'Steak',
  cote: 'Côte',
  tartare: 'Tartare',
  bouteille: 'Bouteille',
  verre: 'Verre',
  fromage: 'Fromage',
  dessert: 'Dessert',
  salade: 'Salade',
  escargot: 'Escargot',
  os: 'Os à moelle',
  assiette: 'Assiette',
  salle: 'Salle',
  flamme: 'Flamme',
};

interface ImageEditorProps {
  image: DbImage;
  tones: ImageTone[];
  motifs: ImageMotif[];
  onUpdated: (image: DbImage) => void;
  /** Masque la clé technique (utile quand intégré dans le formulaire d'un plat). */
  compact?: boolean;
}

export function ImageThumb({ image, size = 56 }: { image: Pick<DbImage, 'file' | 'tone' | 'alt'>; size?: number }) {
  const url = api.photoUrl(image.file);
  return (
    <div
      className="shrink-0 overflow-hidden rounded-md border border-[var(--color-border)] bg-cover bg-center"
      style={{
        width: size,
        height: size,
        backgroundColor: TONE_COLORS[image.tone],
        backgroundImage: url ? `url(${url})` : undefined,
      }}
      role="img"
      aria-label={image.alt}
    />
  );
}

export function ImageEditor({ image, tones, motifs, onUpdated, compact }: ImageEditorProps) {
  const notify = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [alt, setAlt] = useState(image.alt);

  const saveAlt = async () => {
    if (alt === image.alt || !alt.trim()) return;
    try {
      onUpdated(await api.patchImage(image.key, { alt }));
    } catch (err) {
      notify(err instanceof Error ? err.message : String(err), 'error');
    }
  };

  const setTone = async (tone: ImageTone) => {
    try {
      onUpdated(await api.patchImage(image.key, { tone }));
    } catch (err) {
      notify(err instanceof Error ? err.message : String(err), 'error');
    }
  };

  const setMotif = async (motif: ImageMotif) => {
    try {
      onUpdated(await api.patchImage(image.key, { motif }));
    } catch (err) {
      notify(err instanceof Error ? err.message : String(err), 'error');
    }
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      onUpdated(await api.uploadPhoto(image.key, file));
      notify('Photo envoyée.');
    } catch (err) {
      notify(err instanceof Error ? err.message : String(err), 'error');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = async () => {
    setBusy(true);
    try {
      onUpdated(await api.removePhoto(image.key));
      notify('Photo retirée — visuel de substitution rétabli.');
    } catch (err) {
      notify(err instanceof Error ? err.message : String(err), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="flex shrink-0 flex-col items-center gap-2">
        <ImageThumb image={image} size={92} />
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="db-btn db-btn-secondary !px-2 !py-1.5"
            title="Téléverser une photo"
          >
            {busy ? <Loader2 size={14} className="animate-spin" /> : <ImageUp size={14} />}
          </button>
          {image.file && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={busy}
              className="db-btn db-btn-ghost !px-2 !py-1.5"
              title="Retirer la photo"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      <div className="flex-1 space-y-2.5">
        {!compact && (
          <p className="font-mono text-xs text-[var(--color-muted)]">{image.key}</p>
        )}
        <div>
          <label className="db-label" htmlFor={`alt-${image.key}`}>
            Texte alternatif
          </label>
          <input
            id={`alt-${image.key}`}
            className="db-field"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            onBlur={saveAlt}
          />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="db-label" htmlFor={`tone-${image.key}`}>
              Ambiance
            </label>
            <select
              id={`tone-${image.key}`}
              className="db-field"
              value={image.tone}
              onChange={(e) => setTone(e.target.value as ImageTone)}
            >
              {tones.map((t) => (
                <option key={t} value={t}>
                  {TONE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="db-label" htmlFor={`motif-${image.key}`}>
              Motif
            </label>
            <select
              id={`motif-${image.key}`}
              className="db-field"
              value={image.motif}
              onChange={(e) => setMotif(e.target.value as ImageMotif)}
            >
              {motifs.map((m) => (
                <option key={m} value={m}>
                  {MOTIF_LABELS[m]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-xs text-[var(--color-muted)]">
          Ambiance et motif ne servent qu'au visuel de substitution affiché tant qu'aucune
          photo n'est envoyée.
        </p>
      </div>
    </div>
  );
}
