/**
 * GÉNÉRATION DES FICHIERS DE DONNÉES
 * ---------------------------------------------------------------------------
 * Transforme l'état de la base (`database.json`) en fichiers TypeScript
 * `src/data/images.ts` et `src/data/menu.ts`, dans le même style que les
 * fichiers écrits à la main qu'ils remplacent. Les types restent dans
 * `images.types.ts` / `menu.types.ts`, jamais régénérés.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  DATA_DIR,
  GALLERY_ONLY_IMAGE_KEYS,
  SITE_IMAGE_KEYS,
  type Db,
  type DbImage,
  type DbMenuItem,
  type MenuCategoryId,
} from './db.ts';
import { toCamelCase } from './slug.ts';

/* -------------------------------------------------------------------------- */
/*  SÉRIALISATION                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Choisit le guillemet le plus lisible, comme le ferait un développeur :
 * double guillemet quand la chaîne contient une apostrophe (très fréquent en
 * français — « Pavé d'Angus »), simple guillemet sinon.
 */
function jsString(value: string): string {
  const hasSingle = value.includes("'");
  const hasDouble = value.includes('"');
  const quote = hasSingle && !hasDouble ? '"' : "'";
  const escaped = value.replace(/\\/g, '\\\\').replace(new RegExp(quote, 'g'), `\\${quote}`);
  return `${quote}${escaped}${quote}`;
}

function serialize(value: unknown, indent: number): string {
  const pad = '  '.repeat(indent);
  const padClose = '  '.repeat(indent - 1);

  if (value === null || value === undefined) return 'undefined';
  if (typeof value === 'string') return jsString(value);
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const items = value.map((v) => `${pad}${serialize(v, indent + 1)},`).join('\n');
    return `[\n${items}\n${padClose}]`;
  }

  const entries = Object.entries(value as Record<string, unknown>).filter(
    ([, v]) => v !== undefined,
  );
  if (entries.length === 0) return '{}';
  const body = entries
    .map(([k, v]) => `${pad}${k}: ${serialize(v, indent + 1)},`)
    .join('\n');
  return `{\n${body}\n${padClose}}`;
}

/** Reprend uniquement les champs publics d'un plat, dans l'ordre éditorial habituel. */
function menuItemLiteral(item: DbMenuItem): Record<string, unknown> {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    detail: item.detail,
    serves: item.serves,
    price: item.price,
    priceUnit: item.priceUnit,
    variants: item.variants,
    options: item.options,
    tags: item.tags,
    imageKey: item.imageKey,
    priceMissing: item.priceMissing,
  };
}

function categoryVarName(category: MenuCategoryId): string {
  return category === 'non-carnivores' ? 'nonCarnivores' : category;
}

/* -------------------------------------------------------------------------- */
/*  IMAGES.TS                                                                  */
/* -------------------------------------------------------------------------- */

function importIdentFromFile(file: string): string {
  // Retire l'horodatage ajouté par l'envoi depuis le tableau de bord
  // (`onglet-1789145695440.jpg` → `onglet`), pour un nom de variable lisible.
  const base = file.replace(/\.[^.]+$/, '').replace(/-\d{6,}$/, '');
  return `${toCamelCase(base)}Photo`;
}

function imageEntryLine(key: string, img: DbImage, importIdent: string | null): string {
  const alt = jsString(img.alt);
  if (importIdent) {
    return (
      `  ${key}: {\n` +
      `    src: ${importIdent},\n` +
      `    alt: ${alt},\n` +
      `    tone: '${img.tone}',\n` +
      `    motif: '${img.motif}',\n` +
      `  },`
    );
  }
  return `  ${key}: { alt: ${alt}, tone: '${img.tone}', motif: '${img.motif}' },`;
}

