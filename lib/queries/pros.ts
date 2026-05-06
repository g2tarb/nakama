import 'server-only';

import { and, desc, eq, ilike, lte, sql } from 'drizzle-orm';

import { db } from '@/lib/db/client';
import { cartesServices, proProfiles } from '@/lib/db/schema';
import type { ProProfile, CarteService } from '@/lib/db/schema';

export type ProSearchFilters = {
  sport?: string;
  ville?: string;
  budgetMax?: number;
  /** point central pour distance — en degrés WGS84 */
  centerLat?: number;
  centerLng?: number;
  /** rayon en km depuis le centre */
  rayonKm?: number;
  limit?: number;
  offset?: number;
};

/**
 * Recherche de pros avec filtres optionnels et tri par distance si centre fourni.
 * Utilise la formule de Haversine en SQL pour la distance.
 */
export async function searchPros(filters: ProSearchFilters = {}) {
  const {
    sport,
    ville,
    budgetMax,
    centerLat,
    centerLng,
    rayonKm,
    limit = 20,
    offset = 0,
  } = filters;

  const conditions = [eq(proProfiles.actif, true)];

  if (sport) {
    conditions.push(sql`${sport} = ANY(${proProfiles.sports})`);
  }
  if (ville) {
    conditions.push(ilike(proProfiles.ville, `%${ville}%`));
  }
  if (budgetMax !== undefined) {
    conditions.push(lte(proProfiles.tarifMin, budgetMax));
  }

  const distanceExpr =
    centerLat !== undefined && centerLng !== undefined
      ? sql<number>`(
          6371 * acos(
            cos(radians(${centerLat})) *
            cos(radians(${proProfiles.lat})) *
            cos(radians(${proProfiles.lng}) - radians(${centerLng})) +
            sin(radians(${centerLat})) *
            sin(radians(${proProfiles.lat}))
          )
        )`
      : sql<number>`NULL`;

  if (rayonKm && centerLat !== undefined) {
    conditions.push(sql`${distanceExpr} <= ${rayonKm}`);
  }

  const rows = await db
    .select({
      pro: proProfiles,
      distanceKm: distanceExpr,
    })
    .from(proProfiles)
    .where(and(...conditions))
    .orderBy(centerLat !== undefined ? sql`${distanceExpr} ASC` : desc(proProfiles.note))
    .limit(limit)
    .offset(offset);

  return rows;
}

export async function getProById(id: string) {
  const [pro] = await db
    .select()
    .from(proProfiles)
    .where(eq(proProfiles.id, id))
    .limit(1);
  return pro ?? null;
}

export async function getProWithCartes(id: string): Promise<{
  pro: ProProfile | null;
  cartes: CarteService[];
}> {
  const pro = await getProById(id);
  if (!pro) return { pro: null, cartes: [] };
  const cartes = await db
    .select()
    .from(cartesServices)
    .where(and(eq(cartesServices.proId, id), eq(cartesServices.actif, true)));
  return { pro, cartes };
}

export async function listFeaturedPros(limit = 12) {
  return db
    .select()
    .from(proProfiles)
    .where(eq(proProfiles.actif, true))
    .orderBy(desc(proProfiles.note), desc(proProfiles.nbAvis))
    .limit(limit);
}

export async function updateProProfile(
  id: string,
  patch: Partial<typeof proProfiles.$inferInsert>,
) {
  const [updated] = await db
    .update(proProfiles)
    .set(patch)
    .where(eq(proProfiles.id, id))
    .returning();
  return updated;
}
