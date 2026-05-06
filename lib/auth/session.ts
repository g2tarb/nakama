import 'server-only';

import { eq } from 'drizzle-orm';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { db } from '@/lib/db/client';
import { userRoles } from '@/lib/db/schema';

export type SessionUser = {
  id: string;
  email: string | null;
  role: 'sportif' | 'pro' | null;
};

/**
 * Renvoie l'utilisateur courant + son rôle. `null` si non connecté.
 * Lecture cache-friendly (pas de mémoïsation request-scoped car cookies() change).
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [roleRow] = await db
    .select({ role: userRoles.role })
    .from(userRoles)
    .where(eq(userRoles.userId, user.id))
    .limit(1);

  return {
    id: user.id,
    email: user.email ?? null,
    role: roleRow?.role ?? null,
  };
}

/** Helper qui throw si pas de session — pour les routes protégées. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error('UNAUTHORIZED');
  return user;
}

/** Helper qui throw si pas connecté ou si rôle ne correspond pas. */
export async function requireRole(
  role: 'sportif' | 'pro',
): Promise<SessionUser & { role: typeof role }> {
  const user = await requireUser();
  if (user.role !== role) throw new Error('FORBIDDEN');
  return user as SessionUser & { role: typeof role };
}
