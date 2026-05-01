# DESCRIPTIF TECHNIQUE : NAKAMA MVP (audit v2 : 26 avril 2026)

## 0. Vue d'ensemble

### Volumétrie globale

- **13 938 LOC** source (TypeScript/TSX, excluant `.next/` et `node_modules/`)
- **94 fichiers** TypeScript/TSX
- **32 fichiers** pages/layouts (20 routes)
- **29 composants** (UI shadcn + métier + public)
- **3 630 LOC** mocks data (pros par spécialité)
- **647 LOC** agenda pro (page la plus volumineuse, refactorisée)

### État Git détaillé

Branch : `main`. Dernier commit : `5e04b42` (fix: bascule mobile garantie + vue Semaine masquée sur mobile).

**Commits depuis init :**

1. `e344344` : Initial commit Create Next App
2. `225280b` : feat: initial commit MVP baseline
3. `2a58f82` : chore: snapshot avant downgrade Next 15
4. `c8ed44c` : feat(build): downgrade Next 16 → 15
5. `e7cc840` : feat(forms+screens): Zod 4 forms + écrans
6. `015f706` : feat: agenda mois + refacto + SEO
7. `9fe1e88` : docs(readme): fix table markdown
8. `f49d421` : feat(banner): demo banner
9. `7f6098f` : docs: TECHNICAL.md (audit v1)
10. `2eee29b` : feat: assets dynamiques + lint propre + pages légales + dette
11. `2ccec5f` : feat(agenda): refacto mobile-first avec vue Jour + bascule auto
12. `5e04b42` : fix(agenda): bascule mobile garantie

Working tree : clean. Branche synchronisée avec `origin/main`.

### État build & typecheck

- `pnpm build` ✓ (output standalone, 0 erreurs)
- `pnpm typecheck` ✓ (strict mode, 0 erreurs TS)
- `pnpm lint` ✓ (eslint . direct, non next lint)

### Arborescence racine commentée

```
nakama/
├── .git/
├── .github/                    # (non présent)
├── .husky/
│   └── pre-commit              → npx lint-staged && pnpm typecheck
├── .env.local.example          → NEXT_PUBLIC_DEMO_MODE, NEXT_PUBLIC_APP_URL
├── .gitignore, .prettierrc
├── .next/, node_modules/, build/ → (build outputs)
├── app/                        → Next 15 App Router (5762 LOC, 32 fichiers)
│   ├── layout.tsx (116 LOC)    → RootLayout server, metadata, JSON-LD, force-dynamic
│   ├── page.tsx (70 LOC)       → Landing publique + Hero + Features + Footer
│   ├── robots.ts (33 LOC)      → SEO crawl rules (disallow espaces protégés)
│   ├── sitemap.ts (52 LOC)     → 7 routes publiques + 3 légales
│   ├── icon.tsx (27 LOC)       → ImageResponse 32×32 "N" doré
│   ├── apple-icon.tsx (28 LOC) → ImageResponse 180×180 "N"
│   ├── opengraph-image.tsx (73 LOC) → ImageResponse 1200×630 OG
│   ├── twitter-image.tsx (2 LOC)    → réexport opengraph-image
│   ├── not-found.tsx (23 LOC)  → 404 custom
│   ├── global-error.tsx (60 LOC) → erreur SSR client
│   ├── (auth)/layout.tsx       → AuthLayout simple
│   │   ├── connexion/page.tsx (208 LOC)
│   │   └── inscription/{sportif,pro}/page.tsx (458, 603 LOC)
│   ├── (legal)/layout.tsx      → LegalLayout server, metadata indexable
│   │   ├── cgu/page.tsx (96 LOC)
│   │   ├── confidentialite/page.tsx (92 LOC)
│   │   └── mentions-legales/page.tsx (75 LOC)
│   ├── (sportif)/layout.tsx    → Server + metadata noindex
│   │   ├── _layout-shell.tsx   → Client component nav bottom mobile
│   │   ├── accueil/page.tsx
│   │   ├── recherche/page.tsx (242 LOC)
│   │   ├── rdv/page.tsx (264 LOC)
│   │   ├── messages/page.tsx, messages/[id]/page.tsx
│   │   ├── profil/page.tsx
│   │   ├── pros/[id]/page.tsx (222 LOC)
│   │   └── reservation/{[proId],confirmation}/page.tsx
│   └── (pro)/layout.tsx        → Server + metadata noindex
│       ├── _layout-shell.tsx
│       ├── agenda/page.tsx (647 LOC) ⭐ refactorisé commit 2ccec5f
│       ├── dashboard/page.tsx (314 LOC)
│       ├── clients/page.tsx, clients/[id]/page.tsx (465 LOC)
│       ├── cartes-services/page.tsx (363 LOC)
│       ├── revenus/page.tsx (229 LOC)
│       └── parametres/page.tsx (258 LOC)
├── components/                 → 29 composants (1783 LOC)
│   ├── ui/                     → shadcn/ui base-nova (14 : button, card, dialog, etc.)
│   ├── common/                 → logo, avatar-stack, demo-banner, client-shell,
│   │                             mode-switcher, compatibility-badge, empty-state
│   ├── public/                 → hero, features-section, feature-card, section-heading
│   └── sportif/                → pro-card + onboarding (progress-bar, step-wrapper, vibe-slider)
├── lib/                        → logique métier (5092 LOC)
│   ├── matching.ts (137 LOC)   → ⭐ Algo scoring 100 pts (45+20+35)
│   ├── animations.ts (27 LOC)  → containerVariants, itemVariants, slideRightVariants, fadeInVariants
│   ├── constants.ts (100 LOC)  → SPORTS, SPECIALITES, FORMULES, OBJECTIFS, NIVEAUX, MAX_SCORE, RESSENTI_EMOJIS
│   ├── formatters.ts (41 LOC)  → formatPrice, formatDate, formatDateTime, formatDuration, etc.
│   ├── utils.ts (7 LOC)        → cn() = twMerge(clsx)
│   ├── schemas/                → Zod validation (4 fichiers)
│   │   ├── auth.ts             → connexionSchema
│   │   ├── onboarding-sportif.ts → onboardingSportifSchema, vibeSchema
│   │   ├── onboarding-pro.ts   → onboardingProSchema, carteServiceCreateSchema
│   │   └── index.ts            → barrel exports
│   └── mock-data/              → 3630 LOC
│       ├── index.ts (6 LOC)    → barrel
│       ├── pros/               → 50 pros split par spécialité
│       │   ├── coachs.ts (1807 LOC) → 32 coachs
│       │   ├── prep-physique.ts (689 LOC) → 12 preps physique
│       │   ├── nutritionnistes.ts (379 LOC) → 5 nutritionnistes
│       │   ├── prep-mental.ts (375 LOC) → 5 preps mental
│       │   ├── educateurs.ts (357 LOC) → 5 éducateurs
│       │   └── index.ts (23 LOC) → concat all
│       ├── sportifs.ts (306 LOC) → 20 sportifs + defaultSportif
│       ├── seances.ts (290 LOC) → 34 séances
│       ├── conversations.ts (195 LOC) → 15 conversations
│       └── health.ts (208 LOC) → healthNotes, progressionData, coachNotes
├── stores/                     → Zustand 3 stores (65 LOC)
│   ├── user-store.ts           → Sportif | Pro, persist localStorage 'nakama-user'
│   ├── mode-store.ts           → Mode ('public'|'sportif'|'pro'), persist 'nakama-mode'
│   └── ui-store.ts             → drawerOpen (non-persist)
├── hooks/                      → 4 custom hooks (105 LOC)
│   ├── use-mobile.ts (23 LOC)  → boolean | null (SSR-aware)
│   ├── use-matching.ts (18 LOC) → useMatchedPros(limit?)
│   ├── use-count-up.ts (30 LOC) → easeOutCubic animation
│   └── use-mode.ts (28 LOC)    → { mode, switchMode }
├── types/                      → 7 fichiers (150 LOC)
│   ├── index.ts                → barrel
│   ├── sportif.ts              → Sportif, Niveau, Genre, Objectif, VibeProfile
│   ├── pro.ts                  → Pro, Specialite, Sport, Format, Formule, CarteService, Avis
│   ├── seance.ts               → Seance, StatutSeance
│   ├── conversation.ts         → Conversation, Message
│   ├── matching.ts             → MatchScore
│   └── health.ts               → HealthNote, NiveauAlerte, ProgressionPoint, NoteCoach
├── pages/                      → Pages Router résiduel
│   └── _error.tsx (58 LOC)     → Workaround Next 15 crash interne useRef on null
├── public/                     → Assets statiques (5 SVGs + répertoire images/pros vide)
│   ├── file.svg, globe.svg, next.svg, vercel.svg, window.svg
│   ├── logos/                  → (empty)
│   └── images/pros/            → (empty - À peupler avec script migration)
├── docs/                       → Documentation
│   ├── TECHNICAL.md (audit v1)
│   ├── DOD-LIVRAISON.md
│   └── CHASE-ASSETS.md
├── components.json             → shadcn config (style base-nova)
├── eslint.config.mjs (20 LOC)  → FlatCompat pour next/core-web-vitals + next/typescript
├── next.config.ts (15 LOC)     → output: 'standalone', remotePatterns Unsplash
├── postcss.config.mjs (7 LOC)  → @tailwindcss/postcss
├── tsconfig.json (40 LOC)      → strict, noUncheckedIndexedAccess, NO exactOptionalPropertyTypes
├── pnpm-lock.yaml              → lock file
├── package.json (59 LOC)        → dépendances exactes (voir section 1)
├── README.md                   → Stack, justifs, arborescence, roadmap, dette
├── AGENTS.md                   → Conventions agents/refacto
├── .prettierrc (8 LOC)         → trailing comma, printWidth 90
├── .gitignore                  → standard Node + .env*
└── tsconfig.tsbuildinfo        → cache incrementiel
```

