/**
 * REGISTRE D'IMAGES — L'ALLER RETOUR
 * ---------------------------------------------------------------------------
 * ⚠️ FICHIER GÉNÉRÉ — ne pas modifier à la main.
 * Généré par le tableau de bord (`npm run dashboard`) à partir de
 * `server/database.json`. Toute modification directe sera écrasée à la
 * prochaine publication.
 */

import escargotsPhoto from '@/assets/photos/escargots-1789145967123.jpg';
import tartareCharolaisPhoto from '@/assets/photos/tartare-charolais.jpg';
import ongletPhoto from '@/assets/photos/onglet.jpg';
import noixEntrecoteArgentinePhoto from '@/assets/photos/noix-entrecote-argentine.jpg';
import filetPhoto from '@/assets/photos/filet-1789145695440.jpg';
import coteDeBoeufPhoto from '@/assets/photos/cote-de-boeuf.jpg';
import fauxFiletPhoto from '@/assets/photos/faux-filet.jpg';

export type { ImageTone, ImageMotif, ImageAsset } from './images.types';
import type { ImageAsset } from './images.types';

export const IMAGES = {
  /* --- Images de page --- */
  hero: { alt: "Pièce de viande rouge grillée servie dans la salle de L'Aller Retour", tone: 'braise', motif: 'cote' },
  heroCave: { alt: 'Bouteilles alignées dans la cave du restaurant', tone: 'cave', motif: 'bouteille' },
  heroCarte: { alt: 'Table dressée avant le service', tone: 'nappe', motif: 'assiette' },
  heroViande: { alt: 'Côte de bœuf saisie sur la braise', tone: 'braise', motif: 'flamme' },
  heroRestaurant: { alt: "Salle du restaurant L'Aller Retour", tone: 'salle', motif: 'salle' },
  intro: { alt: 'Table de restaurant, viande et verres de vin rouge', tone: 'bois', motif: 'verre' },
  caveTeaser: { alt: 'Rangées de bouteilles dans la cave', tone: 'cave', motif: 'bouteille' },

  /* --- Entrées --- */
  escargots: {
    src: escargotsPhoto,
    alt: 'Escargots de Bourgogne',
    tone: 'bois',
    motif: 'escargot',
  },
  boudin: { alt: 'Boudins béarnais et ses pommes', tone: 'bois', motif: 'assiette' },
  pate: { alt: 'Pâté de campagne', tone: 'bois', motif: 'assiette' },
  osAMoelle: { alt: 'Os à moelle fendu, pain grillé et fleur de sel', tone: 'bois', motif: 'os' },
  burrata: { alt: 'Burrata et roquette', tone: 'nappe', motif: 'salade' },
  tartareOnglet: { alt: "Tartare d'onglet et moelle", tone: 'braise', motif: 'tartare' },

  /* --- La Viande --- */
  tartareCharolais: {
    src: tartareCharolaisPhoto,
    alt: 'Tartare de bœuf au couteau Charolais, œuf et frites',
    tone: 'braise',
    motif: 'tartare',
  },
  onglet: {
    src: ongletPhoto,
    alt: 'Onglet de bœuf irlandais grillé, frites, salade et sauces',
    tone: 'braise',
    motif: 'steak',
  },
  paveAngus: { alt: "Pavé d'Angus", tone: 'braise', motif: 'steak' },
  noixEntrecote: {
    src: noixEntrecoteArgentinePhoto,
    alt: "Noix d'entrecôte d'Argentine grillée, frites, salade et sauces",
    tone: 'braise',
    motif: 'steak',
  },
  filet: {
    src: filetPhoto,
    alt: 'Filet de bœuf grillé, frites, salade et sauces',
    tone: 'braise',
    motif: 'steak',
  },
  coteDeBoeuf: {
    src: coteDeBoeufPhoto,
    alt: 'Côte de bœuf pour deux personnes, tranchée, servie avec salade et frites',
    tone: 'braise',
    motif: 'cote',
  },
  fauxFilet: {
    src: fauxFiletPhoto,
    alt: 'Faux-filet pour deux personnes, tranché, salade et frites',
    tone: 'braise',
    motif: 'cote',
  },
  entrecoteVeau: { alt: 'Entrecôte de veau', tone: 'braise', motif: 'steak' },
  andouillette: { alt: 'Andouillette AAAAA', tone: 'bois', motif: 'assiette' },

  /* --- Pour les non-carnivores --- */
  salade: { alt: 'La salade du moment', tone: 'nappe', motif: 'salade' },

  /* --- Desserts --- */
  fromage: { alt: 'Assiette de fromage', tone: 'bois', motif: 'fromage' },
  tarteCitron: { alt: 'Tarte citron meringuée', tone: 'nappe', motif: 'dessert' },
  tarteChocolat: { alt: 'Tarte chocolat noir', tone: 'bois', motif: 'dessert' },
  moelleux: { alt: 'Moelleux aux noisettes, praliné amande', tone: 'bois', motif: 'dessert' },

  /* --- Galerie --- */
  galerieSalle1: { alt: 'Salle du restaurant', tone: 'salle', motif: 'salle' },
  galerieSalle2: { alt: 'Comptoir et banquettes', tone: 'bois', motif: 'salle' },
  galerieSalle3: { alt: 'Table dressée', tone: 'nappe', motif: 'assiette' },
  galerieViande1: { alt: 'Pièce de bœuf grillée', tone: 'braise', motif: 'steak' },
  galerieViande2: {
    src: coteDeBoeufPhoto,
    alt: 'Côte de bœuf tranchée, servie avec salade et frites',
    tone: 'braise',
    motif: 'cote',
  },
  galerieViande3: {
    src: tartareCharolaisPhoto,
    alt: 'Tartare de bœuf préparé au couteau, œuf et frites',
    tone: 'braise',
    motif: 'tartare',
  },
  galerieVin1: { alt: 'Bouteilles de la cave', tone: 'cave', motif: 'bouteille' },
  galerieVin2: { alt: 'Service du vin au verre', tone: 'cave', motif: 'verre' },
  galerieVin3: { alt: 'Casiers de la cave', tone: 'cave', motif: 'bouteille' },
  galerieDessert1: { alt: 'Tarte au chocolat noir', tone: 'bois', motif: 'dessert' },
  galerieDessert2: { alt: 'Assiette de fromage', tone: 'bois', motif: 'fromage' },
} satisfies Record<string, ImageAsset>;

export type ImageKey = keyof typeof IMAGES;

export function getImage(key: ImageKey): ImageAsset {
  return IMAGES[key];
}

/** Nombre de photos réelles branchées — utile pour un audit rapide du contenu. */
export const realPhotoCount = Object.values(IMAGES as Record<string, ImageAsset>).filter(
  (i) => Boolean(i.src),
).length;
