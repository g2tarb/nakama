'use client';

import Link from 'next/link';
import { Calendar, Dumbbell, MapPin, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const POPULAIRES = ['Yoga', 'Boxe', 'Musculation', 'Crossfit', 'Running'];
const SPORT_ACTIF_INDEX = 2;

export function Hero() {
  return (
    <section className="nk-hero-bg px-4 py-20 md:py-28">
      <div className="mx-auto max-w-[1080px] text-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="nk-eyebrow inline-block"
        >
          Matching comportemental · plateforme française
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          className="nk-display text-text-primary mt-6"
        >
          Trouve le <span className="text-accent-gold">Nakama</span> qui te fera
          progresser
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}
          className="text-text-secondary mx-auto mt-6 max-w-[620px] text-lg leading-relaxed"
        >
          La plateforme qui connecte sportifs et coachs grâce au matching comportemental.
          Trouve le pro qui te correspond vraiment.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.24 }}
          className="bg-card border-border/40 mx-auto mt-10 flex max-w-[880px] flex-col items-stretch gap-1 rounded-xl border p-2 text-left md:flex-row md:gap-0"
        >
          <SearchField label="Sport" icon={Dumbbell} value="Fitness" />
          <Divider />
          <SearchField label="Quand" icon={Calendar} value="Mer. 16 avril, 12:30" />
          <Divider />
          <SearchField label="Où" icon={MapPin} value="Paris 11e" />
          <Link
            href="/recherche"
            className="bg-primary text-primary-foreground hover:bg-accent-gold-hover focus-visible:ring-ring/50 m-1 inline-flex items-center justify-center gap-2 rounded-[10px] px-6 py-3 text-[15px] font-semibold transition-all hover:-translate-y-px focus-visible:ring-3 active:translate-y-px"
          >
            <Search size={16} />
            Rechercher
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.32 }}
          className="mt-5 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="text-text-secondary text-[13px]">Populaire :</span>
          {POPULAIRES.map((sport, i) => {
            const active = i === SPORT_ACTIF_INDEX;
            return (
              <button
                key={sport}
                type="button"
                className={
                  active
                    ? 'bg-primary text-primary-foreground border-primary cursor-pointer rounded-full border px-3.5 py-1.5 text-[13px] font-medium'
                    : 'text-text-secondary border-border hover:border-accent-muted hover:text-text-primary cursor-pointer rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors'
                }
              >
                {sport}
              </button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function SearchField({
  label,
  icon: Icon,
  value,
}: {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  value: string;
}) {
  return (
    <div className="flex-1 px-4 py-2">
      <div className="nk-label mb-1">{label}</div>
      <div className="text-text-primary flex items-center gap-2 text-[15px]">
        <Icon size={16} className="text-accent-gold" />
        {value}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="bg-border hidden w-px md:block" aria-hidden="true" />;
}
