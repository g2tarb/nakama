'use server';

import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { db } from '@/lib/db/client';
import { userRoles } from '@/lib/db/schema';
import { clientConfig } from '@/lib/env';

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Minimum 6 caractères'),
  role: z.enum(['sportif', 'pro']),
  prenom: z.string().optional().default(''),
  nom: z.string().optional().default(''),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type ActionResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

export async function signUpAction(
  input: z.infer<typeof signUpSchema>,
): Promise<ActionResult<{ userId: string; needsEmailVerification: boolean }>> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Données invalides' };
  }
  const { email, password, role, prenom, nom } = parsed.data;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${clientConfig().NEXT_PUBLIC_APP_URL}/auth/callback`,
      data: { role, prenom, nom },
    },
  });

  if (error) return { ok: false, error: error.message };
  const userId = data.user?.id;
  if (!userId) return { ok: false, error: 'Utilisateur non créé' };

  // Persiste le rôle (table user_roles). On utilise Drizzle + admin pour bypass RLS.
  await db
    .insert(userRoles)
    .values({ userId, role })
    .onConflictDoUpdate({ target: userRoles.userId, set: { role } });

  return {
    ok: true,
    data: { userId, needsEmailVerification: !data.session },
  };
}

export async function signInAction(
  input: z.infer<typeof signInSchema>,
): Promise<ActionResult<{ role: 'sportif' | 'pro' | null }>> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: 'Identifiants invalides' };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { ok: false, error: error.message };
  if (!data.user) return { ok: false, error: 'Connexion échouée' };

  const [roleRow] = await db
    .select({ role: userRoles.role })
    .from(userRoles)
    .where(eq(userRoles.userId, data.user.id))
    .limit(1);

  return { ok: true, data: { role: roleRow?.role ?? null } };
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/');
}

export async function signInWithGoogleAction() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${clientConfig().NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });
  if (error) return { ok: false as const, error: error.message };
  redirect(data.url);
}

const resetSchema = z.object({ email: z.string().email() });

export async function requestPasswordResetAction(
  input: z.infer<typeof resetSchema>,
): Promise<ActionResult> {
  const parsed = resetSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Email invalide' };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${clientConfig().NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
