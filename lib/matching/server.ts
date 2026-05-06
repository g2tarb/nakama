import 'server-only';

import type { ProProfile, SportifProfile } from '@/lib/db/schema';

import { db } from '@/lib/db/client';
import { proProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export type DBMatchScore = {
  proId: string;
  scoreTotal: number;
  logistique: number;
  performance: number;
  psychologie: number;
};

/**
 * Score de matching server-side, basé sur lib/matching.ts mais opérant sur les
 * types DB (ProProfile, SportifProfile).
 *
 * 3 axes :
 *  - Logistique : distance, budget, sport en commun
 *  - Performance : niveau & objectifs cohérents avec ce que le pro enseigne
 *  - Psychologie : 3 sliders vibe (pédagogie/discipline, suivi/autonomie, data/ressenti)
 *
 * Pondération MVP : 30 % logistique, 30 % perf, 40 % psycho.
 */
export function computeMatchScore(
  sportif: SportifProfile,
  pro: ProProfile,
): DBMatchScore {
  // ── Logistique ──
  const sportCommun = sportif.sports?.some((s) => pro.sports?.includes(s)) ? 1 : 0;
  const budgetOk =
    pro.tarifMin !== null &&
    sportif.budgetMax !== null &&
    sportif.budgetMax !== undefined &&
    pro.tarifMin <= sportif.budgetMax
      ? 1
      : 0;
  const distance = haversine(sportif.lat, sportif.lng, pro.lat, pro.lng);
  const distanceOk =
    distance !== null && sportif.rayonKm !== null && distance <= sportif.rayonKm
      ? 1
      : distance !== null
        ? Math.max(0, 1 - distance / 50)
        : 0.5;

  const logistique = (sportCommun * 0.4 + budgetOk * 0.3 + distanceOk * 0.3) * 100;

  // ── Performance ──
  const niveauOk = pro.niveauEnseigne?.includes(sportif.niveau ?? '') ? 1 : 0.5;
  const performance = niveauOk * 100;

  // ── Psychologie ──
  const psy = computeVibeScore(sportif, pro);
  const psychologie = psy * 100;

  const scoreTotal = Math.round(logistique * 0.3 + performance * 0.3 + psychologie * 0.4);

  return {
    proId: pro.id,
    scoreTotal,
    logistique: Math.round(logistique),
    performance: Math.round(performance),
    psychologie: Math.round(psychologie),
  };
}

function computeVibeScore(sportif: SportifProfile, pro: ProProfile): number {
  const axes: Array<[number | null, number | null]> = [
    [sportif.vibePedagogie, pro.vibePedagogie],
    [sportif.vibeSuivi, pro.vibeSuivi],
    [sportif.vibeData, pro.vibeData],
  ];
  const valid = axes.filter(([a, b]) => a !== null && b !== null) as Array<
    [number, number]
  >;
  if (valid.length === 0) return 0.5;
  const diffs = valid.map(([a, b]) => Math.abs(a - b)); // max 9
  const avgDiff = diffs.reduce((s, x) => s + x, 0) / diffs.length;
  return Math.max(0, 1 - avgDiff / 9);
}

function haversine(
  lat1: number | null,
  lng1: number | null,
  lat2: number | null,
  lng2: number | null,
): number | null {
  if (lat1 === null || lng1 === null || lat2 === null || lng2 === null) return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Range tous les pros actifs pour ce sportif. */
export async function rankProsForSportif(
  sportif: SportifProfile,
  limit = 20,
): Promise<DBMatchScore[]> {
  const pros = await db.select().from(proProfiles).where(eq(proProfiles.actif, true));
  const scored = pros.map((p) => computeMatchScore(sportif, p));
  scored.sort((a, b) => b.scoreTotal - a.scoreTotal);
  return scored.slice(0, limit);
}
