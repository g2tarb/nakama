import 'server-only';

import { and, asc, eq } from 'drizzle-orm';

import { db } from '@/lib/db/client';
import { cartesServices } from '@/lib/db/schema';

export async function listCartesByPro(proId: string, onlyActive = false) {
  const where = onlyActive
    ? and(eq(cartesServices.proId, proId), eq(cartesServices.actif, true))
    : eq(cartesServices.proId, proId);
  return db
    .select()
    .from(cartesServices)
    .where(where)
    .orderBy(asc(cartesServices.createdAt));
}

export async function getCarteById(id: string) {
  const [row] = await db
    .select()
    .from(cartesServices)
    .where(eq(cartesServices.id, id))
    .limit(1);
  return row ?? null;
}

export async function createCarte(data: typeof cartesServices.$inferInsert) {
  const [row] = await db.insert(cartesServices).values(data).returning();
  return row;
}

export async function updateCarte(
  id: string,
  patch: Partial<typeof cartesServices.$inferInsert>,
) {
  const [row] = await db
    .update(cartesServices)
    .set(patch)
    .where(eq(cartesServices.id, id))
    .returning();
  return row;
}

export async function deleteCarte(id: string) {
  await db.delete(cartesServices).where(eq(cartesServices.id, id));
}
