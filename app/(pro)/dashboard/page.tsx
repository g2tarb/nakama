'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Check,
  ChevronRight,
  Clock,
  Plus,
  Star,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { format, isToday, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

import { useCountUp } from '@/hooks/use-count-up';
import { useUserStore } from '@/stores/user-store';
import { pros, seances, sportifs } from '@/lib/mock-data';
import { containerVariants, itemVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

const SPARKLINE_DATA = [
  { month: 'Nov', value: 1200 },
  { month: 'Déc', value: 1850 },
  { month: 'Jan', value: 1600 },
  { month: 'Fév', value: 2100 },
  { month: 'Mar', value: 2340 },
  { month: 'Avr', value: 2580 },
];

const NEW_REQUESTS = [
  {
    sportifId: 'sportif-001',
    score: 91,
    message: 'Bonjour, je cherche à reprendre le sport après deux ans de pause.',
  },
  {
    sportifId: 'sportif-002',
    score: 87,
    message: 'Préparation marathon, 3 séances par semaine en extérieur.',
  },
  {
    sportifId: 'sportif-003',
    score: 84,
    message: 'Renforcement et perte de poids, créneau midi de préférence.',
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const pro = useUserStore((s) => s.pro) ?? pros[4]!;

  const today = useMemo(() => new Date(), []);

  const todaySeances = useMemo(
    () =>
      seances
        .filter(
          (s) =>
            s.proId === pro.id && isToday(parseISO(s.date)) && s.statut !== 'annulee',
        )
        .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime()),
    [pro.id],
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-[1280px] px-4 py-6 lg:px-10 lg:py-8"
    >
      <motion.header
        variants={itemVariants}
        className="mb-7 flex flex-wrap items-start justify-between gap-4"
      >
        <div>
          <span className="nk-eyebrow capitalize">
            {format(today, 'EEEE d MMMM yyyy', { locale: fr })}
          </span>
          <h1 className="nk-h1 text-text-primary mt-1.5 tracking-[-0.02em]">
            Bonjour <span className="text-accent-gold">{pro.prenom}</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Notifications"
            className="border-border/60 hover:border-accent-muted text-text-primary hover:bg-surface-elevated relative flex h-10 w-10 items-center justify-center rounded-[10px] border transition-all active:translate-y-px"
          >
            <Bell size={16} />
            <span
              aria-hidden="true"
              className="bg-accent-gold ring-background absolute top-2 right-2 h-1.5 w-1.5 rounded-full ring-2"
            />
          </button>
          <button
            type="button"
            onClick={() => router.push('/agenda')}
            className="bg-primary text-primary-foreground hover:bg-accent-gold-hover inline-flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-[13px] font-semibold transition-all hover:-translate-y-px active:translate-y-px"
          >
            <Plus size={15} />
            Nouvelle séance
          </button>
        </div>
      </motion.header>

      <motion.div
        variants={itemVariants}
        className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        <KpiCard
          label="Séances cette semaine"
          value="18"
          delta="+12 % vs n-1"
          deltaPositive
          icon={TrendingUp}
        />
        <KpiCard label="Revenus du mois" value="2 580 €" delta="+8 %" deltaPositive />
        <KpiCard
          label="Note moyenne"
          value={pro.note.toFixed(1)}
          delta={`${pro.nbAvis} avis`}
          icon={Star}
        />
        <KpiCard label="Taux de remplissage" value="86 %" delta="+4 pts" deltaPositive />
      </motion.div>

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <motion.section
          variants={itemVariants}
          className="bg-card border-border/40 rounded-xl border p-5 lg:p-6"
        >
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-text-primary text-[16px] font-semibold tracking-[-0.01em]">
                Aujourd’hui
              </h3>
              <span className="text-text-tertiary text-[12px] capitalize">
                {format(today, 'EEEE d MMMM', { locale: fr })} · {todaySeances.length}{' '}
                séance{todaySeances.length > 1 ? 's' : ''}
              </span>
            </div>
            <button
              type="button"
              onClick={() => router.push('/agenda')}
              className="border-accent-muted text-accent-gold hover:bg-accent-gold-wash inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-all active:translate-y-px"
            >
              Voir l’agenda
              <ChevronRight size={13} />
            </button>
          </div>

          {todaySeances.length === 0 ? (
            <p className="text-text-tertiary py-10 text-center text-sm">
              Aucune séance aujourd’hui. Profite-en pour planifier la suite.
            </p>
          ) : (
            <ul className="flex flex-col">
              {todaySeances.map((seance, i) => {
                const client = sportifs.find((s) => s.id === seance.sportifId);
                const carte = pro.cartesServices.find(
                  (c) => c.id === seance.carteServiceId,
                );
                const start = parseISO(seance.date);
                const isPending = seance.statut === 'en_attente';
                const dur =
                  seance.dureeMinutes >= 60
                    ? `${Math.round((seance.dureeMinutes / 60) * 10) / 10} h`
                    : `${seance.dureeMinutes} min`;
                return (
                  <li
                    key={seance.id}
                    className={cn(
                      'grid grid-cols-[60px_1fr_auto_auto] items-center gap-4 py-3.5',
                      i > 0 && 'border-border/40 border-t',
                    )}
                  >
                    <span className="text-accent-gold nk-mono text-[14px] font-semibold tabular-nums">
                      {format(start, 'HH:mm')}
                    </span>
                    <div className="min-w-0">
                      <div className="text-text-primary truncate text-sm font-medium">
                        {client ? `${client.prenom} ${client.nom}` : 'Client'}
                      </div>
                      <div className="text-text-secondary truncate text-xs">
                        {carte?.nom ?? 'Séance'} · {dur}
                      </div>
                    </div>
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-[11px] font-medium',
                        isPending
                          ? 'bg-warning/15 text-warning'
                          : 'bg-accent-gold/15 text-accent-gold',
                      )}
                    >
                      {isPending ? 'En attente' : 'Confirmé'}
                    </span>
                    <ChevronRight size={16} className="text-text-tertiary" />
                  </li>
                );
              })}
            </ul>
          )}
        </motion.section>

        <motion.section
          variants={itemVariants}
          className="bg-card border-border/40 rounded-xl border p-5"
        >
          <h3 className="text-text-primary text-[15px] font-semibold">
            Nouvelles demandes
          </h3>
          <span className="text-text-tertiary text-[12px]">
            {NEW_REQUESTS.length} athlètes ont matché
          </span>

          <div className="mt-4 flex flex-col gap-3.5">
            {NEW_REQUESTS.map((req, i) => {
              const sportif = sportifs.find((s) => s.id === req.sportifId);
              return (
                <div
                  key={req.sportifId + i}
                  className={cn(
                    'pb-3.5',
                    i !== NEW_REQUESTS.length - 1 && 'border-border/40 border-b',
                  )}
                >
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <span className="text-text-primary truncate text-[14px] font-medium">
                      {sportif
                        ? `${sportif.prenom} ${sportif.nom.charAt(0)}.`
                        : 'Athlète'}
                    </span>
                    <span
                      className="text-accent-gold rounded-md px-1.5 py-0.5 text-[11px] font-bold tabular-nums"
                      style={{ background: 'rgba(229,181,71,0.20)' }}
                    >
                      {req.score} %
                    </span>
                  </div>
                  <p className="text-text-secondary text-[12.5px] leading-snug">
                    « {req.message} »
                  </p>
                  <div className="mt-2.5 flex gap-1.5">
                    <button
                      type="button"
                      className="bg-primary text-primary-foreground hover:bg-accent-gold-hover inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all active:translate-y-px"
                    >
                      <Check size={13} />
                      Accepter
                    </button>
                    <button
                      type="button"
                      className="border-border/60 text-text-secondary hover:border-accent-muted hover:text-text-primary inline-flex flex-1 items-center justify-center rounded-lg border px-3 py-1.5 text-[12px] transition-all active:translate-y-px"
                    >
                      Plus tard
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>
      </div>

      <motion.section
        variants={itemVariants}
        className="bg-card border-border/40 mt-5 rounded-xl border p-5 lg:p-6"
      >
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <span className="nk-label text-accent-muted">Revenus d’avril</span>
            <div className="mt-1.5 flex items-baseline gap-3">
              <RevenueValue target={2580} />
              <span className="text-success inline-flex items-center gap-1 text-[13px] font-medium">
                <TrendingUp size={13} />
                +8 % vs mars
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push('/revenus')}
            className="text-accent-gold hover:text-accent-gold-hover inline-flex items-center gap-1 text-[12px] font-medium transition-colors"
          >
            Détail revenus
            <ChevronRight size={13} />
          </button>
        </div>
        <div className="mt-4 h-20">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={SPARKLINE_DATA}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#E5B547"
                strokeWidth={2}
                dot={false}
                isAnimationActive
                animationDuration={1200}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      <Clock aria-hidden="true" className="hidden" />
    </motion.div>
  );
}

function KpiCard({
  label,
  value,
  delta,
  deltaPositive,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
  icon?: LucideIcon;
}) {
  const TrendIcon = deltaPositive ? TrendingUp : TrendingDown;
  return (
    <div className="bg-card border-border/40 rounded-xl border p-5">
      <div className="flex items-start justify-between gap-2">
        <span className="nk-label text-accent-muted">{label}</span>
        {Icon && <Icon size={14} className="text-accent-gold/70" />}
      </div>
      <div className="text-text-primary mt-3 text-[28px] font-bold tracking-[-0.02em] tabular-nums">
        {value}
      </div>
      {delta && (
        <div
          className={cn(
            'mt-2 inline-flex items-center gap-1 text-[12px]',
            deltaPositive ? 'text-success' : 'text-text-tertiary',
          )}
        >
          {deltaPositive !== undefined && <TrendIcon size={12} />}
          {delta}
        </div>
      )}
    </div>
  );
}

function RevenueValue({ target }: { target: number }) {
  const value = useCountUp(target, 1100);
  return (
    <span className="text-accent-gold text-glow-or text-[34px] font-bold tracking-[-0.02em] tabular-nums">
      {value.toLocaleString('fr-FR')} €
    </span>
  );
}
