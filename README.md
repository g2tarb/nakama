# NAKAMA — MVP vitrine

Marketplace coaching sportif. MVP préparé pour démo investisseur (levée pré-seed 600K€), interview terrain mobile et passation CTO post-levée.

> "Le Doctolib du coaching sportif" — matching comportemental sportif↔coach pro, réservation simple, progression suivie.

## Quick start

```bash
pnpm install                         # premier setup
cp .env.local.example .env.local     # variables d'env (mode démo)
pnpm dev                             # http://localhost:3000

# avant de commit
pnpm typecheck                       # déjà branché en pre-commit husky
pnpm format                          # prettier --write .
pnpm build                           # next build (output standalone)
```

Stack : **pnpm 10**, **Node 20+**.

## Stack & justifs

| Couche      | Choix                                                          | Justification                                     |
| ----------- | -------------------------------------------------------------- | ------------------------------------------------- |
| Framework   | **Next.js 15.5 App Router**                                    | Conforme brief, SSR/RSC ready pour scale post-MVP |
| UI          | **React 19**, **Tailwind v4**, **shadcn/ui (style base-nova)** | Stack imposée + design system cohérent dark-mode  |
| Animations  | **Framer Motion 12**                                           | Transitions Linear/Vercel-grade                   |
| State       | **Zustand 5** + persist localStorage                           | Léger, pas de boilerplate Redux, OK pour MVP      |
| Charts      | **Recharts 3**                                                 | Sparklines dashboard + courbes progression        |
| Formulaires | **react-hook-form 7** + **zod 4**                              | Validation typée bout-en-bout                     |
| Icônes      | **lucide-react**                                               | Cohérent avec shadcn                              |
| Dates       | **date-fns 4** (locale fr)                                     | API fonctionnelle, light                          |

**Décisions notables** :

- `output: 'standalone'` + `dynamic = 'force-dynamic'` au layout root — toutes les routes sont SSR à la demande, pas de SSG (suffisant pour MVP démo, contourne un crash interne Next 15 + React 19 sur le fallback `_error` au prerender). À reconsidérer si besoin de perf critique.
- Pages d'erreur custom : `app/not-found.tsx`, `app/global-error.tsx`, `pages/_error.tsx` (le dernier est un workaround Pages Router pour le fallback Next 15 — voir `AGENTS.md`).
- `tsconfig.json` : `strict: true` + `noUncheckedIndexedAccess` + `noImplicitOverride` + `noUnusedLocals/Parameters`. **Sans** `exactOptionalPropertyTypes` (incompatible avec les types Base UI).

## Arborescence commentée

```
app/
├── layout.tsx                   # RootLayout (server) + metadata SEO + JSON-LD
├── page.tsx                     # Landing publique
├── not-found.tsx, global-error.tsx
├── robots.ts, sitemap.ts        # SEO
├── (auth)/                      # connexion + 2 onboarding
│   └── inscription/{sportif,pro}/page.tsx
├── (sportif)/                   # 9 pages espace sportif (noindex)
│   ├── _layout-shell.tsx        # client component (nav)
│   └── layout.tsx               # server component (metadata noindex)
└── (pro)/                       # 6 pages espace pro (noindex)

components/
├── ui/                          # shadcn base-nova bruts (14)
├── common/                      # Logo, AvatarStack, ModeSwitcher, ClientShell, CompatibilityBadge, EmptyState
├── public/                      # Hero, FeaturesSection, FeatureCard, SectionHeading
└── sportif/                     # ProCard + onboarding (ProgressBar, StepWrapper, VibeSlider)

lib/
├── matching.ts                  # ⭐ Algo scoring 100 pts (Logistique 45 + Performance 20 + Psychologie 35)
├── animations.ts                # containerVariants, itemVariants, slideRightVariants partagés
├── constants.ts                 # SPORTS, SPECIALITES, FORMULES, OBJECTIFS, NIVEAUX…
├── formatters.ts                # date-fns wrappers fr (price, date, duration)
├── schemas/                     # ⭐ Zod : auth, onboarding-sportif, onboarding-pro (avec carteServiceCreate)
├── utils.ts                     # cn() = twMerge(clsx)
└── mock-data/                   # 50 pros (split par spécialité), 20 sportifs, 34 séances, 15 conv, health

hooks/                           # use-matching, use-mobile, use-count-up, use-mode
stores/                          # user-store (persist), mode-store (persist), ui-store
types/                           # 7 fichiers (Sportif, Pro, Seance, Conversation, Health, MatchScore + index)
pages/_error.tsx                 # workaround Next 15 (voir AGENTS.md)
```

## Mocks — où regarder

Tout part de `lib/mock-data/index.ts` (barrel) :

