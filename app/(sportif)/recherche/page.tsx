import { searchPros } from '@/lib/queries/pros';
import { dbProToUiPro } from '@/lib/queries/adapters';
import { getCurrentUser } from '@/lib/auth/session';
import { getSportifProfile } from '@/lib/queries/sportif';
import { rankProsForSportif } from '@/lib/matching/server';
import { pros as mockPros } from '@/lib/mock-data';
import type { Pro } from '@/types';

import RechercheClient from './_recherche-client';

export const dynamic = 'force-dynamic';

export default async function RecherchePage() {
  // Mode mock si Supabase non configuré (permet à la démo de tourner sans .env)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.DATABASE_URL) {
    return <RechercheClient initialPros={mockPros} scoreMap={{}} />;
  }

  // 1. Charge tous les pros actifs (max 100 pour la recherche)
  let initialPros: Pro[] = [];
  let scoreMap: Record<string, number> = {};

  try {
    const rows = await searchPros({ limit: 100 });
    initialPros = rows.map((r) => dbProToUiPro(r.pro));

    // 2. Si l'utilisateur est un sportif connecté, calcule les scores matching
    const user = await getCurrentUser();
    if (user?.role === 'sportif') {
      const sportif = await getSportifProfile(user.id);
      if (sportif) {
        const matches = await rankProsForSportif(sportif, 100);
        scoreMap = Object.fromEntries(matches.map((m) => [m.proId, m.scoreTotal]));
      }
    }
  } catch (err) {
    console.error('[recherche] DB error, fallback mocks:', err);
    initialPros = mockPros;
  }

  // Fallback : si aucun pro DB, on retombe sur les mocks pour ne pas casser la démo
  if (initialPros.length === 0) {
    initialPros = mockPros;
  }

  return <RechercheClient initialPros={initialPros} scoreMap={scoreMap} />;
}

export const metadata = {
  title: 'Trouve ton Nakama',
};
