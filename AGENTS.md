# Conventions agents · NAKAMA MVP

## Stack actuelle (alignée brief Haykel)

- **Next.js 15.5.x** App Router (downgrade depuis 16.2.4 le 2026-04-26 pour rester conforme au brief)
- **React 19.2.x**, TypeScript strict (sans `exactOptionalPropertyTypes`)
- **Tailwind v4** (`@tailwindcss/postcss`)
- **shadcn/ui** style `base-nova` → s'appuie sur `@base-ui-components/react`
- **Framer Motion 12** (animations)
- **Zustand 5** (state) + persist localStorage
- **Recharts 3** (graphiques)
- **react-hook-form 7** + **zod 4** (validation formulaires, à brancher sur les 4 forms)
- **lucide-react** (icônes), **date-fns 4** (fr locale)
- **pnpm 10** comme package manager

## Workarounds en place

- `next.config.ts` : `output: 'standalone'` + `eslint.ignoreDuringBuilds: true` (le hook husky couvre lint/typecheck)
- `app/layout.tsx` : `export const dynamic = 'force-dynamic'` : toutes les routes sont SSR à la demande, pas de SSG (suffisant pour MVP démo, et évite des bugs de prerender Next 15 + React 19)
- `pages/_error.tsx` custom minimal en plus de `app/not-found.tsx` et `app/global-error.tsx` : contourne un crash interne `useRef on null` du fallback `_error` auto-généré par Next 15 lors du SSG
- `components/common/client-shell.tsx` : wrapper client component qui fait `dynamic(import, { ssr: false })` pour le `<ModeSwitcher>` (le RootLayout est un server component, donc pas de `ssr: false` direct)
- `eslint.config.mjs` : utilise `FlatCompat` pour brancher les configs legacy `next/core-web-vitals` et `next/typescript` (eslint-config-next 15 n'est pas encore au format flat)

## Conventions de code

- Pas de `any` : typer strict, utiliser `unknown` + narrow si dynamique
- `cn()` (`@/lib/utils`) pour merger les classes Tailwind
- Formulaires : useForm + zodResolver, schémas dans `lib/schemas/*.ts`
- Animations : variants partagés dans `lib/animations.ts` (`containerVariants`, `itemVariants`)
- Mock data : tout passe par `lib/mock-data/index.ts` (barrel)
- Steps onboarding : composants colocalisés dans `app/.../inscription/<role>/_steps/`
- `pros.ts` : split par spécialité (`lib/mock-data/pros/{coachs,prep-physique,...}.ts`)

## Scripts npm

```
pnpm dev          # next dev (turbopack)
pnpm build        # next build (force-dynamic, output standalone)
pnpm typecheck    # tsc --noEmit (couvert par husky pre-commit)
pnpm format       # prettier --write
pnpm check        # lint + typecheck (script local, pas dans husky direct)
```

## Husky pre-commit

```
npx lint-staged   # eslint --fix + prettier sur staged
pnpm typecheck    # tsc --noEmit complet (bloque si type error)
```
