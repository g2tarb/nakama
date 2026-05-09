import { searchPros } from '@/lib/queries/pros';
import { dbProToUiPro } from '@/lib/queries/adapters';
import { getCurrentUser } from '@/lib/auth/session';
import { getSportifProfile } from '@/lib/queries/sportif';
import { rankProsForSportif } from '@/lib/matching/server';
import { geocodeToCoords } from '@/lib/mapbox/geocode';
import { pros as mockPros } from '@/lib/mock-data';
import type { Pro } from '@/types';

import RechercheClient from './_recherche-client';

export const dynamic = 'force-dynamic';

type Search = { sport?: string; ville?: string; date?: string };

export default async function RecherchePage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const ville = typeof sp.ville === 'string' ? sp.ville.trim() : '';

  // Mode mock si Supabase non configuré (permet à la démo de tourner sans .env)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.DATABASE_URL) {
    return <RechercheClient initialPros={mockPros} scoreMap={{}} initialVille={ville} />;
  }

  let initialPros: Pro[] = [];
  let scoreMap: Record<string, number> = {};

  try {
    // 1. Détermine le centre géographique : (a) ville URL > (b) profil sportif
    let center: { lat: number; lng: number } | null = null;
    let rayonKm = 50;

    const user = await getCurrentUser();
    const sportif = user?.role === 'sportif' ? await getSportifProfile(user.id) : null;

    if (ville) {
      center = await geocodeToCoords(null, ville);
    }
    if (!center && sportif?.lat != null && sportif?.lng != null) {
      center = { lat: sportif.lat, lng: sportif.lng };
      rayonKm = sportif.rayonKm ?? 10;
    }

    // 2. Recherche pros, triée par distance si on a un centre
    const rows = await searchPros({
      limit: 100,
      ...(center
        ? { centerLat: center.lat, centerLng: center.lng, rayonKm: rayonKm + 50 }
        : {}),
    });
    initialPros = rows.map((r) => dbProToUiPro(r.pro));

    // 3. Si l'utilisateur est un sportif connecté, calcule les scores matching
    if (sportif) {
      const matches = await rankProsForSportif(sportif, 100);
      scoreMap = Object.fromEntries(matches.map((m) => [m.proId, m.scoreTotal]));
    }
  } catch (err) {
    console.error('[recherche] DB error, fallback mocks:', err);
    initialPros = mockPros;
  }

  // Fallback : si aucun pro DB, on retombe sur les mocks pour ne pas casser la démo
  if (initialPros.length === 0) {
    initialPros = mockPros;
  }

  return (
    <RechercheClient initialPros={initialPros} scoreMap={scoreMap} initialVille={ville} />
  );
}

export const metadata = {
  title: 'Trouve ton Nakama',
};