---

## 1. Configuration & Tooling

### Fichiers de configuration

| Fichier              | Lignes | Contenu / Options                                                                                                                                                                                                                                                                                                                                                                                               |
| -------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json`       | 59     | **Runtime :** Next 15.5.15, React 19.2.4, Tailwind v4 (@tailwindcss/postcss), shadcn 4.5.0, Framer Motion 12.38.0, Zustand 5.0.12, Recharts 3.8.1, react-hook-form 7.72.1, zod 4.3.6, lucide-react 1.8.0, date-fns 4.1.0, clsx 2.1.1, tailwind-merge 3.5.0. **DevDeps :** @base-ui-components/react 1.0.0-rc.0, eslint 9, @eslint/eslintrc 3.3.5, TypeScript 5, Prettier 3.8.3, husky 9.1.7, lint-staged 16.4.0 |
| `tsconfig.json`      | 40     | Target ES2022, lib: dom + esnext. **strict: true**, noUncheckedIndexedAccess, noImplicitOverride, noFallthroughCasesInSwitch, noUnusedLocals, noUnusedParameters. **Pas exactOptionalPropertyTypes** (incompatible @base-ui-components/react). moduleResolution bundler, paths alias @/_ → ./_                                                                                                                  |
| `next.config.ts`     | 15     | `output: 'standalone'` (deployable sans Node), `images.remotePatterns: [{ hostname: 'images.unsplash.com' }]` (whitelist CDN photos pros). ⚠️ `eslint.ignoreDuringBuilds` RETIRÉ (commit 2eee29b)                                                                                                                                                                                                               |
| `eslint.config.mjs`  | 20     | ESLint 9 format flat. FlatCompat pour legacy `next/core-web-vitals` + `next/typescript` (eslint-config-next 15 pas encore flat). Ignores: `.next/**`, `out/**`, `build/**`, `next-env.d.ts`                                                                                                                                                                                                                     |
| `postcss.config.mjs` | 7      | Plugin @tailwindcss/postcss (Tailwind v4)                                                                                                                                                                                                                                                                                                                                                                       |
| `.prettierrc`        | 8      | semi: true, singleQuote: true, trailingComma: all, printWidth 90, tabWidth 2, plugins: prettier-plugin-tailwindcss                                                                                                                                                                                                                                                                                              |
| `components.json`    | 25     | shadcn config : style **base-nova**, rsc: true, tsx: true, tailwind.baseColor neutral, cssVariables true, iconLibrary lucide. Aliases: @/components, @/lib, @/hooks, @/ui                                                                                                                                                                                                                                       |
| `.gitignore`         | 42     | Standard Next + node_modules, /.pnp, /.next, /out, /build, .env*, *.pem, logs                                                                                                                                                                                                                                                                                                                                   |
| `.husky/pre-commit`  | 2      | `npx lint-staged` (eslint --fix + prettier sur staged), puis `pnpm typecheck`                                                                                                                                                                                                                                                                                                                                   |
| `.env.local.example` | 12     | NEXT_PUBLIC_DEMO_MODE=true, NEXT_PUBLIC_APP_URL=http://localhost:3000                                                                                                                                                                                                                                                                                                                                           |

### Scripts npm disponibles

| Script      | Commande                      | Effet                                                                 |
| ----------- | ----------------------------- | --------------------------------------------------------------------- |
| `dev`       | `next dev`                    | Serveur dev turbopack http://localhost:3000                           |
| `build`     | `next build`                  | Build production (output: standalone)                                 |
| `start`     | `next start`                  | Serveur Node prod                                                     |
| `lint`      | `eslint .`                    | ESLint v9 format flat direct (pas next lint) : change depuis audit v1 |
| `typecheck` | `tsc --noEmit`                | TypeScript check sans emit                                            |
| `format`    | `prettier --write .`          | Prettier reformat all                                                 |
| `check`     | `pnpm lint && pnpm typecheck` | Lint + typecheck local (non bloquant)                                 |
| `prepare`   | `husky`                       | Installe husky hooks                                                  |

**Note clé :** `pnpm lint` utilise désormais `eslint .` direct (commit 2eee29b), pas `next lint`. Le flag `eslint.ignoreDuringBuilds: true` a été RETIRÉ du `next.config.ts` : linting est vérifié strictement en pre-commit (husky).

### Dépendances exactes

**Production (17 dépendances) :**

```
@base-ui-components/react@1.0.0-rc.0
@hookform/resolvers@^5.2.2
class-variance-authority@^0.7.1
clsx@^2.1.1
date-fns@^4.1.0
framer-motion@^12.38.0
lucide-react@^1.8.0
next@^15.5.15
react@19.2.4
react-dom@19.2.4
react-hook-form@^7.72.1
recharts@^3.8.1
shadcn@^4.5.0
tailwind-merge@^3.5.0
tw-animate-css@^1.4.0
zod@^4.3.6
zustand@^5.0.12
```

**Development (8 dépendances) :**

```
@eslint/eslintrc@^3.3.5
@tailwindcss/postcss@^4
@types/node@^20
@types/react@^19
@types/react-dom@^19
eslint@^9
eslint-config-next@^15.5.15
husky@^9.1.7
lint-staged@^16.4.0
prettier@^3.8.3
prettier-plugin-tailwindcss@^0.7.2
tailwindcss@^4
typescript@^5
```

---

## 2. Routing : `app/`

### Groupe racine (/ + assets)

#### `app/layout.tsx` (116 LOC) : RootLayout Server

- **Server component** (pas `'use client'`)
- `dynamic = 'force-dynamic'` (workaround Next 15 prerender crash)
- Metadata : title template "... : Nakama", description, keywords (coaching sportif, doctolib sport, etc.), openGraph (type website, locale fr_FR), twitter card
- JSON-LD inline : Organization (@id, name Nakama, url, logo, description, sameAs []) + SoftwareApplication (HealthApplication)
- Viewport : themeColor #0B0F14, device-width, initialScale 1
- Inter font (Google Fonts, variable --font-inter)
- Imports : ClientShell wrapper, DemoBanner sticky
- Structure : html lang="fr" + Inter variable + globals.css, head avec JSON-LD, body avec DemoBanner + {children} + ClientShell

#### `app/page.tsx` (70 LOC) : Landing publique

- **Server component**
- Header sticky top, Hero section, FeaturesSportif, FeaturesPro, HowItWorks sections
- Footer avec copyright + liens fonctionnels : `/cgu`, `/confidentialite`, `/mentions-legales`, `mailto:contact@nakama.tech`
- Imports : Link Next, Button, Hero, FeaturesSportif, FeaturesPro, HowItWorks
- Animations : Hero section suppose composant public/hero avec Framer Motion

#### `app/robots.ts` (33 LOC) : Robots.txt

- `userAgent: '*'`
- `allow: '/'`
- `disallow: ['/accueil', '/recherche', '/pros/', '/rdv', '/profil', '/messages', '/reservation/', '/dashboard', '/clients', '/agenda', '/cartes-services', '/revenus', '/parametres']`
- sitemap: `${APP_URL}/sitemap.xml`

#### `app/sitemap.ts` (52 LOC) : Sitemap XML

7 routes publiques + indexables :

1. `/` : lastModified: now, changeFrequency: weekly, priority 1
2. `/connexion` : monthly, 0.7
3. `/inscription/sportif` : monthly, 0.8
4. `/inscription/pro` : monthly, 0.8
5. `/cgu` : yearly, 0.3
6. `/confidentialite` : yearly, 0.3
7. `/mentions-legales` : yearly, 0.3

#### `app/icon.tsx` (27 LOC) : Favicon dynamique (Next 15)

- ImageResponse convention (pas fichier .png binaire)
- Size: 32×32
- Contenu: JSX `<div>` fond #0B0F14, "N" en couleur #C9B27A (gold), fontSize 22, fontWeight 800
- Hot-reload en dev, régénéré à chaque build

#### `app/apple-icon.tsx` (28 LOC) : Apple touch icon dynamique

- ImageResponse 180×180
- Même design "N" gold on dark background, fontSize 110, letterSpacing -0.03em

#### `app/opengraph-image.tsx` (73 LOC) : Social sharing image dynamique

- ImageResponse 1200×630 (Twitter, LinkedIn, etc.)
- Gradient radial background
- Layout : "NAKAMA" label (or) + "Le Doctolib du coaching sportif" heading + description + "nakama.tech" footer coin bas-droit
- Colores : #C9B27A (gold), #E6E8EB (light), #9AA3AD (gray), #6B7480 (dim)

#### `app/twitter-image.tsx` (2 LOC) : Twitter image

- Réexport de opengraph-image (same 1200×630 spec)

#### `app/not-found.tsx` (23 LOC) : 404 page

- Server component
- Heading "Page introuvable", description, lien retour `/`
- Design : center flex, heading or, button or

#### `app/global-error.tsx` (60 LOC) : Error boundary client

- `'use client'`, error reset handler
- Fallback minimal (html + body inline styles, pas Tailwind)
- Heading "Quelque chose s'est mal passé", bouton "Réessayer" (reset callback)

### Groupe (auth) : Authentification

#### `app/(auth)/layout.tsx` (8 LOC) : AuthLayout server

- Centré, min-h-screen, flex col, background class

#### `app/(auth)/connexion/page.tsx` (208 LOC) : Connexion

- `'use client'`
- Form RHF + Zod (connexionSchema : email, password, role enum)
- Dual CTA : "Sportif" (bleu), "Coach" (or)
- Links vers `/inscription/sportif`, `/inscription/pro`
- Auto-login mock user au submit

#### `app/(auth)/inscription/sportif/page.tsx` (458 LOC) : Onboarding sportif

- `'use client'`, 6 steps (useState)
- Zod au submit final (onboardingSportifSchema, vibeSchema)
- Steps : prenom/nom → sports + niveau → objectifs + budget → localisation → vibe (3 sliders) → review + submit
- Imports : ProgressBar, StepWrapper, VibeSlider, Button, Input
- Animations : containerVariants, itemVariants (Framer)
- Mock : `defaultSportif` hydrates store `useUserStore.setSportif()`

#### `app/(auth)/inscription/pro/page.tsx` (603 LOC) : Onboarding pro

- `'use client'`, 6 steps
- Zod : onboardingProSchema (nom, prenom, specialite, sports, niveaux, description, codePostal, tarifMin, tarifMax, formats, vibe)
- Steps : contact → specialité + sports → niveaux + tarifs → formats → cartes services (Dialog création inline) → review
- Plus volumineux que sportif (gestion cartes services inline)
- Stocke dans `useUserStore.setPro()`

### Groupe (legal) : Pages légales

#### `app/(legal)/layout.tsx` (23 LOC) : LegalLayout server

- Metadata : `robots: { index: true, follow: true }` (indexable)
- Max-width 3xl, padding py-10
- Back link à `/`, article prose prose-invert
- Utile pour la conformité SEO : Google index ces pages

#### `app/(legal)/cgu/page.tsx` (96 LOC) : CGU

- Metadata : title "Conditions générales d'utilisation", description
- H1 or, "Dernière mise à jour : 26 avril 2026"
- **Banner warning :** "Document à finaliser", placeholder RGPD
- 8 sections : 1. Objet 2. Inscription et compte 3. Réservation et paiement 4. Annulation 5. Responsabilités 6. Données personnelles (lien /confidentialite) 7. Modification des CGU 8. Loi applicable

#### `app/(legal)/confidentialite/page.tsx` (92 LOC) : Politique de confidentialité

- Metadata similar
- **Banner warning :** "Document à finaliser" (RGPD, à valider DPO)
- 8 sections : 1. Responsable de traitement 2. Données collectées (identité, coordonnées, données sportives, paiement, navigation) 3. Finalités 4. Bases légales 5. Conservation (3 ans post-clôture, 13 mois paiement Stripe) 6. Destinataires (Vercel, Stripe, Resend/Postmark futur) 7. Vos droits (CNIL link dpo@nakama.tech) 8. Cookies (techniques essentiels)

#### `app/(legal)/mentions-legales/page.tsx` (75 LOC) : Mentions légales

- 4 sections : Éditeur (à compléter : SIRET, adresse, Directeur Haykel Jelidi), Contact (contact@nakama.tech), Hébergement (Vercel), Propriété intellectuelle

**Note :** 3 pages placeholders avec banner "Document à finaliser". À faire valider juridiquement avant prod réelle.

### Groupe (sportif) : Espace sportif

#### `app/(sportif)/layout.tsx` (server) + `_layout-shell.tsx` (client)

- Layout server : Metadata noindex (robots: { index: false })
- \_layout-shell client component : nav bottom mobile 4 items (Accueil, RDV, Messages, Profil), fixed bottom z-50 h-16, hidden md:flex top sticky header

#### Pages sportif (9 routes) :

| Path                        | Fichier                             | LOC  | Statut                                                                   |
| --------------------------- | ----------------------------------- | ---- | ------------------------------------------------------------------------ |
| `/accueil`                  | `accueil/page.tsx`                  | ~150 | Accueil sportif avec top 5 matching, CTA réservation                     |
| `/recherche`                | `recherche/page.tsx`                | 242  | Search/filter pros (via useMatchedPros hook)                             |
| `/rdv`                      | `rdv/page.tsx`                      | 264  | List séances à venir + passées                                           |
| `/messages`                 | `messages/page.tsx`                 | ~120 | List conversations                                                       |
| `/messages/[id]`            | `messages/[id]/page.tsx`            | 131  | Chat conversation detail                                                 |
| `/profil`                   | `profil/page.tsx`                   | ~100 | Mon profil sportif                                                       |
| `/pros/[id]`                | `pros/[id]/page.tsx`                | 222  | Fiche pro detail + CTA réservation                                       |
| `/reservation/[proId]`      | `reservation/[proId]/page.tsx`      | 337  | 3 steps : choix séance → saisie données → recap paiement (simulé Stripe) |
| `/reservation/confirmation` | `reservation/confirmation/page.tsx` | 54   | Confirmation post-paiement, lien `/rdv`                                  |

**Toutes :** noindex (robots via layout), Server/Client mix.

### Groupe (pro) : Espace pro

#### `app/(pro)/layout.tsx` (server) + `_layout-shell.tsx` (client)

- Layout server : noindex robots
- \_layout-shell client : nav bottom mobile 6 items (Dashboard, Agenda, Clients, Cartes services, Revenus, Paramètres), fixed bottom mobile

#### Pages pro (6 routes + dynamic) :

| Path               | Fichier                    | LOC | Statut                                                     |
| ------------------ | -------------------------- | --- | ---------------------------------------------------------- |
| `/dashboard`       | `dashboard/page.tsx`       | 314 | Wireframe accueil (stats placeholder, Recharts sparklines) |
| `/agenda`          | `agenda/page.tsx`          | 647 | ⭐ REFACTORISÉ (voir section dédiée)                       |
| `/clients`         | `clients/page.tsx`         | 139 | List clients                                               |
| `/clients/[id]`    | `clients/[id]/page.tsx`    | 465 | 4 onglets (Infos, Historique séances, Notes, Objectifs)    |
| `/cartes-services` | `cartes-services/page.tsx` | 363 | Création + list cartes services                            |
| `/revenus`         | `revenus/page.tsx`         | 229 | Stats revenus, graphiques Recharts                         |
| `/parametres`      | `parametres/page.tsx`      | 258 | Profil, plan abonnement, security                          |

### ⭐ Détail page agenda pro (`app/(pro)/agenda/page.tsx`, 647 LOC)

**Refactorisé commits 2ccec5f + 5e04b42 :** 3 vues (Jour/Semaine/Mois) + bascule automatique mobile + sous-composants réutilisables.

**Architecture :**

```
AgendaPage (root client)
├── State : view ('jour'|'semaine'|'mois'), refDate, blockOpen, blocks[], blockForm
├── useMobile() hook → null | boolean (SSR-aware)
│   └── useEffect : isMobile === null → attend, isMobile === true → force view='jour'
│   └── useEffect : isMobile === true && view === 'semaine' → basculer en 'jour'
├── Toggle 3 vues (vue Semaine masquée sur mobile via hidden sm:block)
├── Vue Jour (DayView sous-composant)
│   └── DayContentList avec séances + blocks
├── Vue Semaine (grille 700px min-width, scroll mobile)
│   └── Affiche 17h (6h-22h), grid 7 colonnes jours
│   └── Clic jour → bascule Vue Jour
├── Vue Mois (grid 7 colonnes, compact mobile, expansif desktop)
│   └── Clic jour → Dialog détail jour (utilise DayContentList)
└── FAB "Bloquer plage" (icon-only mobile, label desktop)
    └── Dialog form (date, heureDebut, heureFin, raison)
```

**Hooks utilisés :**

- `useMobile()` → détecte breakpoint 768px, retourne `null` (SSR) | `true` (mobile) | `false` (desktop)
- `useUserStore()` → get pro courant
- `useMemo()` → weekDays, monthDays, proSeances

**État automatique :**

1. SSR : isMobile === null, aucune vue sélectionnée
2. Premier render client : isMobile === true/false, hasAutoSet passe à true, force view='jour' si mobile
3. Resize window : guarde-fou continu : si isMobile bascule à true ET view==='semaine', force 'jour'

**Composants internes :**

```typescript
interface DayViewProps {
  date: Date;
  seances: Seance[];
  blocks: BlockedSlot[];
}

function DayView({ date, seances, blocks }: DayViewProps) {
  // Affiche DayContentList + empty state
}

interface DayContentListProps {
  seances: Seance[];
  blocks: BlockedSlot[];
}

function DayContentList({ seances, blocks }: DayContentListProps) {
  // Réutilisé par Vue Jour + Dialog Mois
  // Liste items alignés : heure, nom client, lieu, tarif
  // Blocks affichés aussi
}
```

**FAB styling :**

- Mobile (sm:below) : icon-only, Plus icon centré, mx-3
- Desktop (sm:up) : icon + label "Bloquer une plage", px-5 gap-2

**Animations :** Aucune Framer Motion (pas volumineux), transitions Tailwind.

---

## 3. Composants : `components/`

### Sous-dossier `ui/` (14 fichiers shadcn/ui base-nova)

| Composant           | LOC | Exports                                                                                          |
| ------------------- | --- | ------------------------------------------------------------------------------------------------ |
| `button.tsx`        | ~30 | Button (variants: primary, secondary, outline, ghost; sizes: sm, md, lg)                         |
| `card.tsx`          | ~20 | Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter                            |
| `dialog.tsx`        | ~50 | Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter |
| `input.tsx`         | ~20 | Input (type=text/email/password/number)                                                          |
| `textarea.tsx`      | ~15 | Textarea                                                                                         |
| `label.tsx`         | ~10 | Label                                                                                            |
| `badge.tsx`         | ~20 | Badge (variants: default, secondary, destructive, outline)                                       |
| `separator.tsx`     | ~15 | Separator (horizontal/vertical)                                                                  |
| `tabs.tsx`          | ~30 | Tabs, TabsList, TabsTrigger, TabsContent                                                         |
| `slider.tsx`        | ~30 | Slider (single/range)                                                                            |
| `avatar.tsx`        | ~25 | Avatar, AvatarImage, AvatarFallback                                                              |
| `tooltip.tsx`       | ~40 | Tooltip, TooltipTrigger, TooltipContent                                                          |
| `sheet.tsx`         | ~35 | Sheet (side drawer), SheetTrigger, SheetContent, SheetHeader, etc.                               |
| `dropdown-menu.tsx` | ~50 | DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, etc.                                     |

**Tous :** base-nova style (dark neutral theme), Tailwind classes, sans dépendance interne.

### Sous-dossier `common/` (7 composants réutilisables)

#### `logo.tsx`

- Render "NAKAMA" text or icon
- Utilisé dans layouts et header landing

#### `avatar-stack.tsx`

- Affiche N avatars superposés (ex: 3-5 clients avec +X supplémentaires)
- Props : avatars[], maxVisible=3
- Utilisé : accueil sportif, card pro

#### `demo-banner.tsx` (26 LOC)

- `'use client'`
- Sticky top z-60, dismissible X button
- Affiche "Démo prototype : aucune donnée conservée, pas de paiement réel"
- Montée en layout.tsx (children du RootLayout)

#### `client-shell.tsx` (13 LOC)

- `'use client'` wrapper
- `dynamic(import ModeSwitcher, { ssr: false })`
- Permet au RootLayout (server) d'inclure un composant client sans inline

#### `mode-switcher.tsx`

- `'use client'`
- Toggle 3 modes : Public → Sportif → Pro (ou vice versa)
- Utilise `useMode()` hook (useModeStore + router.push)
- Affiche dans mobile bottom sheet ou desktop dropdown

#### `compatibility-badge.tsx`

- Badge visuel (e.g., "80% compatible" vert, "60%" orange, "40%" rouge)
- Props : score number (0-100), animated
- Utilisé : pro-card matching

#### `empty-state.tsx`

- Composant réutilisable absence data
- Props : icon, title, description, action CTA
- Utilisé : listes vides clients, séances, etc.

### Sous-dossier `public/` (4 composants landing)

#### `hero.tsx`

- Section animée (Framer Motion containerVariants + itemVariants)
- Layout : heading "Le Doctolib du coaching sportif" + description + dual CTA buttons (sportif bleu, coach or)
- Gradient background, responsive height

#### `features-section.tsx`

- 3 composants : FeaturesSportif, FeaturesPro, HowItWorks
- Chacun : grid 3 colonnes desktop, 1 mobile
- FeatureCard enfants avec icône, titre, description
- Animations Framer

#### `feature-card.tsx`

- Card simple : icône lucide, titre, description, optional CTA button
- Utilisé par FeaturesSportif, FeaturesPro, HowItWorks

#### `section-heading.tsx`

- Réutilisable heading + description section
- Props : title, description, icon?
- Utilisé : multiple sections landing

### Sous-dossier `sportif/` (3+ composants métier)

#### `pro-card.tsx`

- Affiche une fiche pro compact
- Props : pro (Pro object), matchScore (optionnel)
- Affiche : avatar, nom, spécialité, sports, tarif, score compatibilité (CompatibilityBadge), avis
- CTA : "Voir détails" (Link vers `/pros/[id]`)
- Utilisé : accueil sportif top 5, recherche, résultats matching

#### `onboarding/progress-bar.tsx`

- Affiche step counter (1/6, 2/6, etc.) + progress visual
- Props : current number, total number
- Utilisé : inscription sportif + pro

#### `onboarding/step-wrapper.tsx`

- Conteneur réutilisable pour une step
- Props : title, description, children (form), buttons (prev/next)
- Animations entrée/sortie (slideRightVariants ou fadeInVariants)

#### `onboarding/vibe-slider.tsx`

- Slider triple horizontal (pedagogieDiscipline, suiviAutonomie, dataRessenti)
- Scale 0-10, affiche emoji ressenti + label
- Props : currentVibe VibeProfile, onChange callback
- Utilisé : étape 5 onboarding sportif + pro

---

## 4. Logique métier : `lib/`

### `lib/matching.ts` (137 LOC)

**Algorithme scoring 100 pts (décomposé) :**

```
computeMatchScore(sportif: Sportif, pro: Pro) → MatchScore

1️⃣ Pilier Logistique (45 pts)
   ├── Sport compatible (20 pts) : ✅ si ≥1 sport commun, ❌ sinon
   ├── Budget compatible (15 pts) : 15 si pro.tarifMin ≤ sportif.budgetMax, sinon dégradé % écart
   └── Distance mockée (10 pts) :
       ├── <5km → 10, <10km → 7, <20km → 4, ≥20km → 0
       └── Basée sur 2 premiers chiffres codes postaux + offset 3 derniers

2️⃣ Pilier Performance (20 pts)
   ├── Tags communs (15 max) : 3 pts/tag objectifs↔services, plafonné 15
   └── Cohérence niveau (5 pts) : 5 si identique, 3 si voisin, 0 sinon

3️⃣ Pilier Psychologie (35 pts)
   ├── pedagogieDiscipline (15 max) : max(0, 15 - |sportif.vibe - pro.vibe|)
   ├── suiviAutonomie (10 max) : max(0, 10 - |écart|)
   └── dataRessenti (10 max) : max(0, 10 - |écart|)

scoreTotal = min(100, logistique + performance + psychologie)
```

**Exports :**

- `computeMatchScore(sportif, pro)` → MatchScore
- `rankPros(sportif, pros)` → MatchScore[] sorted desc par scoreTotal

**Utilisé par :**

- `hooks/use-matching.ts` → `useMatchedPros(limit?)`
- Pages recherche, accueil sportif

### `lib/animations.ts` (27 LOC)

Variants Framer Motion partagés (typés `Variants`) :

| Variant              | Utilisation                                                       |
| -------------------- | ----------------------------------------------------------------- |
| `containerVariants`  | Stagger children, délai 0.08s entre items                         |
| `itemVariants`       | Fade-in + slide-down (opacity 0→1, y 12→0, duration 0.4, easeOut) |
| `slideRightVariants` | Entrée droite, sortie gauche (initial/animate/exit)               |
| `fadeInVariants`     | Fade simple (opacity 0→1, duration 0.3)                           |

**Utilisé par :**

- Hero section, features sections
- Onboarding steps
- Listes animées

### `lib/constants.ts` (100 LOC)

Énumérations + mappings :

| Constant             | Type                                                                  | Valeurs                                                                                    |
| -------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `SPORTS_DISPONIBLES` | { value: Sport; label: string }[]                                     | fitness, running, yoga, musculation, crossfit, natation, boxe, football, tennis, autre     |
| `SPECIALITES`        | { value: Specialite; label: string }[]                                | coach_sportif, preparateur_physique, preparateur_mental, nutritionniste, educateur_sportif |
| `FORMULES`           | { value: Formule; label: string; prix: number; features: string[] }[] | standard (29€), premium (59€), elite (99€)                                                 |
| `OBJECTIFS`          | readonly { value: Objectif; label: string }[]                         | perte_poids, prise_masse, post_blessure, preparation_competition, bien_etre, autre         |
| `NIVEAUX`            | readonly { value: Niveau; label: string }[]                           | debutant, intermediaire, avance                                                            |
| `FREQUENCES`         | readonly { value: Frequence; label: string }[]                        | 1x, 2-3x, 4+ (par semaine)                                                                 |
| `MAX_SCORE`          | number                                                                | 100 (plafond algo matching)                                                                |
| `RESSENTI_EMOJIS`    | Record<1\|2\|3\|4, string>                                            | { 1: '😫', 2: '😐', 3: '😊', 4: '🔥' }                                                     |

### `lib/formatters.ts` (41 LOC)

Wrappers date-fns locale fr + formatage :

| Function                     | Signature               | Exemple                    |
| ---------------------------- | ----------------------- | -------------------------- |
| `formatPrice(amount)`        | number → string         | 59 → "59€"                 |
| `formatPricePerHour(amount)` | number → string         | 50 → "50€/h"               |
| `formatDate(date)`           | string \| Date → string | → "26 avril 2026"          |
| `formatDateShort(date)`      | string \| Date → string | → "26 avr"                 |
| `formatTime(date)`           | string \| Date → string | → "14:30"                  |
| `formatDateTime(date)`       | string \| Date → string | → "lundi 26 avril à 14:30" |
| `formatRelative(date)`       | string \| Date → string | → "il y a 2 heures"        |
| `formatDuration(minutes)`    | number → string         | 90 → "1h30"                |

### `lib/utils.ts` (7 LOC)

Utility minimale :

```typescript
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

Mergeur Tailwind + clsx (déduplicate classes, applique les dernières).

### `lib/schemas/` (Zod validation, 4 fichiers)

#### `auth.ts`

```typescript
connexionSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6).max(72),
  role: z.enum(['sportif', 'pro']),
});
```

#### `onboarding-sportif.ts`

```typescript
onboardingSportifSchema = z.object({
  prenom: z.string().min(2),
  nom: z.string().min(2),
  sports: z.array(z.enum([...])).min(1),
  niveau: z.enum(['debutant', 'intermediaire', 'avance']),
  objectifs: z.array(z.enum([...])).min(1),
  budgetMax: z.number().int().positive(),
  codePostal: z.string().regex(/^\d{5}$/),
  frequence: z.enum(['1x', '2-3x', '4+']),
  vibe: vibeSchema,
})

vibeSchema = z.object({
  pedagogieDiscipline: z.number().int().min(0).max(10),
  suiviAutonomie: z.number().int().min(0).max(10),
  dataRessenti: z.number().int().min(0).max(10),
})
```

#### `onboarding-pro.ts`

```typescript
onboardingProSchema = z.object({
  prenom, nom, codePostal, // basics
  specialite: z.enum(['coach_sportif', ...]),
  sports: z.array(z.enum([...])).min(1),
  niveauEnseigne: z.array(z.enum(['debutant', 'intermediaire', 'avance'])).min(1),
  tarifMin, tarifMax: z.number().positive(),
  formats: z.array(z.enum(['presentiel', 'visio', 'hybride'])).min(1),
  description: z.string().max(500),
  vibe: vibeSchema,
})

carteServiceCreateSchema = z.object({
  titre: z.string(),
  tags: z.array(z.string()).min(1),
  description: z.string().max(200),
  dureeMinutes: z.number().int().positive(),
})
```

#### `index.ts`

Barrel exports : connexionSchema, onboardingSportifSchema, vibeSchema, onboardingProSchema, carteServiceCreateSchema (+ types infer).

### `lib/mock-data/` (3630 LOC, détail)

#### Barrel `index.ts` (6 LOC)

```typescript
export { pros } from './pros';
export { sportifs, defaultSportif } from './sportifs';
export { conversations } from './conversations';
export { seances } from './seances';
export { healthNotes, progressionData, coachNotes } from './health';
```

#### `pros/` (50 pros, 3630 LOC, split par spécialité)

| Fichier              | LOC  | Nb pros | Spécialité                                                                    |
| -------------------- | ---- | ------- | ----------------------------------------------------------------------------- |
| `coachs.ts`          | 1807 | 32      | coach_sportif (le plus volumineux)                                            |
| `prep-physique.ts`   | 689  | 12      | preparateur_physique                                                          |
| `nutritionnistes.ts` | 379  | 5       | nutritionniste                                                                |
| `prep-mental.ts`     | 375  | 5       | preparateur_mental                                                            |
| `educateurs.ts`      | 357  | 5       | educateur_sportif                                                             |
| `index.ts`           | 23   | n/a     | Concat arrays : [...coachs, ...prepPhysique, ...nutri, ...prepMental, ...edu] |

**Structure Pro :** id (pro-001...), prenom/nom, specialite, sports[], niveauEnseigne[], tarifMin, tarifMax, formats, description, codePostal, avis[], cartesServices[], vibe { pedagogieDiscipline, suiviAutonomie, dataRessenti }, photo (URL unsplash).

**Exemple coachs.ts :** 32 objectifs coachs, noms vvariés, sports multiples, tarifs 50-150€/h, vibe scores randomisés.

#### `sportifs.ts` (306 LOC, 20 sportifs)

- **defaultSportif** : Anne Martin, niveau debutant, fitness/yoga, perte_poids, budget 200€, vibe (7,6,5)
- 19 autres sportifs avec mix objectifs, niveaux, budgets (50-500€)
- Utilisés pour mock seances, matching

#### `seances.ts` (290 LOC, 34 séances)

Structure : id, proId, sportifId, date (ISO 8601), dureeMinutes (30/60/90), tarif (50-150€), lieu (optionnel), statut enum (confirmee/paiement_realisee/annulee), notes.

Mix : ~ 10-15 confirmées (2026-04-27 futur), autres passées (2026-04-20 back).

#### `conversations.ts` (195 LOC, 15 conversations)

Structure : id, proId, sportifId, dernier_message_date, messages [{ expediteur ('pro'|'sportif'), contenu, date, lue }].

5-10 messages par conversation, textes réalistes.

#### `health.ts` (208 LOC, 3 exports)

- **healthNotes** : Record<sportifId, HealthNote[]>, chacun { date, description, niveauAlerte (bon|attention|critique) }
- **progressionData** : Record<sportifId, ProgressionPoint[]>, chaque point { date, value (poids/kilos/reps) }
- **coachNotes** : Record<sportifId, NoteCoach[]>, notes par pro après séance

Utilisés : pages revenus (charts), profil sportif (progression).

---

## 5. State Management : `stores/`

### `user-store.ts` (26 LOC)

```typescript
interface UserStore {
  sportif: Sportif | null;
  pro: Pro | null;
  setSportif: (sportif: Sportif) => void;
  setPro: (pro: Pro) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      sportif: null,
      pro: null,
      setSportif: (sportif) => set({ sportif }),
      setPro: (pro) => set({ pro }),
      clearUser: () => set({ sportif: null, pro: null }),
    }),
    { name: 'nakama-user' },
  ),
);
```

**Persist key :** `'nakama-user'` (localStorage). Survivie refresh page.

**Utilisé par :** pages onboarding (setSportif/setPro post-form), pages espace (currentUser read), mode-switcher (clearUser on logout mock).

### `mode-store.ts` (20 LOC)

```typescript
export type Mode = 'public' | 'sportif' | 'pro';

interface ModeStore {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

export const useModeStore = create<ModeStore>()(
  persist(
    (set) => ({
      mode: 'public',
      setMode: (mode) => set({ mode }),
    }),
    { name: 'nakama-mode' },
  ),
);
```

**Persist key :** `'nakama-mode'` (localStorage). Track mode courant, pas utilisé pour navigation (voir `useMode()` hook).

### `ui-store.ts` (14 LOC)

```typescript
interface UiStore {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  toggleDrawer: () => void;
}

export const useUiStore = create<UiStore>()((set) => ({
  drawerOpen: false,
  setDrawerOpen: (open) => set({ drawerOpen: open }),
  toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),
}));
```

**Non-persist** (pas localStorage). Utilisé : nav mobile drawer (optionnel, peut remplacer par composant local useState).

---

## 6. Hooks : `hooks/`

### `use-mobile.ts` (23 LOC)

**Signature :** `useMobile(breakpoint = 768): boolean | null`

```typescript
export function useMobile(breakpoint = 768): boolean | null {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => setIsMobile(mql.matches);
    onChange(); // call once
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [breakpoint]);
  return isMobile;
}
```

**Retourne :**

- `null` : SSR ou premier render (détection client pas encore faite)
- `true` : mobile détecté (< 768px)
- `false` : desktop confirmé (≥ 768px)

**Changement récent (commit 5e04b42) :** Retourne maintenant `boolean | null` (au lieu de `boolean`), permettant aux consommateurs de distinguer "pas encore connu" (SSR/hydration) de "confirmé desktop". Utilisé crucially par agenda pro pour basculer auto sur mobile.

### `use-matching.ts` (18 LOC)

**Signature :** `useMatchedPros(limit?: number): MatchScore[]`

```typescript
export function useMatchedPros(limit?: number) {
  const sportif = useUserStore((s) => s.sportif);
  return useMemo(() => {
    if (!sportif) return [];
    const ranked = rankPros(sportif, pros);
    return limit ? ranked.slice(0, limit) : ranked;
  }, [sportif, limit]);
}
```

Consomme user store + `lib/matching.rankPros()`, retourne top matching pros.

**Utilisé par :** accueil sportif (top 5), recherche (all), pro-cards.

### `use-count-up.ts` (30 LOC)

**Signature :** `useCountUp(target: number, duration = 1000): number`

```typescript
export function useCountUp(target: number, duration = 1000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf: number;
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}
```

Anime montée de 0 → target, easeOutCubic. **Utilisé :** section "Nombres" landing page (% match, nb pros, etc.).

### `use-mode.ts` (28 LOC)

**Signature :** `useMode(): { mode: Mode; switchMode: (newMode: Mode) => void }`

```typescript
export function useMode() {
  const { mode, setMode } = useModeStore();
  const router = useRouter();
  const switchMode = useCallback(
    (newMode: Mode) => {
      setMode(newMode);
      router.push(MODE_ROUTES[newMode]);
    },
    [setMode, router],
  );
  return { mode, switchMode };
}

const MODE_ROUTES: Record<Mode, string> = {
  public: '/',
  sportif: '/accueil',
  pro: '/dashboard',
};
```

Combine store + navigation. **Utilisé :** mode-switcher component, dual CTA onboarding.

---

## 7. Types : `types/`

### `index.ts` (6 LOC) : Barrel

```typescript
export type { Sportif, Niveau, Genre, Objectif, VibeProfile } from './sportif';
export type { Pro, Specialite, Sport, Format, Formule, CarteService, Avis } from './pro';
export type { Seance, StatutSeance } from './seance';
export type { Conversation, Message } from './conversation';
export type { MatchScore } from './matching';
export type { HealthNote, NiveauAlerte, ProgressionPoint, NoteCoach } from './health';
```

### `sportif.ts`

```typescript
export interface Sportif {
  id: string
  prenom: string; nom: string
  genre: 'M' | 'F' | 'NB'
  niveau: Niveau
  sports: Sport[]
  objectifs: Objectif[]
  budgetMax: number
  frequence: '1x' | '2-3x' | '4+'
  codePostal: string
  vibe: VibeProfile
  photo?: string
  dateInscription: string
}

export type Niveau = 'debutant' | 'intermediaire' | 'avance'
export type Objectif = 'perte_poids' | 'prise_masse' | 'post_blessure' | 'preparation_competition' | 'bien_etre' | 'autre'
export type Sport = 'fitness' | 'running' | 'yoga' | 'musculation' | ... | 'autre'

export interface VibeProfile {
  pedagogieDiscipline: number // 0-10
  suiviAutonomie: number // 0-10
  dataRessenti: number // 0-10
}
```

### `pro.ts`

```typescript
export interface Pro {
  id: string;
  prenom: string;
  nom: string;
  specialite: Specialite;
  sports: Sport[];
  niveauEnseigne: Niveau[];
  tarifMin: number;
  tarifMax: number;
  formats: Format[];
  description: string;
  codePostal: string;
  avis: Avis[];
  cartesServices: CarteService[];
  vibe: VibeProfile;
  photo?: string;
  dateInscription: string;
}

export type Specialite =
  | 'coach_sportif'
  | 'preparateur_physique'
  | 'preparateur_mental'
  | 'nutritionniste'
  | 'educateur_sportif';
export type Format = 'presentiel' | 'visio' | 'hybride';
export type Formule = 'standard' | 'premium' | 'elite';

export interface CarteService {
  id: string;
  titre: string;
  tags: string[];
  description: string;
  dureeMinutes: number;
}

export interface Avis {
  id: string;
  sportifId: string;
  note: number; // 1-5
  commentaire: string;
  date: string;
}
```

### `seance.ts`

```typescript
export interface Seance {
  id: string;
  proId: string;
  sportifId: string;
  date: string; // ISO 8601
  dureeMinutes: number;
  tarif: number;
  lieu?: string;
  statut: StatutSeance;
  notes?: string;
}

export type StatutSeance = 'confirmee' | 'paiement_realisee' | 'annulee';
```

### `conversation.ts`

```typescript
export interface Conversation {
  id: string;
  proId: string;
  sportifId: string;
  dernier_message_date: string;
  messages: Message[];
}

export interface Message {
  id: string;
  expediteur: 'pro' | 'sportif';
  contenu: string;
  date: string;
  lue: boolean;
}
```

### `matching.ts`

```typescript
export interface MatchScore {
  proId: string;
  scoreTotal: number;
  logistique: number;
  performance: number;
  psychologie: number;
  details: {
    sportCompatible: number;
    budgetCompatible: number;
    distance: number;
    tagsCommuns: number;
    niveauCoherence: number;
    pedagogieDiscipline: number;
    suiviAutonomie: number;
    dataRessenti: number;
  };
}
```

### `health.ts`

```typescript
export interface HealthNote {
  id: string;
  date: string;
  description: string;
  niveauAlerte: NiveauAlerte;
}

export type NiveauAlerte = 'bon' | 'attention' | 'critique';

export interface ProgressionPoint {
  date: string;
  value: number; // poids/km/reps/etc
}

export interface NoteCoach {
  id: string;
  proId: string;
  date: string;
  contenu: string;
}
```

---

## 8. Pages Router résiduel : `pages/`

### `pages/_error.tsx` (58 LOC)

**Workaround Next 15 :** Next 15 + React 19 crash interne sur le fallback `_error` auto-généré au prerender (useRef on null). Solution : fichier custom `_error.tsx` Pages Router qui évite le crash.

```typescript
import type { NextPageContext } from 'next'

interface ErrorProps {
  statusCode?: number
}

function Error({ statusCode }: ErrorProps) {
  return (
    <div style={{ /* ... centered flex, dark bg */ }}>
      {/* Heading + message dynamique 404 vs 500 */}
    </div>
  )
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
```

**Utilisé :** fallback pour erreurs SSR non catchées par app/global-error.tsx. À supprimer une fois Next 15 LSR corrigé.

---

## 9. Assets : `public/`

### Contenu actuel

```
public/
├── file.svg, globe.svg, next.svg, vercel.svg, window.svg  (5 SVGs placeholder Create Next App)
├── logos/                                                  (empty dir)
└── images/
    └── pros/                                               (empty dir)
