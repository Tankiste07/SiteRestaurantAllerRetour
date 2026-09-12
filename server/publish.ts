/**
 * PUBLICATION — régénère les fichiers de données puis les envoie sur GitHub.
 * ---------------------------------------------------------------------------
 * Ne touche jamais qu'un périmètre restreint et connu du dépôt :
 * `src/data/images.ts`, `src/data/menu.ts` et `src/assets/photos/`.
 * Aucun `git add -A` : le reste du dépôt (travail en cours éventuel) n'est
 * jamais concerné par cette action.
 */

import { execFile } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';
import { openDb, SERVER_DIR } from './db.ts';
import { writeGeneratedFiles } from './codegen.ts';

const run = promisify(execFile);

const ROOT = path.join(SERVER_DIR, '..');

const TRACKED_PATHS = [
  'src/data/images.ts',
  'src/data/menu.ts',
  'src/data/wines.ts',
  'src/assets/photos',
];

async function git(args: string[]): Promise<string> {
  const { stdout } = await run('git', args, { cwd: ROOT, maxBuffer: 1024 * 1024 * 20 });
  return stdout;
}

export interface PublishPreview {
  changed: boolean;
  /** Sortie de `git status --porcelain`, limitée au périmètre géré. */
  status: string;
  /** Diff textuel des fichiers de données générés. */
  diff: string;
}

export async function previewPublish(): Promise<PublishPreview> {
  const db = await openDb();
  await writeGeneratedFiles(db);

  const status = (await git(['status', '--porcelain', '--', ...TRACKED_PATHS])).trim();
  const diff = await git([
    'diff',
    '--',
    'src/data/images.ts',
    'src/data/menu.ts',
    'src/data/wines.ts',
  ]);

  return { changed: status.length > 0, status, diff };
}

export interface PublishResult {
  published: boolean;
  commit?: string;
  message?: string;
  error?: string;
}

export async function publish(): Promise<PublishResult> {
  const preview = await previewPublish();
  if (!preview.changed) {
    return { published: false, message: 'Aucune modification à publier.' };
  }

  try {
    await git(['add', '--', ...TRACKED_PATHS]);

    const summary =
      'Mise à jour du contenu via le tableau de bord\n\n' +
      'Carte et/ou images modifiées depuis le tableau de bord local.\n\n' +
      'Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>';
    await git(['commit', '-m', summary]);

    const revParse = await git(['rev-parse', '--short', 'HEAD']);
    const commit = revParse.trim();

    await git(['push']);

    const db = await openDb();
    db.data.meta.lastPublishedAt = new Date().toISOString();
    db.data.meta.lastPublishedCommit = commit;
    await db.write();

    return { published: true, commit };
  } catch (error) {
    return { published: false, error: error instanceof Error ? error.message : String(error) };
  }
}
