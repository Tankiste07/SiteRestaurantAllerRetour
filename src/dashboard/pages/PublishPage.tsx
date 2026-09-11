import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, GitBranch, Loader2, RefreshCw, UploadCloud } from 'lucide-react';
import * as api from '../api';
import type { PublishPreview, PublishResult } from '../api';
import { useData } from '../DataStore';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';

function statusLabel(line: string): string {
  const code = line.slice(0, 2).trim();
  const file = line.slice(3);
  const labels: Record<string, string> = {
    M: 'Modifié',
    A: 'Ajouté',
    D: 'Supprimé',
    '??': 'Nouveau',
    R: 'Renommé',
  };
  return `${labels[code] ?? code} — ${file}`;
}

export function PublishPage() {
  const { meta, refetch } = useData();
  const notify = useToast();
  const [preview, setPreview] = useState<PublishPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState<PublishResult | null>(null);

  const loadPreview = useCallback(async () => {
    setLoading(true);
    try {
      setPreview(await api.previewPublish());
    } catch (err) {
      notify(err instanceof Error ? err.message : String(err), 'error');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadPreview();
  }, [loadPreview]);

  const handlePublish = async () => {
    setConfirming(false);
    setPublishing(true);
    try {
      const res = await api.doPublish();
      setResult(res);
      if (res.published) {
        notify(`Publié — commit ${res.commit}.`);
        await refetch();
      } else {
        notify(res.error ?? res.message ?? 'Rien à publier.', res.error ? 'error' : 'success');
      }
    } catch (err) {
      notify(err instanceof Error ? err.message : String(err), 'error');
    } finally {
      setPublishing(false);
      loadPreview();
    }
  };

  const statusLines = preview?.status.split('\n').filter(Boolean) ?? [];

  return (
    <div className="max-w-3xl space-y-6">
      <div className="db-card p-5">
        <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
          <GitBranch size={15} />
          {meta?.lastPublishedAt ? (
            <span>
              Dernière publication : {new Date(meta.lastPublishedAt).toLocaleString('fr-FR')}
              {meta.lastPublishedCommit && <> · commit {meta.lastPublishedCommit}</>}
            </span>
          ) : (
            <span>Aucune publication effectuée depuis ce tableau de bord.</span>
          )}
        </div>
      </div>

      <div className="db-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Changements en attente</h2>
          <button type="button" onClick={loadPreview} className="db-btn db-btn-ghost !px-2 !py-1.5">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Actualiser
          </button>
        </div>

        {loading ? (
          <p className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <Loader2 size={14} className="animate-spin" /> Vérification…
          </p>
        ) : preview?.changed ? (
          <>
            <ul className="mb-4 space-y-1 font-mono text-xs text-[var(--color-muted)]">
              {statusLines.map((line) => (
                <li key={line}>{statusLabel(line)}</li>
              ))}
            </ul>
            {preview.diff && (
              <details className="mb-4">
                <summary className="cursor-pointer text-xs font-medium text-[var(--color-accent)]">
                  Voir le détail des modifications de la carte et des images
                </summary>
                <pre className="mt-2 max-h-80 overflow-auto rounded-md bg-[var(--color-surface-muted)] p-3 text-[0.6875rem] leading-relaxed whitespace-pre-wrap">
                  {preview.diff}
                </pre>
              </details>
            )}
            <button
              type="button"
              onClick={() => setConfirming(true)}
              disabled={publishing}
              className="db-btn db-btn-primary"
            >
              {publishing ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Publication…
                </>
              ) : (
                <>
                  <UploadCloud size={14} /> Publier sur GitHub
                </>
              )}
            </button>
          </>
        ) : (
          <p className="flex items-center gap-2 text-sm text-[var(--color-success)]">
            <CheckCircle2 size={15} /> Rien à publier — le site en ligne reflète déjà la base.
          </p>
        )}
      </div>

      {result?.error && (
        <div className="db-card border-[var(--color-danger)] bg-[var(--color-danger-light)] p-4 text-sm text-[var(--color-danger)]">
          Échec de la publication : {result.error}
          <p className="mt-1 text-xs">
            Résolvez le conflit depuis un terminal (git status), puis réessayez.
          </p>
        </div>
      )}

      <p className="text-xs text-[var(--color-muted)]">
        La publication régénère <code>src/data/menu.ts</code> et{' '}
        <code>src/data/images.ts</code>, puis effectue un commit et un push sur la branche
        courante. Seuls ces fichiers et <code>src/assets/photos/</code> sont concernés.
      </p>

      {confirming && (
        <ConfirmDialog
          title="Publier sur GitHub ?"
          message="La carte et les images seront envoyées sur le dépôt distant. Le site restera hors ligne tant que vous ne l'avez pas redéployé, mais l'historique Git sera à jour immédiatement."
          confirmLabel="Publier"
          onConfirm={handlePublish}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  );
}
