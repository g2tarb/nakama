# Guide de raccordement — Nakama backend → UI

> Tout le backend MVP est livré sous forme de modules autonomes dans `lib/`, `app/api/`, `supabase/migrations/`, `scripts/`. Ce guide explique comment brancher chaque module aux pages existantes.

---

## 0. Bootstrap (à faire une fois)

### 0.1 Compte Supabase

1. https://supabase.com/dashboard → **New project** (région Paris)
2. Settings > API → copie `Project URL`, `anon public key`, `service_role key`
3. Settings > Database > Connection string → copie `URI` (mode Pooler port 6543) et `URI` (mode Direct port 5432)

### 0.2 Compte Mapbox, Cloudflare R2, Resend

- **Mapbox** : https://account.mapbox.com → créer un token (scope `geocoding`)
- **R2** : Cloudflare Dashboard → R2 → créer bucket `nakama-photos` → activer Public Access (custom domain ou r2.dev)
- **Resend** : https://resend.com → API key + domaine vérifié (ou utiliser `onboarding@resend.dev` en dev)

### 0.3 `.env.local`

```bash
cp .env.example .env.local
# remplis les 14 clés
```

### 0.4 Migrations

Dans **Supabase Dashboard > SQL Editor > New query** :

1. Colle `supabase/migrations/0001_initial.sql` → Run
2. Colle `supabase/migrations/0002_rls.sql` → Run

### 0.5 Seed

```bash
pnpm tsx scripts/seed.ts
```

→ insère les 50 pros, 12 sportifs, 24 séances mock + crée leurs comptes Supabase Auth (mots de passe : `demo-password-2026`).

### 0.6 Vérif

```bash
pnpm dev
# Ouvre http://localhost:3000 — l'UI tourne sur les mocks comme avant.
# Les modules backend sont là, mais aucune page ne les appelle encore.
```

---

## 1. Auth → branchement sur `/connexion` et `/inscription/{role}`

### Module : `lib/auth/actions.ts`

- `signUpAction({ email, password, role, prenom, nom })` → crée user + ligne `user_roles`. Renvoie `{ ok, data: { userId, needsEmailVerification } }`.
- `signInAction({ email, password })` → renvoie le rôle (pour rediriger vers `/accueil` ou `/dashboard`).
- `signOutAction()` → redirect /
- `signInWithGoogleAction()` → redirect Google OAuth
- `requestPasswordResetAction({ email })`

### Branchement dans `app/(auth)/connexion/page.tsx`

```tsx
import { signInAction } from '@/lib/auth/actions';

const onSubmit = async (data) => {
  const r = await signInAction(data);
  if (!r.ok) {
    setError(r.error);
    return;
  }
  router.push(r.data.role === 'pro' ? '/dashboard' : '/accueil');
};
```

### Remplace `useUserStore` par `getCurrentUser()`

Dans les `layout.tsx` server components des espaces sportif/pro :

```tsx
import { getCurrentUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export default async function SportifLayout({ children }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'sportif') redirect('/connexion');
  return <SportifLayoutShell user={user}>{children}</SportifLayoutShell>;
}
```

> Tu peux **garder Zustand** pour l'UI state (drawer, mode actif), mais **remplace `user-store` par la session Supabase** (source de vérité = serveur).

---

## 2. Profil sportif (onboarding 3 sliders)

### Module : `lib/queries/sportif.ts` + `lib/mapbox/geocode.ts`

- `upsertSportifProfile(data)` insert/update
- `geocodeToCoords(codePostal, ville)` retourne `{ lat, lng }`

### Branchement dans `app/(auth)/inscription/sportif/page.tsx`

