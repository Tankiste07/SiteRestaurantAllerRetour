# L'Aller Retour — Viandes & Vins

Site vitrine du restaurant **L'Aller Retour**, spécialisé dans la viande rouge et le vin.

React 19 · Vite 8 · TypeScript · Tailwind CSS 4 · React Router 7 · Lucide

---

## Démarrer

```bash
npm install
npm run dev
```

Une seule commande démarre tout, en parallèle :

| Service                                       | Port |
| ---------------------------------------------- | ---- |
| Site public (`npm run dev:site` seul si besoin) | 5173 |
| API du tableau de bord                          | 4310 |
| Interface du tableau de bord                    | 5174 |

| Commande          | Rôle                                                        |
| ----------------- | ----------------------------------------------------------- |
| `npm run dev`     | Site + API + tableau de bord ensemble (usage courant)        |
| `npm run dev:site`| Site public seul, sans l'API ni le tableau de bord            |
| `npm run build`   | Vérification TypeScript + build de production dans `dist/`   |
| `npm run preview` | Sert le build de production                                  |
| `npm run lint`    | Analyse statique (oxlint)                                    |
| `npm run check`   | Types + lint + build, en une commande                        |
| `npm run smoke`   | Test de fumée (voir plus bas)                                |

---

## Tableau de bord (local)

Un tableau de bord permet de gérer **la carte et les images** sans toucher au
code, avec une vraie base de données locale (`server/database.json`).
Il démarre automatiquement avec `npm run dev` (ci-dessus) — ouvrir
<http://localhost:5174/dashboard.html>. Pour le lancer seul, sans le site
public : `npm run dashboard`.

Trois sections :

- **La Carte** — ajouter, modifier, réordonner ou supprimer un plat de
  chaque catégorie (entrées, viandes, non-carnivores, desserts).
