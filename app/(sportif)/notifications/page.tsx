'use client';

import { useState } from 'react';
import { Bell, Calendar, CheckCircle, MessageCircle, Sparkles, Star } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

import { containerVariants, itemVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

type NotifKind = 'match' | 'rdv' | 'message' | 'avis' | 'reminder';

const ICON_BY_KIND: Record<NotifKind, LucideIcon> = {
  match: Sparkles,
  rdv: Calendar,
  message: MessageCircle,
  avis: Star,
  reminder: Bell,
};

const NOTIFS: Array<{
  id: string;
  kind: NotifKind;
  titre: string;
  body: string;
  date: string;
  lu: boolean;
}> = [
  {
    id: 'n1',
    kind: 'match',
    titre: 'Nouveaux matchs trouvés',
    body: '3 pros à 92 % de compatibilité dans ton rayon. Découvre-les.',
    date: 'il y a 2 h',
    lu: false,
  },
  {
    id: 'n2',
    kind: 'rdv',
    titre: 'Séance demain confirmée',
    body: 'Julie BERNARD t’attend à 12:30 — Salle Boulogne 11e.',
    date: 'il y a 4 h',
    lu: false,
  },
  {
    id: 'n3',
    kind: 'message',
    titre: 'Karim BENSALAH t’a écrit',
    body: 'Salut Thomas, j’ai préparé ton programme pour la semaine…',
    date: 'il y a 6 h',
    lu: false,
  },
  {
    id: 'n4',
    kind: 'avis',
    titre: 'Donne ton avis',
    body: 'Comment s’est passée ta séance avec Léa MORENO mardi ?',
    date: 'hier',
    lu: true,
  },
  {
    id: 'n5',
    kind: 'reminder',
    titre: 'Pense à mettre à jour ton vibe',
    body: 'Plus de 30 jours sans ajustement de ton profil matching.',
    date: 'il y a 3 jours',
    lu: true,
  },
];

export default function NotificationsPage() {
  const [items, setItems] = useState(NOTIFS);
  const nbNonLus = items.filter((n) => !n.lu).length;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-[480px] px-4 py-6 md:max-w-[640px]"
    >
      <motion.header
        variants={itemVariants}
        className="mb-5 flex items-end justify-between"
      >
        <div>
          <span className="nk-eyebrow">Centre</span>
          <h1 className="nk-h1 text-text-primary mt-1.5 tracking-[-0.02em]">
            Notifications
          </h1>
        </div>
        {nbNonLus > 0 && (
          <button
            type="button"
            onClick={() => setItems((prev) => prev.map((n) => ({ ...n, lu: true })))}
            className="text-accent-gold hover:text-accent-gold-hover inline-flex items-center gap-1 text-[12px] font-medium transition-colors"
          >
            <CheckCircle size={13} />
            Tout marquer lu
          </button>
        )}
      </motion.header>

      <ul className="flex flex-col gap-2">
        {items.map((n) => {
          const Icon = ICON_BY_KIND[n.kind];
          return (
            <motion.li
              key={n.id}
              variants={itemVariants}
              onClick={() =>
                setItems((prev) =>
                  prev.map((p) => (p.id === n.id ? { ...p, lu: true } : p)),
                )
              }
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors',
                n.lu
                  ? 'bg-card border-border/40'
                  : 'bg-accent-gold/5 border-accent-muted/40 hover:bg-accent-gold/10',
              )}
            >
              <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
                style={{ background: 'var(--color-accent-gold-wash)' }}
              >
                <Icon size={16} className="text-accent-gold" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start gap-2">
                  <p
                    className={cn(
                      'flex-1 text-[14px] leading-tight',
                      n.lu
                        ? 'text-text-primary font-medium'
                        : 'text-text-primary font-semibold',
                    )}
                  >
                    {n.titre}
                  </p>
                  {!n.lu && (
                    <span
                      aria-label="non lu"
                      className="bg-accent-gold mt-1.5 h-2 w-2 shrink-0 rounded-full"
                    />
                  )}
                </div>
                <p className="text-text-secondary mt-1 text-[12.5px] leading-snug">
                  {n.body}
                </p>
                <p className="text-text-tertiary mt-1.5 text-[11px]">{n.date}</p>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}
