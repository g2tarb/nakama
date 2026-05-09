import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth/session';
import { ProLayoutShell } from './_layout-shell';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ProLayout({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return <ProLayoutShell>{children}</ProLayoutShell>;
  }

  const user = await getCurrentUser();
  if (!user) redirect('/connexion');
  if (user.role && user.role !== 'pro') redirect('/accueil');

  return <ProLayoutShell>{children}</ProLayoutShell>;
}