```tsx
'use server';
import { geocodeToCoords } from '@/lib/mapbox/geocode';
import { upsertSportifProfile } from '@/lib/queries/sportif';
import { requireRole } from '@/lib/auth/session';

export async function saveSportifProfile(input: FormData) {
  const user = await requireRole('sportif');
  const coords = await geocodeToCoords(input.get('codePostal'), input.get('ville'));
  await upsertSportifProfile({
    id: user.id,
    prenom: input.get('prenom'),
    // …
    lat: coords?.lat ?? null,
    lng: coords?.lng ?? null,
    vibePedagogie: Number(input.get('vibePedagogie')),
    vibeSuivi: Number(input.get('vibeSuivi')),
    vibeData: Number(input.get('vibeData')),
  });
}
```

---

## 3. Recherche pros + matching

### Module : `lib/queries/pros.ts` + `lib/matching/server.ts`

- `searchPros({ sport, ville, budgetMax, centerLat, centerLng, rayonKm })`
- `rankProsForSportif(sportif, limit)` retourne top N matches (algo psy 3 axes)

### Branchement dans `app/(sportif)/recherche/page.tsx`

```tsx
import { searchPros } from '@/lib/queries/pros';
import { getSportifProfile } from '@/lib/queries/sportif';

export default async function RecherchePage({ searchParams }) {
  const user = await requireRole('sportif');
  const me = await getSportifProfile(user.id);
  const results = await searchPros({
    sport: searchParams.sport,
    centerLat: me?.lat,
    centerLng: me?.lng,
    rayonKm: me?.rayonKm,
  });
  // rends results.map(r => <ProCard pro={r.pro} distance={r.distanceKm} />)
}
```

### `useMatchedPros` hook → remplace par `rankProsForSportif`

Dans `app/(sportif)/accueil/page.tsx`, remplace l'import par :

```tsx
import { rankProsForSportif } from '@/lib/matching/server';
import { getSportifProfile } from '@/lib/queries/sportif';
import { getProById } from '@/lib/queries/pros';

const me = await getSportifProfile(user.id);
const matches = await rankProsForSportif(me, 5);
const pros = await Promise.all(matches.map((m) => getProById(m.proId)));
```

---

## 4. Profil pro éditable + cartes services

### Modules : `lib/queries/pros.ts` (`updateProProfile`) + `lib/queries/cartes.ts` (CRUD)

### Branchement

- Page nouvelle `app/(pro)/profil/page.tsx` (à créer) avec form react-hook-form → server action `updateProProfile`
- `app/(pro)/cartes-services/page.tsx` → `listCartesByPro(user.id)` + actions `createCarte` / `updateCarte` / `deleteCarte`

---

## 5. Réservation séance

### Modules : `lib/queries/seances.ts` (`bookSeance`, `acceptSeance`, `cancelSeance`)

### Branchement dans `app/(sportif)/reservation/[proId]/page.tsx`

```tsx
'use server';
import { bookSeance } from '@/lib/queries/seances';
import { sendBookingConfirmed } from '@/lib/email/send';

export async function reserver(formData: FormData) {
  const user = await requireRole('sportif');
  const r = await bookSeance({
    proId: formData.get('proId'),
    sportifId: user.id,
    carteServiceId: formData.get('carteId'),
    dateDebut: new Date(formData.get('date')),
  });
  if (!r.ok) return { error: r.error };
  // notif pro côté email — voir bloc 7
  redirect('/reservation/confirmation');
}
```

### Pro accept/refuse — `app/(pro)/agenda/page.tsx`

```tsx
import { acceptSeance, cancelSeance } from '@/lib/queries/seances';
// onClick(accept) → server action acceptSeance(seance.id) puis sendBookingConfirmed(...)
```

---

## 6. Messagerie temps réel

### Modules : `lib/queries/conversations.ts` + Supabase Realtime

### Branchement dans `app/(sportif)/messages/[id]/page.tsx`

