/** Formatage typographique français (prix, listes, texte). */

const withDecimals = new Intl.NumberFormat('fr-FR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const withoutDecimals = new Intl.NumberFormat('fr-FR', {
  maximumFractionDigits: 0,
});

/**
 * Prix à la française : `18 €`, `8,50 €`, `1 250 €`.
 * L'espace avant le symbole est une espace insécable étroite (U+202F),
 * conformément à l'usage typographique français.
 */
export function formatPrice(value: number): string {
  return `${formatAmount(value)} €`;
}

/** Prix sans le symbole — utile lorsque l'unité est affichée séparément. */
export function formatAmount(value: number): string {
  return Number.isInteger(value) ? withoutDecimals.format(value) : withDecimals.format(value);
}

/**
 * Retire les signes diacritiques et passe en minuscules, pour une recherche
 * insensible à la casse ET aux accents (« Château » trouve « chateau »).
 */
export function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim();
}

/** Assemble des fragments non vides avec un séparateur. */
export function joinDefined(
  parts: (string | number | null | undefined)[],
  separator = ' · ',
): string {
  return parts.filter((p) => p !== null && p !== undefined && p !== '').join(separator);
}

/** Accord singulier / pluriel simple. */
export function plural(count: number, singular: string, pluralForm?: string): string {
  return count > 1 ? (pluralForm ?? `${singular}s`) : singular;
}
