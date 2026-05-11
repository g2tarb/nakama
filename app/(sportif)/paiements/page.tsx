'use client';

import { CreditCard, Download, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

import { containerVariants, itemVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

const FACTURES = [
  {
    id: 'F-2026-0312',
    date: '12 mars 2026',
    libelle: 'Séance Renforcement · Julie BERNARD',
    montant: 45,
    statut: 'payee',
  },
  {
    id: 'F-2026-0228',
    date: '28 fév. 2026',
    libelle: 'Séance Cardio · Karim BENSALAH',
    montant: 60,
    statut: 'payee',
  },
  {
    id: 'F-2026-0215',
    date: '15 fév. 2026',
    libelle: 'Séance Yoga · Léa MORENO',
    montant: 50,
    statut: 'payee',
  },
  {
    id: 'F-2026-0205',
    date: '5 fév. 2026',
    libelle: 'Séance Crossfit · Sofia MARTINEZ',
    montant: 55,
    statut: 'remboursee',
  },
];

const TOTAL_DEPENSE = FACTURES.filter((f) => f.statut === 'payee').reduce(
  (s, f) => s + f.montant,
  0,
);

export default function PaiementsPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-[480px] px-4 py-6 md:max-w-[640px]"
    >
      <motion.header variants={itemVariants} className="mb-5">
        <span className="nk-eyebrow">Comptabilité</span>
        <h1 className="nk-h1 text-text-primary mt-1.5 tracking-[-0.02em]">Paiements</h1>
      </motion.header>

      {/* Carte bancaire */}
      <motion.section
        variants={itemVariants}
        className="relative mb-5 overflow-hidden rounded-2xl p-5 text-white shadow-[var(--shadow-elevated)]"
        style={{
          background: 'linear-gradient(135deg, #0A0A0A 0%, #131313 50%, #1C1C1C 100%)',
          aspectRatio: '1.6/1',
        }}
      >
        {/* Décor or beige */}
        <div
          aria-hidden="true"
          className="absolute -top-12 -right-12 h-44 w-44 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(229,181,71,0.32) 0%, transparent 70%)',
          }}
        />

        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="nk-eyebrow text-accent-gold">Carte Nakama</span>
            <CreditCard size={22} className="text-accent-gold" />
          </div>

          <div>
            <div className="text-text-primary nk-mono text-[18px] tracking-[0.18em] tabular-nums">
              •••• •••• •••• 4218
            </div>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <div className="text-text-tertiary text-[10px] tracking-[0.08em] uppercase">
                  Titulaire
                </div>
                <div className="text-text-primary text-[13px] font-semibold">
                  THOMAS LEROY
                </div>
              </div>
              <div>
                <div className="text-text-tertiary text-[10px] tracking-[0.08em] uppercase">
                  Expire
                </div>
                <div className="text-text-primary nk-mono text-[13px] font-semibold tabular-nums">
                  09/28
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Total */}
      <motion.div
        variants={itemVariants}
        className="bg-card border-border/40 mb-5 grid grid-cols-2 gap-px rounded-xl border"
        style={{ background: 'var(--color-border-soft)' }}
      >
        <div className="bg-card rounded-l-xl px-4 py-4">
          <div className="nk-label text-accent-muted">Dépensé · 2026</div>
          <div className="text-text-primary mt-1 text-[20px] font-bold tabular-nums">
            {TOTAL_DEPENSE} €
          </div>
        </div>
        <div className="bg-card rounded-r-xl px-4 py-4">
          <div className="nk-label text-accent-muted">Séances</div>
          <div className="text-text-primary mt-1 text-[20px] font-bold tabular-nums">
            {FACTURES.filter((f) => f.statut === 'payee').length}
          </div>
        </div>
      </motion.div>

      {/* Factures */}
      <motion.section variants={itemVariants}>
        <div className="mb-3 flex items-center justify-between">
          <span className="nk-label text-accent-muted">Factures</span>
          <button
            type="button"
            className="text-accent-gold hover:text-accent-gold-hover inline-flex items-center gap-1 text-[12px] font-medium transition-colors"
          >
            Tout télécharger
          </button>
        </div>
        <ul className="flex flex-col gap-2">
          {FACTURES.map((f) => (
            <li
              key={f.id}
              className="bg-card border-border/40 hover:bg-surface-elevated flex items-center gap-3 rounded-xl border p-4 transition-colors"
            >
              <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
                style={{ background: 'var(--color-accent-gold-wash)' }}
              >
                <Download size={15} className="text-accent-gold" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-text-primary text-sm font-medium">{f.libelle}</div>
                <div className="text-text-tertiary text-xs">
                  {f.date} · {f.id}
                </div>
              </div>
              <div className="text-right">
                <div
                  className={cn(
                    'text-sm font-bold tabular-nums',
                    f.statut === 'remboursee'
                      ? 'text-text-tertiary line-through'
                      : 'text-accent-gold',
                  )}
                >
                  {f.montant} €
                </div>
                <div className="text-text-tertiary text-[11px]">
                  {f.statut === 'remboursee' ? 'Remboursé' : 'Payé'}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </motion.section>

      <motion.button
        variants={itemVariants}
        type="button"
        className="border-border/60 hover:border-accent-muted text-text-primary mt-5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed py-3.5 text-[13px] font-medium transition-colors"
      >
        <Plus size={15} />
        Ajouter une carte
      </motion.button>
    </motion.div>
  );
}
