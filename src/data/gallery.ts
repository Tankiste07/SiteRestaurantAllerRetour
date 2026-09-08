/**
 * GALERIE
 * ---------------------------------------------------------------------------
 * Chaque entrée pointe vers un slot du registre d'images (`images.ts`).
 * Tant qu'aucune photographie réelle n'est branchée, la galerie affiche les
 * visuels de substitution — la mise en page est donc déjà celle du site final.
 *
 * Pour ajouter une photo : créer le slot dans `images.ts`, puis l'ajouter ici.
 */

import type { ImageKey } from './images';

export type GalleryCategoryId = 'restaurant' | 'viandes' | 'vins' | 'desserts';

export interface GalleryItem {
  id: string;
  imageKey: ImageKey;
  category: GalleryCategoryId;
  /** Vignette mise en avant : occupe deux colonnes sur grand écran. */
  wide?: boolean;
}

export const GALLERY_CATEGORIES: { id: GalleryCategoryId; label: string }[] = [
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'viandes', label: 'Viandes' },
  { id: 'vins', label: 'Vins' },
  { id: 'desserts', label: 'Desserts' },
];

export const galleryItems: GalleryItem[] = [
  { id: 'g-01', imageKey: 'galerieSalle1', category: 'restaurant', wide: true },
  { id: 'g-02', imageKey: 'galerieViande1', category: 'viandes' },
  { id: 'g-03', imageKey: 'galerieVin1', category: 'vins' },
  { id: 'g-04', imageKey: 'galerieViande2', category: 'viandes', wide: true },
  { id: 'g-05', imageKey: 'galerieSalle2', category: 'restaurant' },
  { id: 'g-06', imageKey: 'galerieDessert1', category: 'desserts' },
  { id: 'g-07', imageKey: 'galerieVin2', category: 'vins' },
  { id: 'g-08', imageKey: 'galerieViande3', category: 'viandes', wide: true },
  { id: 'g-09', imageKey: 'galerieSalle3', category: 'restaurant' },
  { id: 'g-10', imageKey: 'galerieVin3', category: 'vins', wide: true },
  { id: 'g-11', imageKey: 'galerieDessert2', category: 'desserts' },
  { id: 'g-12', imageKey: 'coteDeBoeuf', category: 'viandes' },
  { id: 'g-13', imageKey: 'tarteCitron', category: 'desserts' },
  { id: 'g-14', imageKey: 'moelleux', category: 'desserts' },
  { id: 'g-15', imageKey: 'heroRestaurant', category: 'restaurant' },
  { id: 'g-16', imageKey: 'tartareCharolais', category: 'viandes' },
];
