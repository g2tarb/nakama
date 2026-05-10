'use client';

import Image from 'next/image';
import { ChevronRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

import { containerVariants, itemVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { seances, pros, defaultSportif } from '@/lib/mock-data';
import { useUserStore } from '@/stores/user-store';
import { RESSENTI_EMOJIS } from '@/lib/constants';

export default function HistoriquePage() {
  const sportif = useUserStore((s) => s.sportif) ?? defaultSportif;

  // Toutes les séances du sportif statut=terminee, triées récentes en haut
  const items = seances
    .filter((s) => s.statut === 'terminee')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 12);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-[480px] px-4 py-6 md:max-w-[640px]"
    >
      <motion.header variants={itemVariants} className="mb-5">
        <span className="nk-eyebrow">{sportif.prenom}</span>
        <h1 className="nk-h1 text-text-primary mt-1.5 tracking-[-0.02em]">Historique</h1>
        <p className="text-text-secondary mt-1 text-sm">
          {items.length} séance{items.length > 1 ? 's' : ''} terminée
          {items.length > 1 ? 's' : ''}
        </p>
      </motion.header>

      {items.length === 0 ? (
        <p className="text-text-tertiary py-12 text-center text-sm">
          Pas encore de séance terminée. Commence ton parcours.
        </p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {items.map((seance) => {
            const pro = pros.find((p) => p.id === seance.proId);
            const start = parseISO(seance.date);
            const ressenti = seance.ressentiClient
              ? RESSENTI_EMOJIS[seance.ressentiClient as 1 | 2 | 3 | 4]
              : null;
            return (
              <motion.li
                key={seance.id}
                variants={itemVariants}
                className="bg-card border-border/40 hover:bg-surface-elevated rounded-xl border p-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {pro && (
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={pro.photo}
                        alt={pro.prenom}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-accent-gold text-[11px] font-semibold tracking-[0.06em] uppercase">
                      {format(start, 'EEE d MMM', { locale: fr })}
                    </div>
                    <div className="text-text-primary text-sm font-medium">
                      {pro ? `${pro.prenom} ${pro.nom}` : 'Pro inconnu'}
                    </div>
                    <div className="text-text-tertiary text-xs">
                      {seance.dureeMinutes} min · {seance.lieu}
                    </div>
                  </div>
                  {ressenti && (
                    <span
                      className="text-[24px]"
                      title={`Ressenti : ${ressenti}`}
                      aria-label="ressenti"
                    >
                      {ressenti}
                    </span>
                  )}
                  <ChevronRight size={16} className="text-text-tertiary" />
                </div>

                {seance.compteRenduCoach && (
                  <p
                    className={cn(
                      'border-border/40 text-text-secondary mt-3 border-t pt-3 text-[13px] leading-relaxed italic',
                    )}
                  >
                    « {seance.compteRenduCoach} »
                  </p>
                )}

                {!seance.ressentiClient && (
                  <button
                    type="button"
                    className="border-accent-muted text-accent-gold hover:bg-accent-gold-wash mt-3 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors"
                  >
                    <Star size={12} />
                    Donner un avis
                  </button>
                )}
              </motion.li>
            );
          })}
        </ul>
      )}
    </motion.div>
  );
}
