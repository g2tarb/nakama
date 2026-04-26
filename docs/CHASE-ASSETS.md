# Chase assets — message à envoyer à Haykel

Modèle de message à adapter et envoyer (Slack / WhatsApp / mail) avant la démo investisseur.

---

**Sujet :** NAKAMA MVP — assets manquants pour finaliser

Salut Haykel,

Le MVP est buildable et déployable sur Vercel. Pour finaliser la passation et avoir une démo investisseur impeccable, j'ai besoin des éléments suivants. Tout ce qui manque est remplacé par des placeholders aujourd'hui.

## Assets graphiques

1. **Logo Nakama** — au format SVG
   - Version "full" (mot complet "NAKAMA")
   - Version "symbole" (icône seule pour favicons + PWA)
   - Couleur principale + version monochrome blanc

2. **Favicon** — `.ico` ou `.png` 512×512
   - Plus `apple-touch-icon.png` 180×180

3. **OG image** — `og.png` 1200×630
   - Pour partage social (Twitter, LinkedIn, WhatsApp)
   - Avec logo + slogan + visuel produit

4. **Photos pros locales** _(nice-to-have post-MVP)_
   - Si tu as accès à des photos pro libres de droits, on les met dans `/public/images/pros/`
   - Sinon on garde Unsplash en CDN distant

## Charte graphique

5. **Codes hex exacts** — actuellement les valeurs sont approximatives :
   - `#0B0F14` (background dark)
   - `#C9B27A` (accent gold)
   - `#1E2A3A` (surface)

   Confirme ou donne les valeurs définitives + un éventuel guide pour les success/warning/danger/text-secondary/text-tertiary.

6. **Font finale** — Inter est installée par défaut (très lisible, équivalent Linear/Vercel).
   - Tu confirmais une hésitation Inter / Manrope dans le brief
   - Décide stp pour qu'on puisse swapper avant la démo

## Textes définitifs

7. **Landing** — actuellement les textes Hero / FeaturesSportif / FeaturesPro / HowItWorks sont mes propositions
   - Relis et envoie les versions finales (titres, descriptions, CTA)

8. **Onboarding** — labels des steps, microcopy d'aide, messages d'erreur Zod
   - Idem, propositions à valider

9. **CGU + Mentions légales + Politique confidentialité** — actuellement liens vides en footer

## Infrastructure

10. **Domaine final** — tu mentionnais `nakama.tech` ?
    - Confirme + transmets accès registrar pour DNS Vercel

11. **Repo GitHub** — je peux transférer l'ownership maintenant
    - Tu me donnes ton handle GitHub et l'org cible

## Ce qui demande ton action terrain

12. **Feedback de 3 pros du sport** — pour le DoD final brief
    - Organise 3 interviews terrain (15 min chacune) avec coachs réels
    - Je te prépare un script de questions si besoin

---

Tant que tout n'est pas reçu, je laisse les placeholders en place. Le code est isolé pour qu'un swap soit instantané (un seul fichier à modifier par asset).

Dispo pour un call si tu veux balayer ça en 20 min.
