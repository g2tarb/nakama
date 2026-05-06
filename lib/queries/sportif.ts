import 'server-only';

import { eq } from 'drizzle-orm';

import { db } from '@/lib/db/client';
import { sportifProfiles } from '@/lib/db/schema';

export async function getSportifProfile(id: string) {
  const [row] = await db
    .select()
    .from(sportifProfiles)
    .where(eq(sportifProfiles.id, id))
    .limit(1);
  return row ?? null;
}

export async function upsertSportifProfile(data: typeof sportifProfiles.$inferInsert) {
  const [row] = await db
    .insert(sportifProfiles)
    .values(data)
    .onConflictDoUpdate({
      target: sportifProfiles.id,
      set: { ...data },
    })
    .returning();
  return row;
}

export async function updateSportifProfile(
  id: string,
  patch: Partial<typeof sportifProfiles.$inferInsert>,
) {
  const [row] = await db
    .update(sportifProfiles)
    .set(patch)
    .where(eq(sportifProfiles.id, id))
    .returning();
  return row;
}
