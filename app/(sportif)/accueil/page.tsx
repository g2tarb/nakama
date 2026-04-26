'use client';

import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

import { ProCard } from '@/components/sportif/pro-card';
import { useMatchedPros } from '@/hooks/use-matching';
import { pros } from '@/lib/mock-data';
import { SPORTS_DISPONIBLES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { containerVariants, itemVariants } from '@/lib/animations';

const pseudoDistance = (id: string) => {
  const n = parseInt(id.replace(/\D/g, '').slice(-3) || '0', 10);
  return Math.round(((n % 80) / 10 + 0.5) * 10) / 10;
};

const pseudoScore = (id: string) => {
  const n = parseInt(id.replace(/\D/g, '').slice(-2) || '0', 10);
  return 75 + (n % 20);
};

export default function AccueilSportifPage() {
  const router = useRouter();
  const matchedPros = useMatchedPros();

  // Tri par distance mockée pour la section "À proximité"
  const prosProximite = [...pros].sort((a, b) => a.rayonKm - b.rayonKm);

  return (
    <div className="pb-8">
      {/* Barre de recherche */}
      <div className="px-4 pt-6">
        <button
          onClick={() => router.push('/recherche')}
          className="border-border bg-surface hover:bg-surface-elevated flex h-12 w-full items-center gap-3 rounded-[14px] border px-4 text-left transition-colors"
        >
          <Search size={18} className="text-text-tertiary" />
          <span className="text-text-tertiary text-sm">Trouve ton Nakama…</span>
        </button>
        <p className="text-text-tertiary mt-2 text-center text-xs italic">
          Le sport est meilleur quand on est bien accompagné
        </p>
      </div>

      {/* Section — Matchés pour toi */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mt-8"
      >
        <motion.h2 variants={itemVariants} className="mb-4 px-4 text-lg font-bold">
          Matchés pour toi
        </motion.h2>
        <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
          {(matchedPros.length > 0
            ? matchedPros.slice(0, 5)
            : pros.slice(0, 5).map((p) => ({
                proId: p.id,
                scoreTotal: pseudoScore(p.id),
              }))
          ).map((match) => {
            const pro = pros.find((p) => p.id === match.proId);
            if (!pro) return null;
            return (
              <motion.div key={pro.id} variants={itemVariants} className="snap-start">
                <ProCard
                  pro={pro}
                  compatibilityScore={match.scoreTotal}
                  onClick={() => router.push(`/pros/${pro.id}`)}
                />
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Section — À proximité */}
      <section className="mt-10">
        <h2 className="mb-4 px-4 text-lg font-bold">À proximité</h2>
        <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
          {prosProximite.slice(0, 5).map((pro) => (
            <div key={pro.id} className="snap-start">
              <ProCard
                pro={pro}
                distance={pseudoDistance(pro.id)}
                onClick={() => router.push(`/pros/${pro.id}`)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Section — Découvre par sport */}
      <section className="mt-10 px-4">
        <h2 className="mb-4 text-lg font-bold">Découvre par sport</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {SPORTS_DISPONIBLES.filter((s) => s.value !== 'autre').map(
            ({ value, label }) => (
              <button
                key={value}
                onClick={() => router.push(`/recherche?sport=${value}`)}
                className={cn(
                  'border-border bg-surface flex h-20 items-center justify-center rounded-xl border text-sm font-medium transition-all',
                  'hover:border-accent-gold/40 hover:bg-surface-elevated',
                )}
              >
                {label}
              </button>
            ),
          )}
        </div>
      </section>
    </div>
  );
}
