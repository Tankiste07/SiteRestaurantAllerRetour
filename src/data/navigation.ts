/** Navigation principale — partagée par l'en-tête, le menu mobile et le pied de page. */

export interface NavItem {
  label: string;
  to: string;
}

export const MAIN_NAV: NavItem[] = [
  { label: 'Accueil', to: '/' },
  { label: 'Le Restaurant', to: '/le-restaurant' },
  { label: 'La Carte', to: '/la-carte' },
  { label: 'La Viande', to: '/la-viande' },
  { label: 'La Cave', to: '/la-cave' },
  { label: 'Galerie', to: '/galerie' },
  { label: 'Contact', to: '/contact' },
];

export const LEGAL_NAV: NavItem[] = [
  { label: 'Mentions légales', to: '/mentions-legales' },
  { label: 'Politique de confidentialité', to: '/confidentialite' },
];
