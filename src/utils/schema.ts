/**
 * DONNÉES STRUCTURÉES SCHEMA.ORG
 * ---------------------------------------------------------------------------
 * Le balisage est construit uniquement à partir des informations réellement
 * connues. Adresse, téléphone, horaires et réseaux sociaux n'apparaissent
 * dans le JSON-LD que lorsqu'ils ont été renseignés dans `src/data/site.ts` :
 * aucune donnée n'est inventée pour « remplir » le schéma.
 */

import { CONTACT, OPENING_HOURS, SITE_DESCRIPTION, SITE_NAME, SOCIAL_LINKS } from '@/data/site';

type Json = Record<string, unknown>;

export function buildRestaurantSchema(): Json {
  const schema: Json = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    servesCuisine: ['Viandes rouges', 'Cuisine française'],
    acceptsReservations: true,
  };

  /* --- Adresse --- */
  const { street, postalCode, city, country } = CONTACT.address;
  if (street || postalCode || city) {
    const address: Json = { '@type': 'PostalAddress', addressCountry: country };
    if (street) address.streetAddress = street;
    if (postalCode) address.postalCode = postalCode;
    if (city) address.addressLocality = city;
    schema.address = address;
  }

  /* --- Contact --- */
  if (CONTACT.phone) schema.telephone = CONTACT.phone;
  if (CONTACT.email) schema.email = CONTACT.email;
  if (CONTACT.mapDirectionsUrl) schema.hasMap = CONTACT.mapDirectionsUrl;

  /* --- Horaires --- */
  const days = OPENING_HOURS.filter((day) => day.hours && !day.closed);
  if (days.length > 0) {
    schema.openingHoursSpecification = days.map((day) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${day.schemaDay}`,
      description: day.hours,
    }));
  }

  /* --- Réseaux sociaux --- */
  const profiles = SOCIAL_LINKS.map((link) => link.url).filter(Boolean);
  if (profiles.length > 0) schema.sameAs = profiles;

  return schema;
}
