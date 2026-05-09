import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth/session';
import { SportifLayoutShell } from './_layout-shell';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function SportifLayout({ children }: { children: React.ReactNode }) {
  // Si Supabase non configuré (env vars manquantes en dev), on bypass le guard
  // pour que la démo mock continue de tourner sans .env.local.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return <SportifLayoutShell>{children}</SportifLayoutShell>;
  }

  const user = await getCurrentUser();
  if (!user) redirect('/connexion');
  if (user.role && user.role !== 'sportif') redirect('/dashboard');

  return <SportifLayoutShell>{children}</SportifLayoutShell>;
}
