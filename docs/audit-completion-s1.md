# Audit de complétion Sprint 1

**Date** : 2026-05-19
**Branche** : `feat/s2-j1-bugs-audit`
**Référence brief** : `BRIEF-DEV (1).md` — chantier C7

## Méthodologie

Pour chaque écran prévu au brief Sprint 1, statut attribué selon les critères suivants :

- **Complet** : écran fonctionnel, contenu réaliste via mock data, états visuels présents. La logique métier branchée n'est pas un critère (MVP démo).
- **Partiel** : squelette ou contenu placeholder explicite, sections manquantes vs spec.
- **Non livré** : route absente ou page vide.

## Résultats

### Public

| Écran            | Route               | Statut  | Manquements                                                                           |
| ---------------- | ------------------- | ------- | ------------------------------------------------------------------------------------- |
| Landing          | `/`                 | Complet | —                                                                                     |
| CGU              | `/cgu`              | Partiel | Banner "Document à finaliser", contenu placeholder en attente de validation juridique |
| Confidentialité  | `/confidentialite`  | Partiel | Banner "Document à finaliser RGPD", placeholder pour DPO/avocat                       |
| Mentions légales | `/mentions-legales` | Partiel | Champs "à compléter" (SIRET, capital, adresse) visibles dans la page                  |

### Auth

| Écran               | Route                  | Statut  | Manquements                                                             |
| ------------------- | ---------------------- | ------- | ----------------------------------------------------------------------- |
| Connexion           | `/connexion`           | Complet | —                                                                       |
| Inscription sportif | `/inscription/sportif` | Complet | 6 étapes (identité, objectifs, sports, niveau, localisation, vibe)      |
| Inscription pro     | `/inscription/pro`     | Complet | 6 étapes (infos perso, expertise, première carte, zones, formule, vibe) |

### Sportif

| Écran             | Route                       | Statut  | Manquements                                       |
| ----------------- | --------------------------- | ------- | ------------------------------------------------- |
| Accueil           | `/accueil`                  | Complet | —                                                 |
| Recherche         | `/recherche`                | Complet | Matching scoring + filtres URL sport/ville        |
| Fiche pro         | `/pros/[id]`                | Complet | —                                                 |
| Réservation       | `/reservation/[proId]`      | Complet | 3 étapes (service > date/heure > paiement simulé) |
| Confirmation      | `/reservation/confirmation` | Complet | —                                                 |
| Mes RDV           | `/rdv`                      | Complet | Dual-view liste/calendrier                        |
| Messagerie liste  | `/messages`                 | Complet | —                                                 |
| Messagerie détail | `/messages/[id]`            | Complet | —                                                 |
| Profil            | `/profil`                   | Complet | —                                                 |
| Réglages          | `/reglages`                 | Complet | —                                                 |

### Pro

| Écran              | Route              | Statut        | Manquements                                                                                                                        |
| ------------------ | ------------------ | ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Dashboard          | `/dashboard`       | Complet       | 4 KPIs + séances du jour + nouvelles demandes + sparkline                                                                          |
| Cartes services    | `/cartes-services` | Complet       | —                                                                                                                                  |
| Agenda             | `/agenda`          | Complet       | 3 vues jour/semaine/mois + blocage plages                                                                                          |
| Clients            | `/clients`         | Complet       | —                                                                                                                                  |
| Fiche athlète      | `/clients/[id]`    | Complet       | 4 onglets (santé, progression, notes, historique)                                                                                  |
| Revenus            | `/revenus`         | Complet       | —                                                                                                                                  |
| Paramètres         | `/parametres`      | Complet       | 5 items "Coming Soon" visibles dans le menu — fonctionnel mais à compléter post-MVP                                                |
| **Messagerie pro** | `/(pro)/messages`  | **Non livré** | Route absente. Le brief mentionne la messagerie côté pro mais elle n'existe pas dans `app/(pro)/`. Côté sportif elle est complète. |

### Écrans bonus livrés (hors brief S1)

Le scan a relevé 6 écrans sportif livrés qui n'étaient pas dans la liste brief Sprint 1, tous complets :

- `/suivi` — progression sportif (KPIs, graphiques poids/charge, ressentis)
- `/historique` — séances passées avec CTA avis
- `/favoris` — grid pros favoris
- `/paiements` — carte + factures
- `/notifications` — feed notifs avec marquage lu
- `/aide` — FAQ accordion + contacts

## Synthèse

| Statut          | Nombre                                           |
| --------------- | ------------------------------------------------ |
| Complet         | 24                                               |
| Partiel         | 3 (toutes pages légales, placeholder volontaire) |
| Non livré       | 1 (messagerie pro)                               |
| **Total brief** | **28**                                           |
| Bonus           | +6 écrans complets hors périmètre brief          |

## Points d'attention pour Sprint 2

1. **Messagerie pro manquante** — pas dans les chantiers Sprint 2 du brief. À clarifier avec Erwin : faut-il livrer une route `/(pro)/messages` symétrique au sportif, ou les pros reçoivent-ils les messages via un autre canal ?
2. **Pages légales** — non bloquantes pour la démo, contenu placeholder assumé. À finaliser hors scope dev (juridique).
3. **Coming Soon dans `/parametres` pro** — 5 items affichent un état "Coming Soon" volontaire. Acceptable MVP mais à tracer si le scope post-MVP les requiert.
