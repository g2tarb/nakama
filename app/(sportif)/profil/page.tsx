'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  ChevronRight,
  CreditCard,
  Heart,
  HelpCircle,
  History,
  LogOut,
  Settings,
  TrendingUp,
  User,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

import { useUserStore } from '@/stores/user-store';
import { defaultSportif } from '@/lib/mock-data';
import { signOutAction } from '@/lib/auth/actions';
import { containerVariants, itemVariants } from '@/lib/animations';

type MenuKey =
  | 'mon-profil'
  | 'suivi'
  | 'historique'
  | 'favoris'
  | 'paiements'
  | 'notifications'
  | 'parametres'
  | 'aide';

const MENU: Array<{
  key: MenuKey;
  href: string;
  icon: LucideIcon;
  label: string;
  description: string;
  badge?: number;
}> = [
  {
    key: 'mon-profil',
    href: '/profil/info',
    icon: User,
    label: 'Mon profil',
    description: 'Édite tes infos, ta vibe, tes objectifs',
  },
  {
    key: 'suivi',
    href: '/suivi',
    icon: TrendingUp,
    label: 'Suivi & progression',
    description: 'Graphes, ressentis, mesures',
  },
  {
    key: 'historique',
    href: '/historique',
    icon: History,
    label: 'Historique',
    description: 'Tes séances passées',
  },
  {
    key: 'favoris',
    href: '/favoris',
    icon: Heart,
    label: 'Mes favoris',
    description: 'Pros mis en favori',
  },
  {
    key: 'paiements',
    href: '/paiements',
    icon: CreditCard,
    label: 'Paiements',
    description: 'Carte, factures, abonnements',
  },
  {
    key: 'notifications',
    href: '/notifications',
    icon: Bell,
    label: 'Notifications',
    description: 'Centre + préférences',
    badge: 3,
  },
  {
    key: 'parametres',
    href: '/reglages',
    icon: Settings,
    label: 'Réglages',
    description: 'Langue, confidentialité, RGPD',
  },
  {
    key: 'aide',
    href: '/aide',
    icon: HelpCircle,
    label: 'Aide & support',
    description: 'FAQ et nous contacter',
  },
];

export default function ProfilHubPage() {
  const router = useRouter();
  const sportif = useUserStore((s) => s.sportif) ?? defaultSportif;

  async function handleLogout() {
    try {
      await signOutAction();
    } catch {
      router.push('/');
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-[480px] px-4 py-6 md:max-w-[640px]"
    >
      {/* En-tête profil compact */}
      <motion.section
        variants={itemVariants}
        className="bg-card border-border/40 mb-6 flex items-center gap-4 rounded-xl border p-4"
      >
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
          <Image
            src={sportif.photo}
            alt={sportif.prenom}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-text-primary text-[16px] font-semibold">
            {sportif.prenom} {sportif.nom}
          </h1>
          <p className="text-text-tertiary text-xs">
            {sportif.age} ans · {sportif.ville}
          </p>
        </div>
        <Link
          href="/profil/info"
          className="text-accent-gold text-[12px] font-medium hover:underline"
        >
          Voir
        </Link>
      </motion.section>

      <ul className="flex flex-col gap-2">
        {MENU.map((item) => (
          <motion.li key={item.key} variants={itemVariants}>
            <Link
              href={item.href}
              className="bg-card border-border/40 hover:bg-surface-elevated flex w-full items-center gap-3.5 rounded-xl border p-4 transition-colors active:translate-y-px"
            >
              <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
                style={{ background: 'var(--color-accent-gold-wash)' }}
              >
                <item.icon size={17} className="text-accent-gold" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-text-primary text-[14.5px] font-medium">
                    {item.label}
                  </p>
                  {item.badge != null && (
                    <span className="bg-accent-gold inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-[var(--color-background)]">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-text-tertiary mt-0.5 text-[12px]">
                  {item.description}
                </p>
              </div>
              <ChevronRight size={16} className="text-text-tertiary shrink-0" />
            </Link>
          </motion.li>
        ))}
      </ul>

      <motion.div variants={itemVariants} className="border-border/40 mt-6 border-t pt-6">
        <button
          type="button"
          onClick={handleLogout}
          className="border-danger/30 bg-danger/5 hover:bg-danger/15 flex w-full items-center justify-center gap-2 rounded-xl border p-3.5 transition-colors active:translate-y-px"
        >
          <LogOut size={16} className="text-danger" />
          <span className="text-danger text-[14px] font-medium">Se déconnecter</span>
        </button>
      </motion.div>

      <p className="text-text-tertiary mt-6 text-center text-[11px]">
        v0.1 · démo MVP · 2026
      </p>
    </motion.div>
  );
}
