'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Dumbbell,
  Flower,
  Footprints,
  HandMetal,
  Medal,
  Search,
  Sparkles,
  Swords,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { format, isAfter, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';

import { ProCard } from '@/components/sportif/pro-card';
import { HeroSearchBar } from '@/components/sportif/hero-search-bar';
import { useMatchedPros } from '@/hooks/use-matching';
import { defaultSportif, pros, seances } from '@/lib/mock-data';
import { SPORTS_DISPONIBLES } from '@/lib/constants';
import { containerVariants, itemVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { useAccueilStore, type AccueilTab } from '@/stores/accueil-store';
import type { Pro, Sport } from '@/types';

const SPORT_ICONS: Partial<Record<Sport, LucideIcon>> = {
  fitness: Dumbbell,
  running: Footprints,
  yoga: Flower,
  musculation: Dumbbell,
  boxe: Swords,
  crossfit: Zap,
  natation: HandMetal,
  football: CircleDot,
  tennis: Medal,
};

const pseudoDistance = (id: string) => {
  const n = parseInt(id.replace(/\D/g, '').slice(-3) || '0', 10);
  return Math.round(((n % 80) / 10 + 0.5) * 10) / 10;
};

const pseudoScore = (id: string) => {
  const n = parseInt(id.replace(/\D/g, '').slice(-2) || '0', 10);
  return 75 + (n % 20);
};

const STEPS: Array<{ icon: LucideIcon; label: string; description: string }> = [
  { icon: Search, label: 'Trouve', description: 'Le coach qui matche tes envies' },
  { icon: Calendar, label: 'Réserve', description: 'Une séance en quelques clics' },
  {
    icon: CheckCircle2,
    label: 'Progresse',
    description: 'Suivi & feedback à chaque RDV',
  },
];

export default function AccueilSportifPage() {
  const router = useRouter();
  const matchedPros = useMatchedPros();
  const tab = useAccueilStore((s) => s.tab);
  const setTab = useAccueilStore((s) => s.setTab);

  const nextSeance = useMemo(() => {
    const now = new Date();
    return [...seances]
      .filter(
        (s) =>
          (s.statut === 'confirmee' || s.statut === 'en_attente') &&
          isAfter(parseISO(s.date), now),
      )
      .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())[0];
  }, []);

  const nextSeancePro = nextSeance ? pros.find((p) => p.id === nextSeance.proId) : null;

  const prosProximite = useMemo(
    () => [...pros].sort((a, b) => a.rayonKm - b.rayonKm).slice(0, 5),
    [],
  );

  const suggestionsList = useMemo(() => {
    const source =
      matchedPros.length > 0
        ? matchedPros.slice(0, 5)
        : pros.slice(0, 5).map((p) => ({ proId: p.id, scoreTotal: pseudoScore(p.id) }));
    return source
      .map(({ proId, scoreTotal }) => {
        const pro = pros.find((p) => p.id === proId);
        return pro ? { pro, score: scoreTotal } : null;
      })
      .filter((x): x is { pro: Pro; score: number } => x !== null);
  }, [matchedPros]);

  return (
    <div className="pb-8">
      <HeroSearchBar prenom={defaultSportif.prenom} />

      <div className="mx-auto max-w-[480px] md:max-w-[640px]">
        {nextSeance && nextSeancePro && (
          <NextSessionCard
            date={parseISO(nextSeance.date)}
            duration={nextSeance.dureeMinutes}
            status={nextSeance.statut}
            proName={`${nextSeancePro.prenom} ${nextSeancePro.nom}`}
            proInitials={`${nextSeancePro.prenom[0] ?? ''}${nextSeancePro.nom[0] ?? ''}`}
            proSpec={nextSeancePro.specialite}
            onClick={() => router.push('/rdv')}
          />
        )}

        {/* Mobile : toggle + carousel unique */}
        <section className="mt-10 md:hidden">
          <div className="mb-4 px-4">
            <ToggleTabs tab={tab} onChange={setTab} />
          </div>
          <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
            {tab === 'suggestions'
              ? suggestionsList.map(({ pro, score }) => (
                  <div key={pro.id} className="snap-start">
                    <ProCard
                      pro={pro}
                      compatibilityScore={score}
                      onClick={() => router.push(`/pros/${pro.id}`)}
                    />
                  </div>
                ))
              : prosProximite.map((pro) => (
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

        {/* Desktop : 2 carrousels coexistants, espacement ≥64px */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="mt-10 hidden md:block"
        >
          <SectionHeading>Matchés pour toi</SectionHeading>
          <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
            {suggestionsList.map(({ pro, score }) => (
              <motion.div key={pro.id} variants={itemVariants} className="snap-start">
                <ProCard
                  pro={pro}
                  compatibilityScore={score}
                  onClick={() => router.push(`/pros/${pro.id}`)}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        <section className="mt-16 hidden md:block">
          <SectionHeading>À proximité</SectionHeading>
          <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
            {prosProximite.map((pro) => (
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

        <section className="mt-10 px-4">
          <h2 className="nk-h3 text-text-primary mb-4">Comment ça marche</h2>
          <ol className="grid grid-cols-3 gap-3">
            {STEPS.map(({ icon: Icon, label, description }, i) => (
              <li
                key={label}
                className="border-border/40 bg-card flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center"
              >
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ background: 'var(--color-accent-gold-wash)' }}
                >
                  <Icon size={16} className="text-accent-gold" />
                </span>
                <div className="text-text-primary text-sm font-semibold">
                  {i + 1}. {label}
                </div>
                <div className="text-text-tertiary text-[11px] leading-snug">
                  {description}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10 px-4">
          <h2 className="nk-h3 text-text-primary mb-4">Découvre par sport</h2>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
            {SPORTS_DISPONIBLES.filter((s) => s.value !== 'autre').map(
              ({ value, label }) => {
                const Icon = SPORT_ICONS[value] ?? Sparkles;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => router.push(`/recherche?sport=${value}`)}
                    className={cn(
                      'border-border/40 bg-card flex h-24 flex-col items-center justify-center gap-2 rounded-xl border text-[13px] font-medium transition-all',
                      'hover:border-accent-muted hover:bg-surface-elevated active:translate-y-px',
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 items-center justify-center rounded-[10px] transition-colors"
                      style={{ background: 'var(--color-accent-gold-wash)' }}
                    >
                      <Icon size={18} className="text-accent-gold" />
                    </span>
                    <span className="text-text-secondary">{label}</span>
                  </button>
                );
              },
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2 variants={itemVariants} className="nk-h3 text-text-primary mb-4 px-4">
      {children}
    </motion.h2>
  );
}

const TABS: Array<{ value: AccueilTab; label: string }> = [
  { value: 'suggestions', label: 'Suggestions' },
  { value: 'proximite', label: 'À proximité' },
];

function ToggleTabs({
  tab,
  onChange,
}: {
  tab: AccueilTab;
  onChange: (next: AccueilTab) => void;
}) {
  return (
    <div className="border-border/40 flex items-center gap-6 border-b">
      {TABS.map(({ value, label }) => {
        const active = tab === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            aria-pressed={active}
            className={cn(
              'relative pt-1 pb-2.5 text-sm font-semibold transition-colors',
              active ? 'text-accent-gold' : 'text-text-secondary hover:text-text-primary',
            )}
          >
            {label}
            {active && (
              <motion.span
                layoutId="accueil-toggle-indicator"
                aria-hidden="true"
                className="bg-accent-gold absolute right-0 -bottom-px left-0 h-[2px] rounded-full"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

type NextSessionCardProps = {
  date: Date;
  duration: number;
  status: 'confirmee' | 'en_attente' | 'annulee' | 'terminee';
  proName: string;
  proInitials: string;
  proSpec: string;
  onClick: () => void;
};

function NextSessionCard({
  date,
  duration,
  status,
  proName,
  proInitials,
  proSpec,
  onClick,
}: NextSessionCardProps) {
  const eyebrow = format(date, 'EEE d MMM', { locale: fr }).toUpperCase();
  const time = format(date, 'HH:mm', { locale: fr });
  const endTime = format(new Date(date.getTime() + duration * 60_000), 'HH:mm', {
    locale: fr,
  });

  const statusPill =
    status === 'confirmee'
      ? { label: 'Confirmé', cls: 'bg-accent-gold/15 text-accent-gold' }
      : { label: 'En attente', cls: 'bg-warning/15 text-warning' };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="mt-6 px-4"
    >
      <div className="text-text-tertiary mb-2 px-1 text-[11px] font-semibold tracking-[0.08em] uppercase">
        Prochaine séance
      </div>
      <button
        type="button"
        onClick={onClick}
        className="bg-card border-border/40 hover:bg-surface-elevated group flex w-full flex-col gap-3 rounded-xl border p-5 text-left transition-all active:translate-y-px"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-accent-gold text-xs font-semibold tracking-[0.04em] uppercase">
              {eyebrow}
            </div>
            <div className="text-text-primary mt-1 text-[20px] font-semibold tabular-nums">
              {time} – {endTime}
            </div>
          </div>
          <span
            className={cn(
              'shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium',
              statusPill.cls,
            )}
          >
            {statusPill.label}
          </span>
        </div>
        <div className="border-border/40 flex items-center gap-3 border-t pt-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
            style={{
              background: 'linear-gradient(135deg,#262626,#131313)',
              color: 'rgba(229,181,71,0.6)',
            }}
          >
            {proInitials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-text-primary truncate text-sm font-medium">
              {proName}
            </div>
            <div className="text-text-tertiary text-xs">{proSpec}</div>
          </div>
          <ChevronRight
            size={18}
            className="text-text-tertiary group-hover:text-accent-gold transition-colors"
          />
        </div>
      </button>
    </motion.section>
  );
}
