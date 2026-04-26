'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Home, MessageCircle, User } from 'lucide-react';

import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/accueil', label: 'Accueil', icon: Home },
  { href: '/rdv', label: 'RDV', icon: Calendar },
  { href: '/messages', label: 'Messages', icon: MessageCircle },
  { href: '/profil', label: 'Profil', icon: User },
] as const;

export function SportifLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-border bg-background/80 sticky top-0 z-40 flex h-14 items-center justify-center border-b backdrop-blur-sm">
        <Link href="/accueil" className="text-accent-gold text-lg font-bold">
          NAKAMA
        </Link>
      </header>

      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      <nav className="border-border bg-background/95 fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t backdrop-blur-sm md:hidden">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || (pathname?.startsWith(`${href}/`) ?? false);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors',
                isActive ? 'text-accent-gold' : 'text-text-tertiary',
              )}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
