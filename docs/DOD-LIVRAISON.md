# Definition of Done — Livraison NAKAMA MVP

Checklist à cocher avant remise officielle à Haykel.

## Code

- [x] `pnpm typecheck` zéro erreur
- [x] `pnpm build` vert (20 routes générées)
- [ ] `pnpm lint` zéro warning bloquant _(à valider)_
- [x] Husky pre-commit branché (lint-staged + typecheck)
- [x] `tsconfig.json` strict + extras (sauf exactOptionalPropertyTypes)
- [x] Stack conforme brief : Next 15 + React 19 + Tailwind v4 + Framer 12 + Zustand 5 + Recharts 3 + Zod + RHF + Lucide + date-fns

## Écrans

- [x] 20 écrans présents (24 routes en réalité)
- [x] Onboarding sportif (6 steps + Zod safeParse final)
- [x] Onboarding pro (6 steps + Zod safeParse final)
- [x] Connexion (RHF + Zod complet)
- [x] Cartes services (Dialog création + RHF + Zod + upgrade quota)
- [x] Paramètres pro (7 sous-menus avec Dialog formule réelle + déconnexion fonctionnelle)
- [x] Agenda (Semaine + Mois + FAB Bloquer plage)
- [x] Messaging (input câblé, message s'ajoute au state)
- [x] Réservation (3 steps + paiement simulé Stripe stylé)
- [x] Dashboard pro (count-up 1000ms, sparkline 1200ms, jauge 800ms)
- [x] Fiche athlète unifiée (4 onglets + slide horizontal Framer)

## Données démo

- [x] 50 pros (split par spécialité : `lib/mock-data/pros/`)
- [x] 20 sportifs
- [x] 34 séances
- [x] 15 conversations avec 2-5 messages
- [x] Notes santé / progression / coach indexées par sportif
- [x] Toutes dates 2026 (3 références hors-2026 contextuelles : marathon 2027, entorse 2023, client depuis 2025-11)
- [ ] Photos Unsplash migrées en local _/public/images/pros/_ _(post-MVP)_

## Tests parcours

À tester manuellement en preview Vercel sur 5 viewports (375 / 393 / 768 / 1512 / 1920) :

- [ ] Flow Sportif : / → /inscription/sportif (6 steps) → /accueil → ProCard → /pros/[id] → /reservation/[proId] → confirmation
- [ ] Flow Pro : / → /inscription/pro (6 steps) → /dashboard → /clients → /clients/[id] → 4 onglets
- [ ] Flow Public : / → CTA dual → /connexion (mock auth) → espace correspondant
- [ ] ModeSwitcher (bottom-right) fonctionnel sur tous les écrans
- [ ] Création carte service : Dialog → submit → carte ajoutée au state
- [ ] Cartes services : toggle actif/inactif, delete, upgrade Dialog si quota atteint
- [ ] Paramètres pro : ouvrir Dialog formule, choisir, confirmer
- [ ] Agenda : toggle Semaine/Mois, navigation prev/next, FAB Bloquer plage → ajout
- [ ] Messaging : envoyer un message, vérifier ajout dans la liste
- [ ] Déconnexion pro : Dialog confirmation → retour landing

## SEO / A11y / Perf

- [x] Metadata complète layout root (title template, OG, Twitter, robots, viewport)
- [x] JSON-LD inline (Organization + SoftwareApplication)
- [x] `app/robots.ts` (allow / + disallow espaces privés)
- [x] `app/sitemap.ts` (4 routes publiques)
- [x] `noindex` sur layouts (sportif) et (pro)
- [ ] Lighthouse desktop ≥90 sur landing _(à mesurer après deploy)_
- [ ] Lighthouse mobile ≥85 sur landing _(à mesurer)_
- [ ] Contraste WCAG AA validé _(audit visuel à faire)_
- [ ] `focus-visible` ring or sur tous les éléments interactifs _(audit à faire)_
- [ ] Tests responsive 5 devices _(à faire en preview)_

## Déploiement

- [ ] URL Vercel preview partagée à Haykel
- [ ] URL Vercel prod active
- [ ] `NEXT_PUBLIC_DEMO_MODE=true` configuré
- [ ] `NEXT_PUBLIC_APP_URL` configuré (URL prod)
- [ ] Domaine `nakama.tech` (ou autre) pointé _(action Haykel)_

## Passation

- [x] README.md complet (quick start, stack + justifs, arbo, mocks, matching, déploiement, roadmap)
- [x] AGENTS.md à jour (workarounds Next 15, conventions)
- [x] `.env.local.example` documenté
- [x] DoD-LIVRAISON.md (ce fichier)
- [ ] Repo GitHub avec ownership transféré à Haykel _(action Erwin)_
- [ ] README testé par dev tiers (10 min pour lancer) _(action Haykel)_

## Validation business

- [ ] Feedback positif d'au moins 3 pros du sport sur la fiche pro / parcours sportif _(action Haykel — organiser interviews terrain)_
- [ ] Demo investisseur réalisée _(action Haykel)_

## Bloqueurs externes (assets Haykel)

Voir `CHASE-ASSETS.md`.

- [ ] Logo Nakama SVG (full + symbole)
- [ ] Favicon `.ico` ou `.png` 512px (et apple-touch-icon)
- [ ] OG image `og.png` 1200×630
- [ ] Codes hex exacts charte (remplacer `#0B0F14`, `#C9B27A` approximatifs)
- [ ] Choix font final : Inter (installé) vs Manrope
- [ ] Textes définitifs landing + onboarding + microcopy
- [ ] Domaine final