```

### Note importante (commit 2eee29b)

Assets de branding sont générés **dynamiquement** via Next 15 ImageResponse convention :

- `app/icon.tsx` → favicon.ico 32×32 (généré, pas binaire)
- `app/apple-icon.tsx` → apple-icon.png 180×180 (généré)
- `app/opengraph-image.tsx` → OG card 1200×630 (généré)
- `app/twitter-image.tsx` → réexport opengraph-image

**Avantage :** Hot-reload en dev, tailorable facilement (couleurs, texte), versionné en Git (code vs binaires).

**Note :** `/public/images/pros/` reste vide (50 pros utilisent CDN `images.unsplash.com`). Migration locale possible via script `scripts/download-photos.ts` (non encore implanté).

---

## 10. Documentation

### `README.md` (221 lignes, voir section 10)

Résumé structure, stack justifs, mocks, algo matching, déploiement Vercel, roadmap post-MVP, dette technique (5 catégories).

**Section "Dette technique connue" (26 lignes) :**

1. Fichiers volumineux > 400 LOC (agenda: 647, onboarding pro: 603, etc.)
2. Patterns dupliqués (PillButton, mapping statuts badge, labels spécialité)
3. Onboarding partiellement RHF (vs. connexion + cartes services complet)
4. Pages légales placeholder (à faire valider juridiquement)
5. Force-dynamic global (toutes routes SSR à la demande, pas SSG)
6. Couverture tests 0%
7. Photos CDN (vers local)
8. Backend/Auth/Persistance absents

### `AGENTS.md` (65 lignes)

Conventions agents refacto :

- Stack actuelle (versions, workarounds)
- Conventions code (pas `any`, cn() merger, RHF+Zod, animations, mocks)
- Scripts npm (avec explications)
- Husky pre-commit (lint-staged + typecheck)

### `docs/DOD-LIVRAISON.md`

Checklist MVP : wireframes, flows, composants, data, tests, déploiement.

### `docs/CHASE-ASSETS.md`

Liste assets graphiques à intégrer (logos, photos pros, icônes custom, OG images).

### `.env.local.example` (12 lignes)

```
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Comment mettre en prod : s'adapter URLs, supprimer DEMO_MODE.