| Export                                         | Source                                               | Volume                 |
| ---------------------------------------------- | ---------------------------------------------------- | ---------------------- |
| `pros`                                         | `lib/mock-data/pros/index.ts` (split par spécialité) | 50                     |
| `sportifs`, `defaultSportif`                   | `lib/mock-data/sportifs.ts`                          | 20                     |
| `seances`                                      | `lib/mock-data/seances.ts`                           | 34                     |
| `conversations`                                | `lib/mock-data/conversations.ts`                     | 15                     |
| `healthNotes`, `progressionData`, `coachNotes` | `lib/mock-data/health.ts`                            | indexés par sportif id |

**Modifier un mock** : édite le fichier source, le typecheck garantit la conformité au type. Les pages se rechargent en dev.

**Ajouter un pro** : ajouter une entrée dans le bon fichier de spécialité sous `lib/mock-data/pros/`. Garder le format `pro-XXX` pour l'id.

## L'algorithme matching

`lib/matching.ts` — scoring **100 pts** entre un `Sportif` et un `Pro` :

| Pilier          | Poids | Détail                                                                                            |
| --------------- | ----- | ------------------------------------------------------------------------------------------------- | --- | ------------------------- |
| **Logistique**  | 45    | Sport en commun (20) + Budget compatible (15) + Distance mockée (10)                              |
| **Performance** | 20    | Tags objectifs↔services (15 max) + Cohérence niveau (5)                                           |
| **Psychologie** | 35    | `pedagogieDiscipline` (15) + `suiviAutonomie` (10) + `dataRessenti` (10) — chacun = `max(0, max - | Δ   | )`sur les 3 axes du`vibe` |

Helpers : `computeMatchScore(sportif, pro)` retourne `MatchScore` (avec breakdown), `rankPros(sportif, pros)` retourne le top trié décroissant.

Consommé par `hooks/use-matching.ts` (`useMatchedPros(limit?)`).

## Déploiement

### Vercel (cible MVP)

```bash
pnpm add -g vercel
vercel login
vercel              # premier deploy preview
vercel --prod       # promote en prod
```

Variables à set dans le dashboard Vercel :

- `NEXT_PUBLIC_DEMO_MODE=true`
- `NEXT_PUBLIC_APP_URL=https://<ton-domaine>`

### Variantes locales

- `pnpm build && pnpm start` — serveur Node prod
- `output: 'standalone'` activé → `.next/standalone/` autonome pour Docker

## Roadmap post-MVP

Ce qui n'est PAS dans le scope vitrine et reste à faire pour passer en prod réelle :

1. **Backend & Auth**
   - Supprimer le mock auth (connexion auto-loggue defaultSportif/pros[4])
   - Auth Supabase / NextAuth + table users
   - API routes `/api/*` ou Server Actions pour mutations
2. **Persistance**
   - Postgres (Supabase) avec migrations
   - Remplacer mock data par requêtes SQL/ORM (Drizzle ou Prisma)
3. **Paiements**
   - Stripe Connect (split coach/Nakama 96.5/3.5)
   - Webhooks séances confirmées → release fonds
4. **Messagerie temps réel**
   - WebSocket ou Supabase Realtime sur la table `messages`
5. **Notifications**
   - Email (Resend/Postmark) + push web (PWA)
6. **Refacto qualité**
   - Extraire `<Step1>` à `<Step6>` des onboarding 466/595 LOC vers `inscription/<role>/_steps/`
   - Refacto onboarding en RHF complet (actuellement Zod uniquement au submit final)
   - Centraliser `STATUT_BADGE` mapping dans `constants.ts`
   - Migrer photos Unsplash vers `/public/images/pros/` (script `scripts/download-photos.ts`)
7. **Tests**
   - Vitest sur `lib/matching.ts` (edge cases scoring)
   - Playwright E2E sur le flow inscription → recherche → réservation
8. **Observabilité**
   - Sentry, Vercel Analytics, Web Vitals tracking

## Dépannage

| Symptôme                               | Solution                                                                                     |
| -------------------------------------- | -------------------------------------------------------------------------------------------- |
| `pnpm build` plante sur `_error: /404` | Vérifier que `pages/_error.tsx` existe (workaround Next 15)                                  |
| Composants UI cassés                   | Vérifier que `@base-ui-components/react` est installé (vrai nom du package shadcn base-nova) |
| Erreurs Framer Motion typings          | Ne PAS upgrader Next à 16 — la combo Next 15 + Framer 12 + React 19 est validée              |
| Husky pre-commit échoue                | Lance `pnpm typecheck` à la main pour voir l'erreur réelle, fix, re-commit                   |

## Conventions

Voir `AGENTS.md` pour les conventions code/refacto.

## Licence

Propriétaire — Nakama, prestataire 4DAYVELOPMENT.
