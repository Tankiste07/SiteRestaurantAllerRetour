/**
 * API DU TABLEAU DE BORD — L'ALLER RETOUR
 * ---------------------------------------------------------------------------
 * Serveur local (dev uniquement, jamais déployé) exposant la carte et les
 * images à `src/dashboard`. Toute écriture régénère `src/data/*.ts` au
 * moment de la publication (voir `publish.ts`), jamais à chaud.
 */

import path from 'node:path';
import { promises as fs } from 'node:fs';
import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import multer from 'multer';
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  GALLERY_ONLY_IMAGE_KEYS,
  MOTIFS,
  PHOTOS_DIR,
  SITE_IMAGE_KEYS,
  TONES,
  WINE_CATEGORY_META,
  WINE_CATEGORY_ORDER,
  WINE_COLORS,
  WINE_SUBCATEGORY_ORDER,
  openDb,
  type DbImage,
  type DbMenuItem,
  type DbWine,
  type ImageMotif,
  type ImageTone,
  type MenuCategoryId,
  type WineCategoryId,
  type WineColor,
} from './db.ts';
import { compressToJpeg } from './compress.ts';
import { previewPublish, publish } from './publish.ts';
import { toCamelCase, toKebabCase, uniqueAmong } from './slug.ts';

/* -------------------------------------------------------------------------- */
/*  VALIDATION LÉGÈRE                                                          */
/* -------------------------------------------------------------------------- */

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function asHandler(fn: (req: Request, res: Response) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res).catch(next);
  };
}

function isTone(value: unknown): value is ImageTone {
  return typeof value === 'string' && (TONES as string[]).includes(value);
}
function isMotif(value: unknown): value is ImageMotif {
  return typeof value === 'string' && (MOTIFS as string[]).includes(value);
}
function isCategory(value: unknown): value is MenuCategoryId {
  return typeof value === 'string' && (CATEGORY_ORDER as string[]).includes(value);
}
function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
function isWineCategory(value: unknown): value is WineCategoryId {
  return typeof value === 'string' && (WINE_CATEGORY_ORDER as string[]).includes(value);
}
function isWineColor(value: unknown): value is WineColor {
  return typeof value === 'string' && (WINE_COLORS as string[]).includes(value);
}
/** Un vin de cette catégorie doit avoir l'une des sous-catégories prévues — ni plus, ni moins. */
function isValidWineSubcategory(category: WineCategoryId, value: unknown): value is string | undefined {
  const allowed = WINE_SUBCATEGORY_ORDER[category];
  if (!allowed) return value === undefined;
  return typeof value === 'string' && allowed.includes(value);
}

interface RawVariant {
  label?: unknown;
  price?: unknown;
}

function parsePriceList(value: unknown, field: string): { label: string; price: number }[] | undefined {
  if (value === undefined || value === null) return undefined;
  if (!Array.isArray(value)) throw new ApiError(400, `${field} doit être une liste.`);
  return value.map((entry: RawVariant, index: number) => {
    if (!isNonEmptyString(entry.label) || typeof entry.price !== 'number') {
      throw new ApiError(400, `${field}[${index}] doit avoir un libellé et un prix.`);
    }
    return { label: entry.label, price: entry.price };
  });
}