```tsx
'use client';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

useEffect(() => {
  const supabase = createSupabaseBrowserClient();
  const channel = supabase
    .channel(`conv-${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => setMessages((prev) => [...prev, payload.new]),
    )
    .subscribe();
  return () => {
    channel.unsubscribe();
  };
}, [conversationId]);
```

### Envoyer un message — server action `sendMessage`

```tsx
import { sendMessage } from '@/lib/queries/conversations';
// onSubmit → sendMessage({ conversationId, authorId: user.id, contenu })
```

---

## 7. Emails (6 types)

### Module : `lib/email/send.ts`

- `sendVerifyEmail` (Supabase l'envoie déjà via SMTP — branche Resend dans Settings > Auth > SMTP si tu veux uniformiser)
- `sendBookingConfirmed` (à appeler après `acceptSeance`)
- `sendBookingCancelled` (après `cancelSeance`)
- `sendBookingReminder` (cron — déjà branché)
- `sendReviewRequest` (à appeler quand `statut = terminee` — via cron ou trigger)
- `sendResetPassword` (Supabase auto)

### Exemple — confirmation acceptation

```tsx
'use server';
import { acceptSeance } from '@/lib/queries/seances';
import { sendBookingConfirmed } from '@/lib/email/send';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export async function acceptSeanceAction(seanceId: string) {
  const seance = await acceptSeance(seanceId);
  if (!seance) return;
  const admin = createSupabaseAdminClient();
  const sportif = await admin.auth.admin.getUserById(seance.sportifId);
  // sendBookingConfirmed(sportif.user.email, { … })
}
```

---

## 8. Upload photo pro (R2)

### Module : `app/api/upload/sign/route.ts` (presigned URL)

### Branchement côté client (page profil pro)

```tsx
async function uploadPhoto(file: File) {
  const sign = await fetch('/api/upload/sign', {
    method: 'POST',
    body: JSON.stringify({
      contentType: file.type,
      contentLength: file.size,
      kind: 'pro',
    }),
  }).then((r) => r.json());
  if (!sign.ok) throw new Error(sign.error);

  await fetch(sign.data.uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });

  // Persist publicUrl dans pro_profiles.photo_url via server action
  await updateProProfile(user.id, { photoUrl: sign.data.publicUrl });
}
```

---

## 9. Avis post-séance

### Module : `lib/queries/avis.ts` (`createAvis`)

### Branchement

Page nouvelle `app/(sportif)/avis/[seanceId]/page.tsx` avec form note + commentaire → server action `createAvis`. La trigger Postgres recalcule `pro_profiles.note` et `nb_avis` automatiquement.

---

## 10. Cron rappel J-1

### Déjà branché (`app/api/cron/reminder-jminus1/route.ts` + `vercel.json`)

Sur **Vercel** : Settings > Environment Variables → ajouter `CRON_SECRET` (chaîne aléatoire, ex. `openssl rand -hex 32`).

---

## Schéma de raccordement (vue d'ensemble)

```
                  ┌─────────────┐
                  │   Browser   │
                  └──────┬──────┘
       ┌────────────────┼─────────────────┐
       │                │                 │
   server action    /api/upload/sign   Supabase Realtime
       │                │                 │
       ▼                ▼                 ▼
  Drizzle + db   R2 presigned URL    postgres_changes
       │                │                 │
       ▼                ▼                 │
   Postgres ◄─── RLS policies ────────────┘
       │
       └──► trigger recalc note + nb_avis
```

---

## Checklist de déploiement Vercel

- [ ] `vercel link` puis `vercel env pull .env.local`
- [ ] Toutes les variables `.env.example` remplies dans Vercel
- [ ] Migrations 0001 + 0002 exécutées sur Supabase prod
- [ ] Bucket R2 créé + Public Access activé
- [ ] Domaine Resend vérifié (sinon emails bloqués)
- [ ] Domaine Vercel ajouté dans Supabase > Auth > Site URL + Redirect URLs

---

## Conventions importantes

- **Server-only** : tout ce qui touche `db`, `serverConfig()`, R2, Resend → import `'server-only'` en tête
- **Client side** : utilise `createSupabaseBrowserClient()` pour Realtime et `clientConfig` pour les vars publiques
- **RLS** : ne contourne **jamais** RLS depuis `lib/queries/*` (qui utilisent l'auth user). N'utilise `createSupabaseAdminClient()` que dans `scripts/`, `app/api/cron/`, et seed