function generateImagesFile(db: Db): string {
  const byKey = new Map(db.data.images.map((img) => [img.key, img]));

  // Une seule importation par fichier physique, réutilisée partout où il apparaît
  // (ex. la même photo pour la carte ET la galerie), comme dans le fichier d'origine.
  const fileToIdent = new Map<string, string>();
  const usedIdents = new Set<string>();
  for (const img of db.data.images) {
    if (!img.file || fileToIdent.has(img.file)) continue;
    let ident = importIdentFromFile(img.file);
    let n = 2;
    while (usedIdents.has(ident)) ident = `${importIdentFromFile(img.file)}${n++}`;
    usedIdents.add(ident);
    fileToIdent.set(img.file, ident);
  }

  const imports = [...fileToIdent.entries()]
    .map(([file, ident]) => `import ${ident} from '@/assets/photos/${file}';`)
    .join('\n');

  const emitted = new Set<string>();
  const sections: string[] = [];

  const emitSection = (title: string, keys: string[]) => {
    const lines = keys
      .filter((key) => byKey.has(key) && !emitted.has(key))
      .map((key) => {
        emitted.add(key);
        const img = byKey.get(key)!;
        const ident = img.file ? (fileToIdent.get(img.file) ?? null) : null;
        return imageEntryLine(key, img, ident);
      });
    if (lines.length === 0) return;
    sections.push(`  /* --- ${title} --- */\n${lines.join('\n')}`);
  };

  emitSection('Images de page', [...SITE_IMAGE_KEYS]);

  for (const category of CATEGORY_ORDER) {
    const keys = db.data.menu
      .filter((item) => item.category === category)
      .sort((a, b) => a.order - b.order)
      .map((item) => item.imageKey)
      .filter((key): key is string => Boolean(key));
    emitSection(CATEGORY_META[category].title, keys);
  }

  emitSection('Galerie', [...GALLERY_ONLY_IMAGE_KEYS]);

  // Emplacements créés depuis le tableau de bord mais non couverts ci-dessus
  // (filet de sécurité — ne devrait normalement rien produire).
  const remaining = db.data.images.map((i) => i.key).filter((key) => !emitted.has(key));
  emitSection('Autres', remaining);

  return `/**
 * REGISTRE D'IMAGES — L'ALLER RETOUR
 * ---------------------------------------------------------------------------
 * ⚠️ FICHIER GÉNÉRÉ — ne pas modifier à la main.
 * Généré par le tableau de bord (\`npm run dashboard\`) à partir de
 * \`server/database.json\`. Toute modification directe sera écrasée à la
 * prochaine publication.
 */

${imports}

export type { ImageTone, ImageMotif, ImageAsset } from './images.types';
import type { ImageAsset } from './images.types';

export const IMAGES = {
${sections.join('\n\n')}
} satisfies Record<string, ImageAsset>;

export type ImageKey = keyof typeof IMAGES;

export function getImage(key: ImageKey): ImageAsset {
  return IMAGES[key];
}

/** Nombre de photos réelles branchées — utile pour un audit rapide du contenu. */
export const realPhotoCount = Object.values(IMAGES as Record<string, ImageAsset>).filter(
  (i) => Boolean(i.src),
).length;
`;
}

/* -------------------------------------------------------------------------- */
/*  MENU.TS                                                                    */
/* -------------------------------------------------------------------------- */

function generateMenuFile(db: Db): string {
  const categoryBlocks = CATEGORY_ORDER.map((category) => {
    const items = db.data.menu
      .filter((item) => item.category === category)
      .sort((a, b) => a.order - b.order)
      .map((item) => menuItemLiteral(item));
    const varName = categoryVarName(category);
    const title = CATEGORY_META[category].title.toUpperCase();
    return (
      `/* -------------------------------------------------------------------------- */\n` +
      `/*  ${title}${' '.repeat(Math.max(1, 74 - title.length))}*/\n` +
      `/* -------------------------------------------------------------------------- */\n\n` +
      `export const ${varName}: MenuItem[] = ${serialize(items, 1)};`
    );
  });

  const categoriesLiteral = CATEGORY_ORDER.map((category) => {
    const meta = CATEGORY_META[category];
    return (
      `  {\n` +
      `    id: '${category}',\n` +
      `    title: ${jsString(meta.title)},\n` +
      `    eyebrow: ${jsString(meta.eyebrow)},\n` +
      `    items: ${categoryVarName(category)},\n` +
      `  },`
    );
  }).join('\n');

  return `/**
 * LA CARTE — L'ALLER RETOUR
 * ---------------------------------------------------------------------------
 * ⚠️ FICHIER GÉNÉRÉ — ne pas modifier à la main.
 * Généré par le tableau de bord (\`npm run dashboard\`) à partir de
 * \`server/database.json\`. Toute modification directe sera écrasée à la
 * prochaine publication.
 */

export type {
  MenuCategoryId,
  PriceVariant,
  MenuOption,
  MenuTag,
  MenuItem,
  MenuCategory,
} from './menu.types';
import type { MenuItem, MenuCategory } from './menu.types';

${categoryBlocks.join('\n\n')}

/* -------------------------------------------------------------------------- */
/*  ASSEMBLAGE                                                                 */
/* -------------------------------------------------------------------------- */

export const menuCategories: MenuCategory[] = [
${categoriesLiteral}
];

/** Tous les plats, toutes catégories confondues. */
export const allMenuItems: MenuItem[] = menuCategories.flatMap((c) => c.items);
`;
}

/* -------------------------------------------------------------------------- */
/*  ÉCRITURE                                                                   */
/* -------------------------------------------------------------------------- */

export interface GeneratedFiles {
  imagesTs: string;
  menuTs: string;
}

export function generateFiles(db: Db): GeneratedFiles {
  return { imagesTs: generateImagesFile(db), menuTs: generateMenuFile(db) };
}

export async function writeGeneratedFiles(db: Db): Promise<GeneratedFiles> {
  const files = generateFiles(db);
  await fs.writeFile(path.join(DATA_DIR, 'images.ts'), files.imagesTs, 'utf8');
  await fs.writeFile(path.join(DATA_DIR, 'menu.ts'), files.menuTs, 'utf8');
  return files;
}
