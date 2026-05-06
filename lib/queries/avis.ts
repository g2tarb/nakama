import 'server-only';

import { desc, eq } from 'drizzle-orm';

import { db } from '@/lib/db/client';
import { avis } from '@/lib/db/schema';

export async function listAvisByPro(proId: string, limit = 50) {
  return db
    .select()
    .from(avis)
    .where(eq(avis.proId, proId))
    .orderBy(desc(avis.createdAt))
    .limit(limit);
}

export async function createAvis(input: {
  proId: string;
  sportifId: string;
  seanceId: string;
  note: number;
  commentaire?: string;
}) {
  const [row] = await db
    .insert(avis)
    .values({
      proId: input.proId,
      sportifId: input.sportifId,
      seanceId: input.seanceId,
      note: input.note,
      commentaire: input.commentaire ?? null,
    })
    .returning();
  return row;
}
