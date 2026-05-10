'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Calendar, Home, MessageCircle, Search, User } from 'lucide-react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/accueil', label: 'Accueil', icon: Home },
  { href: '/recherche', label: 'Recherche', icon: Search },
  { href: '/rdv', label: 'RDV', icon: Calendar },
  { href: '/messages', label: 'Messages', icon: MessageCircle },
  { href: '/profil', label: 'Profil', icon: User },
] as const;

export function SportifLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeIndex = NAV_ITEMS.findIndex(
    ({ href }) => pathname === href || (pathname?.startsWith(`${href}/`) ?? false),
  );
  const activeTabHref = activeIndex >= 0 ? NAV_ITEMS[activeIndex]?.href : null;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-border bg-background/80 sticky top-0 z-40 h-14 border-b backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-[480px] items-center justify-between px-4 md:max-w-[640px]">
          <Link
            href="/accueil"
            className="text-accent-gold text-lg font-bold tracking-[0.04em]"
          >
            NAKAMA
          </Link>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Notifications"
              className="text-text-secondary hover:text-text-primary hover:bg-surface relative flex h-9 w-9 items-center justify-center rounded-full transition-colors active:translate-y-px"
            >
              <Bell size={18} />
              <span
                aria-hidden="true"
                className="bg-accent-gold ring-background absolute top-2 right-2 h-1.5 w-1.5 rounded-full ring-2"
              />
            </button>
            <Link
              href="/profil"
              aria-label="Mon profil"
              className="ring-border hover:ring-accent-muted flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ring-1 transition-all active:translate-y-px"
              style={{
                background: 'linear-gradient(135deg,#34465e,#1c2737)',
                color: 'rgba(201,178,122,0.6)',
              }}
            >
              EY
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24 md:pb-0">{children}</main>

      <nav className="border-border bg-background/85 fixed inset-x-0 bottom-0 z-50 h-20 border-t backdrop-blur-md md:hidden">
        <div className="mx-auto flex h-full max-w-[480px] items-stretch px-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = href === activeTabHref;
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className="group/tab relative flex flex-1 flex-col items-center justify-center gap-1 pt-3 pb-3"
              >
                {isActive && (
                  <motion.span
                    layoutId="sportif-tab-indicator"
                    aria-hidden="true"
                    className="bg-accent-gold absolute top-0 h-[3px] w-10 rounded-b-full"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <motion.span
                  animate={isActive ? { y: -1, scale: 1.05 } : { y: 0, scale: 1 }}
                  transition={{
                    duration: 0.25,
                    ease: [0.22, 1, 0.36, 1],
                  }}
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
