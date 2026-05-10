'use client';

import { useState } from 'react';
import { ChevronDown, Mail, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { containerVariants, itemVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

const FAQ = [
  {
    q: 'Comment fonctionne le matching comportemental ?',
    a: 'On évalue 3 axes psychologiques : suivi rapproché ou autonomie, cadre strict ou souple, intensité ou progressivité. On compare ton profil avec ceux des pros pour te proposer les meilleurs fits.',
  },
  {
    q: 'Puis-je annuler une séance gratuitement ?',
    a: 'Oui, jusqu’à 24 h avant le créneau. Au-delà, la séance est due — ton coach a réservé son temps pour toi.',
  },
  {
    q: 'Comment changer mes vibes psychologiques ?',
    a: 'Va dans Profil > Mon profil > section Vibe. Tu peux ajuster les 3 sliders à tout moment, le matching se met à jour en direct.',
  },
  {
    q: 'Mon coach voit-il mes mesures de poids ?',
    a: 'Uniquement si tu lui partages ta fiche athlète. Par défaut, tes données de suivi restent privées dans ton espace.',
  },
  {
    q: 'Comment ajouter un moyen de paiement ?',
    a: 'Profil > Paiements > Ajouter une carte. On utilise un partenaire de paiement sécurisé (PCI-DSS) qui ne stocke pas tes données chez nous.',
  },
  {
    q: 'Comment supprimer mon compte ?',
    a: 'Profil > Réglages > Confidentialité > Supprimer mon compte. Action définitive, conservation 30 jours pour conformité légale puis effacement total.',
  },
];

export default function AidePage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-[480px] px-4 py-6 md:max-w-[640px]"
    >
      <motion.header variants={itemVariants} className="mb-6">
        <span className="nk-eyebrow">Support</span>
        <h1 className="nk-h1 text-text-primary mt-1.5 tracking-[-0.02em]">
          Aide & support
        </h1>
        <p className="text-text-secondary mt-2 text-sm leading-relaxed">
          Trouve ta réponse en quelques secondes ou écris-nous, on répond sous 24 h.
        </p>
      </motion.header>

      {/* Contact rapide */}
      <motion.div variants={itemVariants} className="mb-6 grid grid-cols-2 gap-2.5">
        <a
          href="mailto:contact@nakama.tech"
          className="bg-card border-border/40 hover:bg-surface-elevated flex items-center gap-2.5 rounded-xl border p-4 transition-colors"
        >
          <span
            aria-hidden="true"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px]"
            style={{ background: 'var(--color-accent-gold-wash)' }}
          >
            <Mail size={14} className="text-accent-gold" />
          </span>
          <div className="min-w-0">
            <div className="text-text-primary text-[12.5px] font-semibold">Email</div>
            <div className="text-text-tertiary truncate text-[10.5px]">
              contact@nakama.tech
            </div>
          </div>
        </a>
        <button
          type="button"
          className="bg-card border-border/40 hover:bg-surface-elevated flex items-center gap-2.5 rounded-xl border p-4 transition-colors"
        >
          <span
            aria-hidden="true"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px]"
            style={{ background: 'var(--color-accent-gold-wash)' }}
          >
            <MessageCircle size={14} className="text-accent-gold" />
          </span>
          <div className="min-w-0 text-left">
            <div className="text-text-primary text-[12.5px] font-semibold">Chat</div>
            <div className="text-text-tertiary text-[10.5px]">Bientôt disponible</div>
          </div>
        </button>
      </motion.div>

      {/* FAQ */}
      <motion.section variants={itemVariants}>
        <span className="nk-label text-accent-muted mb-3 block">FAQ</span>
        <ul className="flex flex-col gap-2">
          {FAQ.map((item, i) => {
            const open = openIndex === i;
            return (
              <li
                key={i}
                className="bg-card border-border/40 overflow-hidden rounded-xl border"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="hover:bg-surface-elevated flex w-full items-center justify-between gap-3 p-4 text-left transition-colors"
                >
                  <span className="text-text-primary text-[14px] font-medium">
                    {item.q}
                  </span>
                  <ChevronDown
                    size={16}
                    className={cn(
                      'text-text-tertiary shrink-0 transition-transform duration-300',
                      open && 'rotate-180',
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="border-border/40 overflow-hidden border-t"
                    >
                      <p className="text-text-secondary px-4 py-3 text-[13.5px] leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </motion.section>
    </motion.div>
  );
}
