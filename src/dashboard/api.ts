/**
 * Client API du tableau de bord.
 * Parle au serveur local (`server/`, démarré par `npm run dashboard`).
 * Les types sont importés directement du serveur (`import type`, effacé à
 * la compilation) pour ne jamais dévier du schéma réel de la base.
 */

import type {
  DbImage,
  DbMenuItem,
  ImageMotif,
  ImageTone,
  MenuCategoryId,
} from '../../server/db.ts';

export type { DbImage, DbMenuItem, ImageMotif, ImageTone, MenuCategoryId };

const API_BASE = 'http://localhost:4310/api';

export class ApiRequestError extends Error {}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, init);
  } catch {
    throw new ApiRequestError(
      "Impossible de joindre le serveur du tableau de bord. Vérifiez qu'il tourne (npm run dashboard).",
    );
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiRequestError(body.error ?? `Erreur ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/* -------------------------------------------------------------------------- */
/*  MÉTA                                                                       */
/* -------------------------------------------------------------------------- */

export interface Meta {
  categoryMeta: Record<MenuCategoryId, { title: string; eyebrow: string }>;
  categoryOrder: MenuCategoryId[];
  tones: ImageTone[];
  motifs: ImageMotif[];
  siteImageKeys: string[];
  galleryOnlyImageKeys: string[];
  lastPublishedAt: string | null;
  lastPublishedCommit: string | null;
}

export const getMeta = () => request<Meta>('/meta');

/* -------------------------------------------------------------------------- */
/*  IMAGES                                                                     */
/* -------------------------------------------------------------------------- */

export const getImages = () => request<DbImage[]>('/images');

export const patchImage = (key: string, patch: Partial<Pick<DbImage, 'alt' | 'tone' | 'motif'>>) =>
  request<DbImage>(`/images/${encodeURIComponent(key)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });

export async function uploadPhoto(key: string, file: File): Promise<DbImage> {
  const form = new FormData();
  form.append('photo', file);
  return request<DbImage>(`/images/${encodeURIComponent(key)}/photo`, {
    method: 'POST',
    body: form,
  });
}

export const removePhoto = (key: string) =>
  request<DbImage>(`/images/${encodeURIComponent(key)}/photo`, { method: 'DELETE' });

/** URL statique de la photo, servie directement par le serveur de dev Vite du dashboard. */
export function photoUrl(file: string | null): string | null {
  return file ? `/src/assets/photos/${file}` : null;
}

/* -------------------------------------------------------------------------- */
/*  CARTE                                                                      */
/* -------------------------------------------------------------------------- */

export const getMenu = () => request<DbMenuItem[]>('/menu');

export interface MenuItemInput {
  category: MenuCategoryId;
  name: string;
  description?: string;
  detail?: string;
  serves?: string;
  price?: number;
  priceUnit?: string;
  variants?: { label: string; price: number }[];
  options?: { label: string; price: number }[];
  tags?: 'SANS GLUTEN'[];
  priceMissing?: boolean;
  image?: { alt?: string; tone?: ImageTone; motif?: ImageMotif };
}

export const createMenuItem = (input: MenuItemInput) =>
  request<DbMenuItem>('/menu', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

export const updateMenuItem = (id: string, patch: Partial<MenuItemInput>) =>
  request<DbMenuItem>(`/menu/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });

export const deleteMenuItem = (id: string) =>
  request<void>(`/menu/${encodeURIComponent(id)}`, { method: 'DELETE' });

export const reorderCategory = (category: MenuCategoryId, orderedIds: string[]) =>
  request<DbMenuItem[]>('/menu/reorder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, orderedIds }),
  });

/* -------------------------------------------------------------------------- */
/*  PUBLICATION                                                                */
/* -------------------------------------------------------------------------- */

export interface PublishPreview {
  changed: boolean;
  status: string;
  diff: string;
}

export interface PublishResult {
  published: boolean;
  commit?: string;
  message?: string;
  error?: string;
}

export const previewPublish = () => request<PublishPreview>('/publish/preview');
export const doPublish = () => request<PublishResult>('/publish', { method: 'POST' });
