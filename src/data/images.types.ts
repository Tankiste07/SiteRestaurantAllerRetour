/**
 * TYPES DU REGISTRE D'IMAGES — L'ALLER RETOUR
 * ---------------------------------------------------------------------------
 * Fichier stable, jamais régénéré : `src/data/images.ts` (les DONNÉES) est
 * généré par le tableau de bord et importe ces types.
 */

/** Ambiance chromatique du visuel de substitution. */
export type ImageTone = 'braise' | 'cave' | 'salle' | 'bois' | 'nappe';

/** Gravure au trait affichée au centre du visuel de substitution. */
export type ImageMotif =
  | 'steak'
  | 'cote'
  | 'tartare'
  | 'bouteille'
  | 'verre'
  | 'fromage'
  | 'dessert'
  | 'salade'
  | 'escargot'
  | 'os'
  | 'assiette'
  | 'salle'
  | 'flamme';

export interface ImageAsset {
  /** Laissé `undefined` tant qu'aucune photo réelle n'est branchée. */
  src?: string;
  alt: string;
  tone: ImageTone;
  motif: ImageMotif;
}