---

## 11. Workarounds Next 15 actifs

| Workaround                                                 | Raison                                                                         | Impact                                            | Status                                           |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------- | ------------------------------------------------ |
| `output: 'standalone'` (next.config.ts:4)                  | Deployable Docker/Vercel sans dépendre Node versions hôte                      | Builds légèrement plus lourds                     | Actif, nécessaire prod                           |
| `dynamic = 'force-dynamic'` (app/layout.tsx:19)            | Contourne crash interne Next 15 + React 19 useRef on null au prerender         | Toutes routes SSR à demande, perte cache statique | Actif, acceptable MVP (à reconsidérer si trafic) |
| `pages/_error.tsx` (fichier Pages Router)                  | Fallback erreur SSR, complément app/global-error.tsx + app/not-found.tsx       | Duplication fichiers erreur                       | Actif, temporaire                                |
| `ClientShell` wrapper (components/common/client-shell.tsx) | RootLayout server ne peut pas inline client component, dynamic avec ssr: false | Indirection composant                             | Actif, pattern standard                          |
| `eslint.config.mjs` FlatCompat (eslint.config.mjs:8-10)    | eslint-config-next v15 pas encore au format ESLint 9 flat                      | Legacy wrapper runtime                            | Actif, temporaire (next upgrade)                 |
| tsconfig sans `exactOptionalPropertyTypes` (tsconfig.json) | @base-ui-components/react types incompatibles                                  | TypeScript strict mais pas ultra-strict           | Actif, accepté                                   |

