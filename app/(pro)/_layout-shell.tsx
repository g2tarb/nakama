'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Calendar,
  CreditCard,
  Home,
  LayoutDashboard,
  MessageCircle,
  Settings,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores/user-store';
import { pros } from '@/lib/mock-data';
import { SPECIALITES } from '@/lib/constants';

type SidebarItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
};

const SIDEBAR_ITEMS: ReadonlyArray<SidebarItem> = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/agenda', label: 'Agenda', icon: Calendar },
  { href: '/clients', label: 'Mes athlètes', icon: Users },
  { href: '/messages', label: 'Messages', icon: MessageCircle, badge: 3 },
  { href: '/cartes-services', label: 'Cartes de service', icon: CreditCard },
  { href: '/revenus', label: 'Revenus', icon: TrendingUp },
  { href: '/parametres', label: 'Réglages', icon: Settings },
];

const MOBILE_NAV: ReadonlyArray<{ href: string; label: string; icon: LucideIcon }> = [
  { href: '/dashboard', label: 'Bord', icon: Home },
  { href: '/agenda', label: 'Agenda', icon: Calendar },
  { href: '/clients', label: 'Athlètes', icon: Users },
  { href: '/cartes-services', label: 'Cartes', icon: CreditCard },
  { href: '/revenus', label: 'Revenus', icon: TrendingUp },
];

const DESKTOP_NAV: ReadonlyArray<{ href: string; label: string }> = [
  { href: '/dashboard', label: 'Bord' },
  { href: '/agenda', label: 'Agenda' },
  { href: '/clients', label: 'Athlètes' },
  { href: '/cartes-services', label: 'Cartes' },
  { href: '/revenus', label: 'Revenus' },
];

export function ProLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pro = useUserStore((s) => s.pro) ?? pros[4]!;

  const specLabel =
    SPECIALITES.find((s) => s.value === pro.specialite)?.label ?? pro.specialite;

  const activeMobileHref = MOBILE_NAV.find(
    ({ href }) => pathname === href || (pathname?.startsWith(`${href}/`) ?? false),
  )?.href;

  return (
    <div className="flex min-h-screen">
      <aside
        className="border-border/60 fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r lg:flex"
        style={{ background: 'var(--color-sidebar)' }}
      >
        <div className="border-border/60 flex items-center gap-2.5 border-b px-5 py-5">
          <Image src="/logos/nakama-symbol.svg" alt="" width={22} height={22} priority />
          <span className="text-accent-gold text-[14px] font-bold tracking-[0.04em]">
            NAKAMA
          </span>
          <span className="text-text-tertiary ml-auto text-[10px] font-semibold tracking-[0.08em] uppercase">
            Pro
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
          {SIDEBAR_ITEMS.map(({ href, label, icon: Icon, badge }) => {
            const isActive =
              pathname === href || (pathname?.startsWith(`${href}/`) ?? false);
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'group/item relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors',
                  isActive
                    ? 'text-accent-gold'
                    : 'text-text-secondary hover:text-text-primary',
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="pro-sidebar-active"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: 'var(--color-accent-gold-wash)' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon size={17} className="relative z-10" strokeWidth={1.75} />
                <span className="relative z-10 flex-1">{label}</span>
                {badge !== undefined && (
                  <span className="bg-accent-gold relative z-10 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-[var(--color-background)]">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-border/60 border-t p-3">
          <Link
            href="/parametres"
            className="bg-card hover:bg-surface-elevated flex items-center gap-2.5 rounded-[10px] p-2.5 transition-colors"
          >
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
              <Image
                src={pro.photo}
                alt={pro.prenom}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-text-primary truncate text-[13px] font-semibold">
                {pro.prenom} {pro.nom}
              </div>
              <div className="text-text-tertiary truncate text-[11px]">{specLabel}</div>
            </div>
          </Link>
        </div>
      </aside>

      <div className="flex flex-1 flex-col lg:pl-60">
        <header className="border-border/60 bg-background/85 sticky top-0 z-40 flex h-14 items-center gap-6 border-b px-4 backdrop-blur-md lg:hidden">
          <Link
            href="/dashboard"
            className="text-accent-gold flex items-center gap-2 text-lg font-bold tracking-[0.04em]"
          >
            <Image
              src="/logos/nakama-symbol.svg"
              alt=""
              width={22}
              height={22}
              priority
            />
            NAKAMA
          </Link>
          <nav
            className="hidden flex-1 items-center justify-center gap-6 md:flex"
            aria-label="Navigation principale"
          >
            {DESKTOP_NAV.map(({ href, label }) => {
              const isActive = href === activeMobileHref;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'relative py-1 text-[14px] font-medium transition-colors',
                    isActive
                      ? 'text-accent-gold'
                      : 'text-text-secondary hover:text-text-primary',
                  )}
                >
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="pro-desktop-nav-indicator"
                      aria-hidden="true"
                      className="bg-accent-gold absolute right-0 -bottom-1 left-0 h-[2px] rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <button
              type="button"
              aria-label="Notifications"
              className="text-text-secondary hover:text-text-primary hover:bg-card relative flex h-9 w-9 items-center justify-center rounded-full transition-colors"
            >
              <Bell size={17} />
              <span
                aria-hidden="true"
                className="bg-accent-gold ring-background absolute top-2 right-2 h-1.5 w-1.5 rounded-full ring-2"
              />
            </button>
            <Link
              href="/parametres"
              aria-label="Mon profil"
              className="ring-border hover:ring-accent-muted flex h-8 w-8 items-center justify-center rounded-full ring-1 transition-all"
            >
              <span className="sr-only">Profil</span>
              <User size={15} className="text-text-secondary" />
            </Link>
          </div>
        </header>

        <main className="flex-1 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
          {children}
        </main>
      </div>

      <nav
        className="border-border/60 bg-background/85 pb-safe fixed inset-x-0 bottom-0 z-50 border-t backdrop-blur-md md:hidden"
        aria-label="Navigation mobile"
      >
        <div className="mx-auto flex h-20 max-w-[480px] items-stretch px-2">
          {MOBILE_NAV.map(({ href, label, icon: Icon }) => {
            const isActive = href === activeMobileHref;
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className="relative flex flex-1 flex-col items-center justify-center gap-1 pt-3 pb-3"
              >
                {isActive && (
                  <motion.span
                    layoutId="pro-tab-indicator"
                    aria-hidden="true"
                    className="bg-accent-gold absolute top-0 h-[3px] w-10 rounded-b-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <motion.span
                  animate={isActive ? { y: -1, scale: 1.05 } : { y: 0, scale: 1 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    'flex flex-col items-center gap-0.5 transition-colors',
                    isActive ? 'text-accent-gold' : 'text-text-tertiary',
                  )}
                >
                  <Icon size={22} strokeWidth={isActive ? 2 : 1.75} />
                  <span className="text-[11px] font-medium">{label}</span>
                </motion.span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