- **Images** — téléverser une photo pour n'importe quel emplacement du site
  (plats, pages d'ouverture, galerie), modifier le texte alternatif ; les
  photos envoyées sont automatiquement compressées en JPEG.
- **Publier** — prévisualise les changements (diff inclus), puis effectue en
  un clic le commit + push sur GitHub. Seuls `src/data/menu.ts`,
  `src/data/images.ts` et `src/assets/photos/` sont concernés.

### Où va un changement fait dans le tableau de bord ?

Trois étapes, pas automatiquement enchaînées :

1. **Ajouter/modifier/supprimer dans le tableau de bord** → enregistré
   immédiatement dans la base locale (`server/database.json`). Visible dans
   le tableau de bord, **pas encore sur le site**.
2. **Ouvrir l'onglet « Publier »** → `src/data/menu.ts` et
   `src/data/images.ts` sont régénérés sur le disque à partir de la base
   (dès l'affichage de l'onglet, avant même de cliquer sur un bouton). Le
   site ouvert sur `npm run dev` se met alors à jour tout seul (rechargement
   à chaud) : **c'est le moment où le changement devient visible**.
3. **Bouton « Publier sur GitHub »** → envoie ce changement sur le dépôt
   distant (commit + push), pour ne pas le perdre.

Le site n'étant pas encore hébergé en ligne, l'étape 3 ne rend rien visible
publiquement pour l'instant : elle sauvegarde seulement le travail sur
GitHub. Ce qui est visible aujourd'hui, c'est ce que montre `npm run dev`
(ou `npm run build` + `npm run preview`).

**Le tableau de bord est un outil local, jamais déployé** : `dashboard.html`
n'est pas inclus dans `npm run build`, et son serveur (`server/`) ne tourne
que pendant que `npm run dev` (ou `npm run dashboard`) est actif sur ce PC.
`src/data/menu.ts` et `src/data/images.ts` sont désormais **générés** par le
tableau de bord (un en-tête l'indique dans chaque fichier) plutôt qu'édités
à la main — le reste du site les lit exactement comme avant.

Si le site est mis en ligne un jour, cette base locale pourra être migrée
vers une base hébergée (Supabase, par exemple) sans changer l'interface du
tableau de bord — seule la couche d'accès aux données serait remplacée.

| Commande                 | Rôle                                              |
| ------------------------ | -------------------------------------------------- |
| `npm run dashboard`      | API + interface du tableau de bord, sans le site    |
| `npm run dashboard:api`  | API seule (port 4310)                               |
| `npm run dashboard:ui`   | Interface seule (port 5174)                         |
| `npm run check:dashboard`| Vérification TypeScript de l'interface              |
| `npm run check:server`   | Vérification TypeScript de l'API                    |

---

## ⚠️ Ce qu'il reste à renseigner

Le site a été construit **sans jamais inventer d'information**. Tout ce qui
n'a pas été communiqué est un emplacement réservé, visible à l'écran et
signalé par un `TODO` dans le code.

Chaque point ci-dessous se règle en modifiant **une seule valeur**.

### 1. Lien de réservation — `src/data/site.ts`

```ts
export const RESERVATION_URL: string | null = null; // ← votre lien TheFork / Zenchef / …
```

Tous les boutons « Réserver » du site utilisent cette constante. Tant qu'elle
vaut `null`, ils basculent automatiquement sur le téléphone (si connu), puis
sur la page Contact.

### 2. Coordonnées, horaires, réseaux sociaux — `src/data/site.ts`

Adresse, téléphone et horaires sont déjà renseignés. Il reste :

- `CONTACT.email` : toujours `null`.
- `CONTACT.mapEmbedUrl` / `mapDirectionsUrl` : générés automatiquement à
  partir de l'adresse (Google Maps sans clé d'API) — à remplacer si vous
  disposez d'un lien officiel.
- `SOCIAL_LINKS` : renseigner les `url`. Une icône n'apparaît que si son lien
  existe — aucune URL n'est inventée.

Les données structurées Schema.org (`src/utils/schema.ts`) s'enrichissent
automatiquement au fur et à mesure : adresse, téléphone, horaires et profils
sociaux n'entrent dans le JSON-LD que lorsqu'ils sont réellement connus.

### 3. La cave — `src/data/wines.ts`

La liste des 300+ références n'a pas encore été transmise. En attendant, la
page affiche un message « la cave arrive bientôt » : aucune donnée fictive
n'est présentée au visiteur.

Pour intégrer la vraie cave :

```ts
export const WINE_SOURCE = 'real' as WineSource;   // 1. basculer la source
export const realWines: Wine[] = [ /* … */ ];      // 2. coller les références
```

Tous les champs sont optionnels :

```ts
{
  id: 1,
  name: 'Les Charmes Hautes',
  producer: 'Domaine Pierre Vasselin',
  appellation: 'Gevrey-Chambertin',
  region: 'Bourgogne',
  type: 'Rouge',            // Rouge | Blanc | Rosé | Champagne | Effervescent | Vin doux
  grape: 'Pinot Noir',      // « Syrah · Grenache » crée deux cépages filtrables
  vintage: 2019,            // 'NM' pour un champagne non millésimé
  volume: '75 cl',
  price: 96,
  description: '',
  byTheGlass: true,
}
```

**Les filtres se construisent seuls** à partir des données présentes : type,
région, appellation, domaine, millésime, cépage et prix. Aucune liste n'est
codée en dur. Une facette dont aucune bouteille ne porte l'information
n'apparaît pas. Le compteur de références affiche le nombre réel, jamais un
chiffre décoratif. L'affichage est paginé (24 bouteilles à la fois), ce qui
permet de monter à plusieurs milliers de références sans ralentissement.

### 4. Les photographies — via le tableau de bord

Cinq photos sont déjà branchées (tartare, onglet, noix d'entrecôte, côte de
bœuf, faux-filet). Les autres emplacements affichent encore un **visuel de
substitution généré** (dégradés chauds, grain, gravure au trait) : il ne
dépend d'aucun réseau et ne peut jamais casser.

Pour brancher une nouvelle photo, la façon recommandée est l'onglet
**Images** du [tableau de bord](#tableau-de-bord-local) (glisser-déposer,
compression automatique). `src/data/images.ts` est désormais **généré** — il
ne se modifie plus à la main.

### 5. Mentions légales

`src/pages/Legal.tsx` contient les emplacements réservés pour la raison
sociale, le SIRET, l'hébergeur et le directeur de publication.

---

## Architecture

```
src/
├── components/
│   ├── layout/      Header, Footer, Layout, PageHero, Logo, ScrollToTop
│   ├── ui/          Button, SectionTitle, Section, Reveal, SmartImage, Tag, Ornament
│   ├── menu/        MenuCard, MenuRow, MenuList, MenuGrid, MenuNav, Price
│   ├── wines/       WineCard, WineSearch, WineFilters, FilterDrawer
│   ├── gallery/     Lightbox
│   ├── home/        Hero, Intro, MeatSection, NonCarnivores, StartersSection,
│   │                DessertsSection, CaveTeaser, ContactTeaser
│   ├── ReservationButton.tsx
│   └── StructuredData.tsx
├── pages/           Home, Restaurant, Menu, Meat, Wines, Gallery, Contact,
│                    Legal, Privacy, NotFound
├── data/            site.ts · menu.ts · wines.ts ·
│                    images.ts · gallery.ts · navigation.ts
├── hooks/           useInView · useParallax · useSeo · useLockBodyScroll · useWineCatalog
├── utils/           wine.ts (moteur de filtres) · format.ts · schema.ts · cn.ts
├── assets/photos/   ← déposer ici les photographies du restaurant
├── dashboard/       Interface du tableau de bord (jamais dans le build public)
└── index.css        Design system complet (couleurs, typographie, animations)

server/               API + base locale (lowdb) du tableau de bord
```

**Le contenu est entièrement séparé des composants** : la carte, la cave, les
coordonnées et les images vivent dans `src/data/`. Modifier un prix ou ajouter
un plat ne demande jamais de toucher au code d'affichage. `menu.ts` et
`images.ts` sont désormais générés par le tableau de bord (voir plus haut) ;
`menu.types.ts` et `images.types.ts` portent les types, stables.

### Routes

`/` · `/le-restaurant` · `/la-carte` · `/la-viande` · `/la-cave` · `/galerie` ·
`/contact` · `/mentions-legales` · `/confidentialite`

---

## Design system

Tout est défini dans `src/index.css` (`@theme`).

| Rôle              | Jeton                                   |
| ----------------- | --------------------------------------- |
| Noirs & bruns     | `noir` `charbon` `suie` `brun` `cuir`   |
| Crèmes            | `creme` `ivoire` `sable` `cendre`       |
| Rouges (vin)      | `bordeaux` `vin` `braise`               |
| Or (accents fins) | `or` `or-clair`                         |
| Titres            | Cormorant Garamond (`font-display`)     |
| Textes            | Inter (`font-sans`)                     |

Utilitaires maison : `u-container`, `eyebrow`, `grain`, `dot-leader`, `scrim`,
`link-quiet`, `tnum`, `skip-link`.

Le rouge est réservé aux accents (survol des boutons, halos de braise) ; l'or
n'apparaît qu'en filets d'un pixel et en petites capitales.

### Thème clair / sombre

**Sombre par défaut.** Le bouton soleil/lune de l'en-tête bascule le thème et
mémorise le choix (`localStorage`). Tailwind v4 compile chaque utilitaire de
couleur en référence à une variable CSS (`.bg-noir { background-color:
var(--color-noir) }`) : les deux palettes sont donc définies une seule fois,
dans `src/index.css` (`[data-theme='dark']` / `[data-theme='light']`), et tout
le site en hérite automatiquement — aucun composant n'a besoin de connaître le
thème actif.

Les sections photographiques (Hero, bandeaux d'ouverture, visionneuse de la
galerie, en-tête de navigation) portent l'attribut `data-theme="dark"` en dur :
un texte clair posé sur une photo doit rester lisible quel que soit le thème
choisi pour le reste du site.

### Animations

Apparitions au défilement via `<Reveal>` (IntersectionObserver + CSS),
parallaxe légère sur les images d'ouverture, survols lents et contenus.
**`prefers-reduced-motion` est respecté strictement** : toutes les animations
sont neutralisées et aucun contenu ne reste masqué.

---

## Accessibilité

- Lien d'évitement, `<main>` focalisable, hiérarchie `h1` → `h2` → `h3`
  vérifiée automatiquement (un seul `h1` par page).
- Menu mobile et panneaux modaux : `aria-expanded`, `aria-controls`, fermeture
  au clavier (`Échap`), focus déplacé et restitué, défilement de page bloqué,
  `inert` sur les panneaux fermés.
- Visionneuse de la galerie pilotable au clavier (`←` `→` `Échap`).
- États de focus visibles (anneau doré), contrastes élevés, textes alternatifs
  rédigés pour chaque emplacement d'image.

---

## Test de fumée

```bash
npm i --no-save jsdom
npm run smoke
```

Monte réellement chaque page dans un DOM et vérifie : contenu rendu, `h1`
unique et correct, `title` de la page, présence du JSON-LD, absence d'erreur
console. Vérifie aussi que la page La Cave affiche bien toutes les sections
de la carte (Pet Nat/Crémant, Champagne, Blancs, Macérations, Rosé, Rouges).

Le test s'appuie sur un bundle dédié (`scripts/vite.smoke.config.ts`) et
n'intervient jamais dans le build de production.