**Changement récent (commit 2eee29b) :** `eslint.ignoreDuringBuilds: true` RETIRÉ. Linting n'est pas ignoré au build, est forcé en pre-commit husky. À noter pour future audit.

---

## 12. SEO / A11y / Conformité légale

### Metadata complète

**RootLayout (`app/layout.tsx`)** exporte :

- `metadata` : title template, description, applicationName, keywords, authors, creator, openGraph (type website, locale fr_FR), twitter (card summary_large_image)
- `viewport` : themeColor #0B0F14, device-width, initialScale 1
- JSON-LD inline : Organization (@id, url, logo, description, sameAs []) + SoftwareApplication (operatingSystem Web, applicationCategory HealthApplication)

### Robots.txt (`app/robots.ts`)

```
User-agent: *
Allow: /
Disallow: [/accueil, /recherche, /pros/, /rdv, /profil, /messages, /reservation/, /dashboard, /clients, /agenda, /cartes-services, /revenus, /parametres]
Sitemap: ${APP_URL}/sitemap.xml
```

Crawl public seulement (landing + connexion + inscriptions + légales), pas espaces connectés.

### Sitemap.xml (`app/sitemap.ts`)

7 routes publiques + 3 légales (21 lignes) :

1. `/` : weekly, priority 1
2. `/connexion` : monthly, 0.7
3. `/inscription/sportif`, `/inscription/pro` : monthly, 0.8 chacune
4. `/cgu`, `/confidentialite`, `/mentions-legales` : yearly, 0.3 chacune

