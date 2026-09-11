/** Utilitaires de normalisation de texte pour générer clés et noms de fichiers. */

function stripDiacritics(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '');
}

/** « Pavé de Bison » → « pave-de-bison » (nom de fichier, slug d'URL). */
export function toKebabCase(value: string): string {
  return stripDiacritics(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/** « Pavé de Bison » → « paveDeBison » (clé d'objet / identifiant JS). */
export function toCamelCase(value: string): string {
  const words = toKebabCase(value).split('-').filter(Boolean);
  if (words.length === 0) return 'image';
  return words
    .map((word, index) => (index === 0 ? word : word[0].toUpperCase() + word.slice(1)))
    .join('');
}

/** Ajoute un suffixe numérique jusqu'à obtenir une valeur absente de `taken`. */
export function uniqueAmong(base: string, taken: Set<string>): string {
  if (!taken.has(base)) return base;
  let index = 2;
  while (taken.has(`${base}${index}`)) index += 1;
  return `${base}${index}`;
}