/* -------------------------------------------------------------------------- */
/*  APPLICATION                                                                */
/* -------------------------------------------------------------------------- */

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '2mb' }));

  const dbPromise = openDb();

  /* ------------------------------ Métadonnées ------------------------------ */

  app.get(
    '/api/meta',
    asHandler(async (_req, res) => {
      const db = await dbPromise;
      res.json({
        categoryMeta: CATEGORY_META,
        categoryOrder: CATEGORY_ORDER,
        tones: TONES,
        motifs: MOTIFS,
        siteImageKeys: SITE_IMAGE_KEYS,
        galleryOnlyImageKeys: GALLERY_ONLY_IMAGE_KEYS,
        wineCategoryMeta: WINE_CATEGORY_META,
        wineCategoryOrder: WINE_CATEGORY_ORDER,
        wineSubcategoryOrder: WINE_SUBCATEGORY_ORDER,
        wineColors: WINE_COLORS,
        lastPublishedAt: db.data.meta.lastPublishedAt,
        lastPublishedCommit: db.data.meta.lastPublishedCommit,
      });
    }),
  );

  /* -------------------------------- Images --------------------------------- */

  app.get(
    '/api/images',
    asHandler(async (_req, res) => {
      const db = await dbPromise;
      res.json(db.data.images);
    }),
  );

  app.patch(
    '/api/images/:key',
    asHandler(async (req, res) => {
      const db = await dbPromise;
      const image = db.data.images.find((i) => i.key === req.params.key);
      if (!image) throw new ApiError(404, 'Image introuvable.');

      const { alt, tone, motif } = req.body as Partial<DbImage>;
      if (alt !== undefined) {
        if (!isNonEmptyString(alt)) throw new ApiError(400, 'Texte alternatif invalide.');
        image.alt = alt;
      }
      if (tone !== undefined) {
        if (!isTone(tone)) throw new ApiError(400, 'Ambiance invalide.');
        image.tone = tone;
      }
      if (motif !== undefined) {
        if (!isMotif(motif)) throw new ApiError(400, 'Motif invalide.');
        image.motif = motif;
      }
      await db.write();
      res.json(image);
    }),
  );

  const upload = multer({
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, PHOTOS_DIR),
      filename: (req, file, cb) => {
        const rawKey = req.params.key;
        const key = Array.isArray(rawKey) ? rawKey[0] : rawKey;
        const ext = path.extname(file.originalname) || '.jpg';
        cb(null, `${toKebabCase(key)}-${Date.now()}${ext}`);
      },
    }),
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      if (!/^image\//.test(file.mimetype)) {
        cb(new ApiError(400, 'Le fichier doit être une image.'));
        return;
      }
      cb(null, true);
    },
  });

  app.post(
    '/api/images/:key/photo',
    upload.single('photo'),
    asHandler(async (req, res) => {
      const db = await dbPromise;
      const image = db.data.images.find((i) => i.key === req.params.key);
      if (!image || !req.file) throw new ApiError(404, 'Image introuvable.');

      const previousFile = image.file;
      const finalName = await compressToJpeg(path.join(PHOTOS_DIR, req.file.filename));
      image.file = finalName;
      await db.write();

      // Nettoyage de l'ancienne photo si elle n'est plus référencée par
      // aucun autre emplacement (une même photo peut être partagée).
      if (previousFile && previousFile !== finalName) {
        const stillUsed = db.data.images.some((i) => i.file === previousFile);
        if (!stillUsed) {
          await fs.rm(path.join(PHOTOS_DIR, previousFile), { force: true });
        }
      }

      res.json(image);
    }),
  );

  app.delete(
    '/api/images/:key/photo',
    asHandler(async (req, res) => {
      const db = await dbPromise;
      const image = db.data.images.find((i) => i.key === req.params.key);
      if (!image) throw new ApiError(404, 'Image introuvable.');

      if (image.file) {
        const stillUsed = db.data.images.some(
          (i) => i.key !== image.key && i.file === image.file,
        );
        if (!stillUsed) {
          await fs.rm(path.join(PHOTOS_DIR, image.file), { force: true });
        }
        image.file = null;
        await db.write();
      }
      res.json(image);
    }),
  );

  /* --------------------------------- Carte ---------------------------------- */

  app.get(
    '/api/menu',
    asHandler(async (_req, res) => {
      const db = await dbPromise;
      res.json(db.data.menu);
    }),
  );

  app.post(
    '/api/menu',
    asHandler(async (req, res) => {
      const db = await dbPromise;
      const body = req.body as Record<string, unknown>;

      if (!isNonEmptyString(body.name)) throw new ApiError(400, 'Le nom du plat est requis.');
      if (!isCategory(body.category)) throw new ApiError(400, 'Catégorie invalide.');

      const category = body.category;
      const siblings = db.data.menu.filter((i) => i.category === category);
      const order = siblings.length === 0 ? 0 : Math.max(...siblings.map((i) => i.order)) + 1;

      const takenIds = new Set(db.data.menu.map((i) => i.id));
      const id = uniqueAmong(toKebabCase(body.name), takenIds);

      // Crée automatiquement un emplacement d'image dédié pour ce nouveau plat.
      const takenImageKeys = new Set(db.data.images.map((i) => i.key));
      const imageKey = uniqueAmong(toCamelCase(body.name), takenImageKeys);
      const rawImage = (body.image as Record<string, unknown>) ?? {};
      const tone = isTone(rawImage.tone) ? rawImage.tone : 'bois';
      const motif = isMotif(rawImage.motif) ? rawImage.motif : 'assiette';
      const alt = isNonEmptyString(rawImage.alt) ? rawImage.alt : body.name;
      db.data.images.push({ key: imageKey, alt, tone, motif, file: null, protected: false });

      const item: DbMenuItem = {
        id,
        category,
        order,
        name: body.name,
        description: isNonEmptyString(body.description) ? body.description : undefined,
        detail: isNonEmptyString(body.detail) ? body.detail : undefined,
        serves: isNonEmptyString(body.serves) ? body.serves : undefined,
        price: typeof body.price === 'number' ? body.price : undefined,
        priceUnit: isNonEmptyString(body.priceUnit) ? body.priceUnit : undefined,
        variants: parsePriceList(body.variants, 'variants'),
        options: parsePriceList(body.options, 'options'),
        tags: Array.isArray(body.tags) ? (body.tags as 'SANS GLUTEN'[]) : undefined,
        priceMissing: body.priceMissing === true,
        imageKey,
      };

      db.data.menu.push(item);
      await db.write();
      res.status(201).json(item);
    }),
  );

  app.put(
    '/api/menu/:id',
    asHandler(async (req, res) => {
      const db = await dbPromise;
      const item = db.data.menu.find((i) => i.id === req.params.id);
      if (!item) throw new ApiError(404, 'Plat introuvable.');

      const body = req.body as Record<string, unknown>;

      if (body.name !== undefined) {
        if (!isNonEmptyString(body.name)) throw new ApiError(400, 'Nom invalide.');
        item.name = body.name;
      }
      if (body.category !== undefined) {
        if (!isCategory(body.category)) throw new ApiError(400, 'Catégorie invalide.');
        if (body.category !== item.category) {
          const siblings = db.data.menu.filter(
            (i) => i.category === body.category && i.id !== item.id,
          );
          item.order = siblings.length === 0 ? 0 : Math.max(...siblings.map((i) => i.order)) + 1;
          item.category = body.category;
        }
      }
      if (body.description !== undefined) {
        item.description = isNonEmptyString(body.description) ? body.description : undefined;
      }
      if (body.detail !== undefined) {
        item.detail = isNonEmptyString(body.detail) ? body.detail : undefined;
      }
      if (body.serves !== undefined) {
        item.serves = isNonEmptyString(body.serves) ? body.serves : undefined;
      }
      if (body.price !== undefined) {
        item.price = typeof body.price === 'number' ? body.price : undefined;
      }
      if (body.priceUnit !== undefined) {
        item.priceUnit = isNonEmptyString(body.priceUnit) ? body.priceUnit : undefined;
      }
      if (body.variants !== undefined) item.variants = parsePriceList(body.variants, 'variants');
      if (body.options !== undefined) item.options = parsePriceList(body.options, 'options');
      if (body.tags !== undefined) {
        item.tags = Array.isArray(body.tags) ? (body.tags as 'SANS GLUTEN'[]) : undefined;
      }
      if (body.priceMissing !== undefined) item.priceMissing = body.priceMissing === true;

      await db.write();
      res.json(item);
    }),
  );

  app.delete(
    '/api/menu/:id',
    asHandler(async (req, res) => {
      const db = await dbPromise;
      const index = db.data.menu.findIndex((i) => i.id === req.params.id);
      if (index === -1) throw new ApiError(404, 'Plat introuvable.');

      const [item] = db.data.menu.splice(index, 1);

      if (item.imageKey) {
        const image = db.data.images.find((i) => i.key === item.imageKey);
        const stillReferenced = db.data.menu.some((i) => i.imageKey === item.imageKey);
        if (image && !image.protected && !stillReferenced) {
          if (image.file) {
            const stillUsed = db.data.images.some(
              (i) => i.key !== image.key && i.file === image.file,
            );
            if (!stillUsed) await fs.rm(path.join(PHOTOS_DIR, image.file), { force: true });
          }
          db.data.images = db.data.images.filter((i) => i.key !== item.imageKey);
        }
      }

      await db.write();
      res.status(204).end();
    }),
  );

  app.post(
    '/api/menu/reorder',
    asHandler(async (req, res) => {
      const db = await dbPromise;
      const { category, orderedIds } = req.body as { category?: unknown; orderedIds?: unknown };
      if (!isCategory(category) || !Array.isArray(orderedIds)) {
        throw new ApiError(400, 'Paramètres de réorganisation invalides.');
      }
      orderedIds.forEach((id, index) => {
        const item = db.data.menu.find((i) => i.id === id && i.category === category);
        if (item) item.order = index;
      });
      await db.write();
      res.json(
        db.data.menu.filter((i) => i.category === category).sort((a, b) => a.order - b.order),
      );
    }),
  );

  /* --------------------------------- La Cave --------------------------------- */

  app.get(
    '/api/wines',
    asHandler(async (_req, res) => {
      const db = await dbPromise;
      res.json(db.data.wines);
    }),
  );

  app.post(
    '/api/wines',
    asHandler(async (req, res) => {
      const db = await dbPromise;
      const body = req.body as Record<string, unknown>;

      if (!isWineCategory(body.category)) throw new ApiError(400, 'Catégorie invalide.');
      const category = body.category;
      if (!isValidWineSubcategory(category, body.subcategory)) {
        throw new ApiError(400, 'Sous-catégorie invalide pour cette catégorie.');
      }
      const subcategory = body.subcategory as string | undefined;
      if (body.type !== undefined && !isWineColor(body.type)) {
        throw new ApiError(400, 'Type de vin invalide.');
      }

      const siblings = db.data.wines.filter(
        (w) => w.category === category && w.subcategory === subcategory,
      );
      const order = siblings.length === 0 ? 0 : Math.max(...siblings.map((w) => w.order)) + 1;

      const takenIds = new Set(db.data.wines.map((w) => w.id));
      const baseName = isNonEmptyString(body.name)
        ? body.name
        : isNonEmptyString(body.producer)
          ? body.producer
          : 'vin';
      const id = uniqueAmong(toKebabCase(baseName), takenIds);

      const wine: DbWine = {
        id,
        category,
        subcategory,
        order,
        name: isNonEmptyString(body.name) ? body.name : undefined,
        producer: isNonEmptyString(body.producer) ? body.producer : undefined,
        appellation: isNonEmptyString(body.appellation) ? body.appellation : undefined,
        region: isNonEmptyString(body.region) ? body.region : undefined,
        type: isWineColor(body.type) ? body.type : undefined,
        grape: isNonEmptyString(body.grape) ? body.grape : undefined,
        vintage:
          typeof body.vintage === 'number' || isNonEmptyString(body.vintage)
            ? body.vintage
            : undefined,
        volume: isNonEmptyString(body.volume) ? body.volume : undefined,
        price: typeof body.price === 'number' ? body.price : undefined,
        description: isNonEmptyString(body.description) ? body.description : undefined,
        byTheGlass: body.byTheGlass === true,
      };

      db.data.wines.push(wine);
      await db.write();
      res.status(201).json(wine);
    }),
  );

  app.put(
    '/api/wines/:id',
    asHandler(async (req, res) => {
      const db = await dbPromise;
      const wine = db.data.wines.find((w) => w.id === req.params.id);
      if (!wine) throw new ApiError(404, 'Vin introuvable.');

      const body = req.body as Record<string, unknown>;

      const nextCategory = body.category !== undefined ? body.category : wine.category;
      if (!isWineCategory(nextCategory)) throw new ApiError(400, 'Catégorie invalide.');
      const nextSubcategory = body.subcategory !== undefined ? body.subcategory : wine.subcategory;
      if (!isValidWineSubcategory(nextCategory, nextSubcategory)) {
        throw new ApiError(400, 'Sous-catégorie invalide pour cette catégorie.');
      }

      if (nextCategory !== wine.category || nextSubcategory !== wine.subcategory) {
        const siblings = db.data.wines.filter(
          (w) =>
            w.id !== wine.id && w.category === nextCategory && w.subcategory === nextSubcategory,
        );
        wine.order = siblings.length === 0 ? 0 : Math.max(...siblings.map((w) => w.order)) + 1;
        wine.category = nextCategory;
        wine.subcategory = nextSubcategory as string | undefined;
      }

      if (body.name !== undefined) wine.name = isNonEmptyString(body.name) ? body.name : undefined;
      if (body.producer !== undefined) {
        wine.producer = isNonEmptyString(body.producer) ? body.producer : undefined;
      }
      if (body.appellation !== undefined) {
        wine.appellation = isNonEmptyString(body.appellation) ? body.appellation : undefined;
      }
      if (body.region !== undefined) {
        wine.region = isNonEmptyString(body.region) ? body.region : undefined;
      }
      if (body.type !== undefined) {
        if (body.type !== null && !isWineColor(body.type)) {
          throw new ApiError(400, 'Type de vin invalide.');
        }
        wine.type = isWineColor(body.type) ? body.type : undefined;
      }
      if (body.grape !== undefined) wine.grape = isNonEmptyString(body.grape) ? body.grape : undefined;
      if (body.vintage !== undefined) {
        wine.vintage =
          typeof body.vintage === 'number' || isNonEmptyString(body.vintage)
            ? body.vintage
            : undefined;
      }
      if (body.volume !== undefined) {
        wine.volume = isNonEmptyString(body.volume) ? body.volume : undefined;
      }
      if (body.price !== undefined) {
        wine.price = typeof body.price === 'number' ? body.price : undefined;
      }
      if (body.description !== undefined) {
        wine.description = isNonEmptyString(body.description) ? body.description : undefined;
      }
      if (body.byTheGlass !== undefined) wine.byTheGlass = body.byTheGlass === true;

      await db.write();
      res.json(wine);
    }),
  );

  app.delete(
    '/api/wines/:id',
    asHandler(async (req, res) => {
      const db = await dbPromise;
      const index = db.data.wines.findIndex((w) => w.id === req.params.id);
      if (index === -1) throw new ApiError(404, 'Vin introuvable.');
      db.data.wines.splice(index, 1);
      await db.write();
      res.status(204).end();
    }),
  );

  app.post(
    '/api/wines/reorder',
    asHandler(async (req, res) => {
      const db = await dbPromise;
      const { category, subcategory, orderedIds } = req.body as {
        category?: unknown;
        subcategory?: unknown;
        orderedIds?: unknown;
      };
      if (!isWineCategory(category) || !Array.isArray(orderedIds)) {
        throw new ApiError(400, 'Paramètres de réorganisation invalides.');
      }
      if (!isValidWineSubcategory(category, subcategory)) {
        throw new ApiError(400, 'Sous-catégorie invalide pour cette catégorie.');
      }
      orderedIds.forEach((id, index) => {
        const wine = db.data.wines.find(
          (w) => w.id === id && w.category === category && w.subcategory === subcategory,
        );
        if (wine) wine.order = index;
      });
      await db.write();
      res.json(
        db.data.wines
          .filter((w) => w.category === category && w.subcategory === subcategory)
          .sort((a, b) => a.order - b.order),
      );
    }),
  );

  /* ------------------------------- Publication ------------------------------ */

  app.get(
    '/api/publish/preview',
    asHandler(async (_req, res) => {
      res.json(await previewPublish());
    }),
  );

  app.post(
    '/api/publish',
    asHandler(async (_req, res) => {
      res.json(await publish());
    }),
  );

  /* --------------------------------- Erreurs --------------------------------- */

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ApiError) {
      res.status(err.status).json({ error: err.message });
      return;
    }
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Erreur inconnue.' });
  });

  return app;
}