### Noindex sur espaces protégés

Layouts (sportif) + (pro) + (auth inscription) exportent metadata :

```typescript
export const metadata: Metadata = {
  robots: { index: false },
};
```

Seules landing + légales indexées.

### DemoBanner sticky top

Montée partout (`app/layout.tsx` → enfants) avec z-60, dismissible, message "Démo prototype".

### Pages légales (3 fichiers) : Conformité RGPD minimale

| Page                         | Contenu                                                                                                           | État                            |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `/cgu` (96 LOC)              | 8 sections : Objet, Inscription, Réservation, Annulation, Responsabilités, Données, Modifications, Loi            | Placeholder, à valider          |
| `/confidentialite` (92 LOC)  | 8 sections : Responsable, Données collectées, Finalités, Bases légales, Rétention, Destinataires, Droits, Cookies | Placeholder RGPD, à valider DPO |
| `/mentions-légales` (75 LOC) | Éditeur (à compléter), Contact, Hébergement Vercel, PI                                                            | Placeholder, à compléter        |

**Banner warning :** Chaque page affiche "Document à finaliser" orange → important pour démo seulement.

### Footer câblé (app/page.tsx)

```html
<Link href="/cgu">CGU</Link>
<Link href="/confidentialite">Confidentialité</Link>
<Link href="/mentions-legales">Mentions légales</Link>
<a href="mailto:contact@nakama.tech">Contact</a>
```

