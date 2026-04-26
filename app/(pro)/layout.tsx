'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  CreditCard,
  Home,
  LayoutDashboard,
  Settings,
  TrendingUp,
  Users,
} from 'lucide-react';

import { cn } from '@/lib/utils';

const SIDEBAR_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/cartes-services', label: 'Cartes de service', icon: CreditCard },
  { href: '/agenda', label: 'Agenda', icon: Calendar },
  { href: '/clients', label: 'Mes clients', icon: Users },
  { href: '/revenus', label: 'Revenus', icon: TrendingUp },
  { href: '/parametres', label: 'Paramètres', icon: Settings },
] as const;

const MOBILE_NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/agenda', label: 'Agenda', icon: Calendar },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/revenus', label: 'Revenus', icon: TrendingUp },
] as const;

export default function ProLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar desktop */}
      <aside className="border-border bg-sidebar fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r lg:flex">
        {/* Logo */}
        <div className="flex h-16 items-center px-6">
          <Link href="/dashboard" className="text-accent-gold text-xl font-bold">
            NAKAMA
          </Link>
          <span className="bg-accent-gold/10 text-accent-gold ml-2 rounded-full px-2 py-0.5 text-xs font-medium">
            Pro
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {SIDEBAR_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href || (pathname?.startsWith(`${href}/`) ?? false);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-accent-gold'
                    : 'text-text-secondary hover:bg-sidebar-accent hover:text-text-primary',
                )}
              >
                <Icon size={20} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Contenu principal */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Header mobile */}
        <header className="border-border bg-background/80 sticky top-0 z-40 flex h-14 items-center justify-between border-b px-4 backdrop-blur-sm lg:hidden">
          <Link href="/dashboard" className="text-accent-gold text-lg font-bold">
            NAKAMA
          </Link>
          <span className="bg-accent-gold/10 text-accent-gold rounded-full px-2 py-0.5 text-xs font-medium">
            Pro
          </span>
        </header>

        <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      </div>

      {/* Bottom nav mobile */}
      <nav className="border-border bg-background/95 fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t backdrop-blur-sm lg:hidden">
        {MOBILE_NAV.map(({ href, label, icon: Icon }) => {
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
