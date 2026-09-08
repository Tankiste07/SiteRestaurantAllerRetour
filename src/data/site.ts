/**
 * CONFIGURATION DU SITE — L'ALLER RETOUR
 * ---------------------------------------------------------------------------
 * Point d'entrée unique pour toutes les informations pratiques.
 * Tout ce qui vaut `null` n'a PAS été communiqué : rien n'est inventé.
 * Renseignez simplement la valeur, l'interface s'adapte automatiquement
 * (les placeholders disparaissent, les liens deviennent cliquables,
 * les données structurées Schema.org s'enrichissent).
 */

export const SITE_NAME = "L'Aller Retour";
export const SITE_TAGLINE = "Viandes d'exception & vins de caractère";
export const SITE_DESCRIPTION =
  "Restaurant de viandes rouges et de vins. Pièces d'exception, tartare au couteau, côte de bœuf, et une cave de plus de 300 références.";

/**
 * TODO — Lien de réservation.
 * Renseigner l'URL du module de réservation (TheFork, Zenchef, Guestonline…).
 * Tant que la valeur est `null`, tous les boutons « Réserver » basculent
 * automatiquement sur le téléphone, ou sont désactivés proprement.
 */
export const RESERVATION_URL: string | null = null;

/** Ouvre le lien de réservation dans un nouvel onglet lorsqu'il est externe. */
export const RESERVATION_OPENS_NEW_TAB = true;

/* -------------------------------------------------------------------------- */
/*  COORDONNÉES — à compléter                                                  */
/* -------------------------------------------------------------------------- */

export interface Address {
  street: string | null;
  postalCode: string | null;
  city: string | null;
  country: string;
}

/** Adresse telle que communiquée, encodée pour les liens Google Maps. */
const MAPS_QUERY = encodeURIComponent('5 Rue Charles-François Dupuis, 75003 Paris');

export const CONTACT = {
  address: {
    street: '5 Rue Charles-François Dupuis',
    postalCode: '75003',
    city: 'Paris',
    country: 'France',
  } as Address,

  phone: '+33142780121' as string | null,
  phoneDisplay: '01 42 78 01 21' as string | null,

  /** TODO — Adresse e-mail de contact. */
  email: null as string | null,

  /** Intégration Google Maps sans clé d'API, construite depuis l'adresse ci-dessus. */
  mapEmbedUrl: `https://www.google.com/maps?q=${MAPS_QUERY}&output=embed` as string | null,
  mapDirectionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${MAPS_QUERY}` as
    | string
    | null,
} as const;

/** Libellés affichés tant que l'information n'est pas fournie. */
export const PLACEHOLDERS = {
  address: '[ADRESSE DU RESTAURANT]',
  phone: '[TÉLÉPHONE]',
  email: '[EMAIL]',
  hours: '[HORAIRES]',
  map: '[CARTE GOOGLE MAPS]',
} as const;

/* -------------------------------------------------------------------------- */
/*  HORAIRES — à compléter                                                     */
/* -------------------------------------------------------------------------- */

export interface OpeningDay {
  /** Jour affiché. */
  day: string;
  /** Ex. « 12h00 – 14h00 · 19h00 – 22h30 ». `null` tant que non fourni. */
  hours: string | null;
  /** `true` si le restaurant est fermé ce jour-là. */
  closed?: boolean;
  /** Format Schema.org, ex. « Mo », « Tu »… Utilisé pour openingHoursSpecification. */
  schemaDay: string;
}

export const OPENING_HOURS: OpeningDay[] = [
  { day: 'Lundi', hours: '19h00 – 23h00', schemaDay: 'Monday' },
  { day: 'Mardi', hours: '19h00 – 23h00', schemaDay: 'Tuesday' },
  { day: 'Mercredi', hours: '19h00 – 23h00', schemaDay: 'Wednesday' },
  { day: 'Jeudi', hours: '12h00 – 14h30 · 19h00 – 23h00', schemaDay: 'Thursday' },
  { day: 'Vendredi', hours: '12h00 – 14h30 · 19h00 – 23h30', schemaDay: 'Friday' },
  { day: 'Samedi', hours: '18h30 – 23h30', schemaDay: 'Saturday' },
  { day: 'Dimanche', hours: '19h00 – 23h00', schemaDay: 'Sunday' },
];

/* -------------------------------------------------------------------------- */
/*  RÉSEAUX SOCIAUX — à compléter                                              */
/* -------------------------------------------------------------------------- */

export interface SocialLink {
  label: string;
  /** `null` : le lien n'est pas affiché. Aucune URL n'est inventée. */
  url: string | null;
  icon: 'instagram' | 'facebook' | 'tripadvisor';
}

/** TODO — Renseigner les URLs réelles pour faire apparaître les icônes. */
export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'Instagram', url: null, icon: 'instagram' },
  { label: 'Facebook', url: null, icon: 'facebook' },
  { label: 'Tripadvisor', url: null, icon: 'tripadvisor' },
];

/* -------------------------------------------------------------------------- */
/*  CAVE                                                                       */
/* -------------------------------------------------------------------------- */

/** Informations communiquées par le restaurant à propos de la cave. */
export const CELLAR = {
  /** « Plus de 300 références » — information fournie par le restaurant. */
  announcedReferences: 300,
  priceMin: 32,
  priceMax: 999,
  /** Seuil (en €) à partir duquel une bouteille reçoit le badge « Prestige ». */
  prestigeThreshold: 150,
} as const;