Fonctionnels, responsive.

---

## 13. Dette technique recensée

### Fichiers volumineux (candidats split)

| Fichier                                   | LOC  | Suggestion                                                      | Faisabilité                                           |
| ----------------------------------------- | ---- | --------------------------------------------------------------- | ----------------------------------------------------- |
| `lib/mock-data/pros/coachs.ts`            | 1807 | Split par initial/région (pro-001-020, pro-021-032)             | Difficile (tous coach_sportif, distinctions mineures) |
| `app/(auth)/inscription/pro/page.tsx`     | 603  | Extraire Step1…Step6 vers `inscription/pro/_steps/`             | Haute                                                 |
| `app/(pro)/clients/[id]/page.tsx`         | 465  | Extraire 4 onglets en composants (TabInfos, TabHistorique, etc) | Haute                                                 |
| `app/(auth)/inscription/sportif/page.tsx` | 458  | Idem pro                                                        | Haute                                                 |
| `app/(pro)/cartes-services/page.tsx`      | 363  | Extraire Dialog création + liste                                | Moyenne                                               |

### Patterns dupliqués

- **PillButton** : défini inline dans onboarding pro ET onboarding sportif → créer `components/common/pill-button.tsx`
- **Mapping statut séance → couleur badge** : répété 3+ fois → helper `getStatutBadgeProps(statut)` dans constants
- **Lancement spécialité** : `SPECIALITES.find(s => s.value === pro.specialite)?.label` répété → helper `getSpecialiteLabel(specialite)`
- **Format par défaut** : `formats[0] ?? 'presentiel'` dupliqué → helper `getDefaultFormat(formats)`

### Onboarding partiellement RHF

Connexion + cartes services : RHF complet. Onboarding sportif/pro : `useState` steps + Zod `safeParse()` au submit final.

→ À migrer vers RHF `FormProvider` (meilleure UX erreurs, cohérence).

### Pages légales placeholder

CGU, Confidentialité, Mentions légales : contenu skeleton avec banner "À finaliser".

→ À faire valider par service juridique / DPO avant ouverture utilisateurs réels.

### Force-dynamic global

`app/layout.tsx` export `dynamic = 'force-dynamic'` → toutes routes SSR à la demande, pas SSG.

→ Acceptable MVP (démo), à reconsidérer si trafic élevé (perte bénéfices cache statique Edge).

### Couverture tests : 0%

Aucun test unitaire (Vitest), aucun E2E (Playwright).

**Priorités :**

1. `lib/matching.ts` : edge cases scoring (distance mockée, budget dégradé, cohérence niveau)
2. Flow inscription → recherche → réservation (E2E Playwright)

### Photos pros en CDN distant

50 pros : `images.unsplash.com` whitelistées `next.config.ts`.

→ Migration local `/public/images/pros/` via script download (non implanté) → latence réduite.

### Backend / Auth / Persistance : totalement absents

MVP : mock data localStorage, pas serveur.

**À implanter post-MVP :**

1. Backend (Supabase / Vercel Postgres) + auth (NextAuth / Supabase Auth)
2. Remplacer mocks par API routes / Server Actions
3. Paiements Stripe Connect
4. Messagerie WebSocket/Realtime
5. Notifications email + push PWA

---

## 14. Parcours utilisateur reconstitués

### Flow Sportif

```
/ (landing)
  ↓ [CTA "Je cherche un coach"]
/inscription/sportif
  ├─ Step 1 : Prenom, Nom
  ├─ Step 2 : Sports (min 1), Niveau
  ├─ Step 3 : Objectifs (min 1), Budget Max
  ├─ Step 4 : Code postal, Fréquence
  ├─ Step 5 : Vibe (3 sliders pédagogie/suivi/data)
  ├─ Step 6 : Recap + sumit Zod
  ↓ [setSportif()] + navigate
/accueil (sportif)
  ├─ Top 5 ProCard matching
  ├─ CTA "Voir détails" par pro
  ↓
/pros/[id]
  ├─ Fiche pro complet (avatar, spécialité, sports, tarifs, avis, cartes services)
  ├─ CTA "Réserver une séance"
  ↓
/reservation/[proId]
  ├─ Step 1 : Choix carte service + date/heure
  ├─ Step 2 : Saisie informations complémentaires
  ├─ Step 3 : Recap + paiement Stripe simulé (pas réel)
  ↓
/reservation/confirmation
  ├─ Message succès
  ├─ Lien vers /rdv pour voir séance
```

**Données :** Zod validation end-to-end, localStorage persistence (user-store), démo auth auto-login.

### Flow Pro

```
/ (landing)
  ↓ [CTA "Je suis coach"]
/inscription/pro
  ├─ Step 1 : Prenom, Nom, Code postal
  ├─ Step 2 : Spécialité, Sports (min 1)
  ├─ Step 3 : Niveaux, Tarifs (min/max), Formats
  ├─ Step 4 : Description, Vibe (3 sliders)
  ├─ Step 5 : Cartes services (Dialog création inline, min 1)
  ├─ Step 6 : Recap + submit Zod
  ↓ [setPro()] + navigate
/dashboard (pro)
  ├─ Stats placeholder (revenus, clients, séances)
  ├─ Nav horizontal : Agenda, Clients, Cartes services, Revenus, Paramètres
  ↓
/agenda (pro)
  ├─ 3 vues : Jour (mobile-first) / Semaine (scroll) / Mois (compact)
  ├─ Auto-bascule mobile : Semaine masquée, force Jour
  ├─ FAB "Bloquer une plage" (icon mobile, label desktop)
  ├─ Affiche séances + plages bloquées
  ↓
/clients
  ├─ List clients avec nb séances, dernier RDV
  ↓
/clients/[id]
  ├─ 4 onglets : Infos, Historique séances, Notes coach, Objectifs
  ↓
/cartes-services
  ├─ Dialog création + liste cartes
  ↓
/revenus
  ├─ Stats Recharts, graphiques progress
```

**Cas spécial mobile :** Agenda vue Semaine masquée (hidden sm:block), auto-basculement Jour si isMobile === true.

### Flow Public

```
/ (landing)
  ├─ Header sticky (logo NAKAMA, nav desktop, CTA Connexion mobile)
  ├─ Hero section (animé Framer)
  ├─ FeaturesSportif section
  ├─ FeaturesPro section
  ├─ HowItWorks section
  ├─ Footer sticky bottom
  │   ├─ Copyright 2026
  │   ├─ Links : /cgu, /confidentialite, /mentions-legales, contact@
  ↓ [CTA dual "Je suis sportif / Je suis coach"]
/inscription/{sportif,pro} ou /connexion
```

**DemoBanner :** Collé top de tout écran, z-60, dismissible X.

---

## 15. État de complétion par feature (tableau)

| Feature                        | %   | État résumé                                      | Notes                              |
| ------------------------------ | --- | ------------------------------------------------ | ---------------------------------- |
| Landing publique               | 100 | Complet, animé Hero, 3 sections features, footer | Production-ready                   |
| Onboarding sportif             | 70  | 6 steps Zod, UI complet, mock auth               | Refacto RHF pending                |
| Onboarding pro                 | 70  | 6 steps Zod, cartes services inline, mock auth   | Refacto RHF + split steps          |
| Connexion                      | 90  | RHF + Zod, dual CTA, mock auto-login             | Backend auth absent                |
| Pages légales                  | 40  | Wireframe placeholder 3 pages                    | À faire valider DPO                |
| Matching algo                  | 100 | 3 piliers, 100 pts décomposé, hook exported      | Validation risque 0 (algo simple)  |
| Espace sportif (nav+accueil)   | 60  | Nav mobile 4 items, accueil top 5 matching       | Pages/recherche/rdv à approfondir  |
| Recherche pros                 | 60  | Filter + sort matching, UI basique               | Filtering avancé absent            |
| Réservation 3-step             | 80  | Steps complet, Stripe simulé, confirmation       | Paiement réel absent               |
| Espace pro (nav+dashboard)     | 60  | Nav mobile 6 items, dashboard stats placeholder  | Pages/clients/cartes à approfondir |
| Agenda pro (jour/semaine/mois) | 95  | 3 vues, mobile auto-bascule, blocage plages      | Évaluation détail haute            |
| Clients list + detail          | 70  | List client, 4 onglets detail                    | Onglets slide horizontal?          |
| Cartes services                | 60  | Dialog création, list basique                    | Édition / suppression?             |
| Messagerie                     | 40  | Wireframe conversations list + detail            | Realtime absent                    |
| RDV list                       | 60  | List séances à venir/passées                     | Détail action manquante            |
| Notifications (email/push)     | 0   | Absent                                           | Roadmap post-MVP                   |
| Paiements Stripe               | 20  | Workflow simulé (pas API)                        | Stripe Connect absent              |
| Auth persistance               | 50  | localStorage user/mode stores                    | Backend/session absent             |

---

## 16. État Git détaillé (récapitulatif)

**12 commits depuis init :**

| #   | Hash      | Message                                               | Date       | Auteur | Détail                                                     |
| --- | --------- | ----------------------------------------------------- | ---------- | ------ | ---------------------------------------------------------- |
| 1   | `e344344` | Initial commit from Create Next App                   | n/a        | n/a    | Boilerplate Next 15                                        |
| 2   | `225280b` | feat: initial commit                                  | n/a        | n/a    | MVP baseline (routes, mocks, stores)                       |
| 3   | `2a58f82` | chore: snapshot avant downgrade Next 15               | n/a        | n/a    | Pre-downgrade checkpoint                                   |
| 4   | `c8ed44c` | feat(build): downgrade Next 16 → 15                   | n/a        | n/a    | Align brief (Next 15.5)                                    |
| 5   | `e7cc840` | feat(forms+screens): Zod 4 forms + écrans             | n/a        | n/a    | Validation + 4 pages                                       |
| 6   | `015f706` | feat: agenda mois + blocage, refacto, SEO             | n/a        | n/a    | Agenda v1 (mois), SEO complet                              |
| 7   | `9fe1e88` | docs(readme): fix markdown table                      | n/a        | n/a    | Doc                                                        |
| 8   | `f49d421` | feat(banner): demo banner                             | n/a        | n/a    | DemoBanner sticky                                          |
| 9   | `7f6098f` | docs: TECHNICAL.md                                    | 26-04-2026 | n/a    | Audit v1                                                   |
| 10  | `2eee29b` | feat: assets + lint + pages légales + dette           | 26-04-2026 | n/a    | Assets dynamiques, pages légales, pnpm lint fix, dette doc |
| 11  | `2ccec5f` | feat(agenda): refacto mobile-first vue Jour + bascule | 26-04-2026 | n/a    | Agenda v2 : 3 vues, auto-bascule mobile                    |
| 12  | `5e04b42` | fix(agenda): bascule mobile garantie                  | 26-04-2026 | n/a    | useMobile → boolean \| null, vue Semaine masquée mobile    |

**État :** Tous 12 commits poussés sur `origin/main`. Working tree clean. HEAD = `5e04b42`.

---

## 17. Synthèse volumétrie finale

| Dossier          | Fichiers .tsx/.ts | LOC        | %       |
| ---------------- | ----------------- | ---------- | ------- |
| `app/`           | 32                | 5762       | 41      |
| `components/`    | 29                | 1783       | 13      |
| `lib/`           | 20                | 5092       | 36      |
| `stores/`        | 3                 | 65         | <1      |
| `hooks/`         | 4                 | 105        | 1       |
| `types/`         | 7                 | 150        | 1       |
| `pages/`         | 1                 | 58         | <1      |
| **TOTAL source** | **96**            | **13 938** | **100** |

**Note :** Exclut `.next/`, `node_modules/`, binaires. LOC via `wc -l` sur fichiers TypeScript/TSX source uniquement.

---

## Conclusion

NAKAMA MVP (audit v2, 26 avril 2026) est un prototype fonctionnel **vitrine + demo** (pas persistance serveur) destiné levée investisseur pre-seed.

**Points forts :**

- Stack moderne Next 15 + React 19 + Tailwind v4, type-safe Zod
- Algo matching 3 piliers, 100 pts décomposé (production-ready)
- Responsive mobile-first, DemoBanner, SEO (robots.txt + sitemap + JSON-LD)
- Onboarding 6-step sportif + pro, formulaires Zod/RHF
- Espace pro complet (agenda 3 vues mobile-aware, clients, cartes services)
- 50 pros mock split par spécialité, 20 sportifs, 34 séances

**Limitations assumées (MVP) :**

- Pas backend/auth/persistance réelle (localStorage mock)
- Pages légales placeholder (nécessite validation DPO)
- Force-dynamic global (pas SSG, acceptable démo)
- Zéro tests (Vitest/Playwright)
- Photos CDN Unsplash (latence variable)

**Refactos récents (commits 2eee29b, 2ccec5f, 5e04b42) :**

- Assets dynamiques ImageResponse (icon, apple-icon, OG, Twitter)
- Lint propre (`pnpm lint` = `eslint .` direct, `ignoreDuringBuilds` retiré)
- Pages légales 3 fichiers (placeholder RGPD)
- Agenda refactorisé : 3 vues jour/semaine/mois + auto-bascule mobile + useMobile hook SSR-aware

**Roadmap post-MVP prioritaire :**

1. Backend (Supabase) + auth NextAuth
2. Stripe Connect paiements réels
3. WebSocket/Realtime messagerie
4. Tests (Vitest matching + Playwright E2E)
5. Split fichiers volumineux (onboarding steps, clients detail)
6. Validation pages légales (DPO)
