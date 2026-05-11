'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

import { cn } from '@/lib/utils';
import { containerVariants, itemVariants } from '@/lib/animations';

const POIDS_DATA = [
  { date: 'J-30', value: 78.4 },
  { date: 'J-25', value: 78.1 },
  { date: 'J-20', value: 77.9 },
  { date: 'J-15', value: 77.5 },
  { date: 'J-10', value: 77.2 },
  { date: 'J-5', value: 76.8 },
  { date: 'Auj.', value: 76.5 },
];

const CHARGE_DATA = [
  { date: 'S-6', value: 60 },
  { date: 'S-5', value: 65 },
  { date: 'S-4', value: 70 },
  { date: 'S-3', value: 72 },
  { date: 'S-2', value: 78 },
  { date: 'S-1', value: 82 },
  { date: 'Sem.', value: 85 },
];

const TOOLTIP = {
  background: '#131313',
  border: '1px solid rgba(51,51,51,0.6)',
  borderRadius: 10,
  fontSize: 12,
  boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
};

const RESSENTIS = [
  { date: 'Mer.', emoji: '🔥', label: 'Au top' },
  { date: 'Lun.', emoji: '😊', label: 'Bonne séance' },
  { date: 'Sam.', emoji: '😐', label: 'Difficile' },
  { date: 'Jeu.', emoji: '😊', label: 'Bonne séance' },
  { date: 'Mar.', emoji: '🔥', label: 'Au top' },
];

const OBJECTIFS = [
  { label: 'Perte de poids', target: 2, current: 1.9, unit: 'kg' },
  { label: 'Séances/sem.', target: 3, current: 3, unit: '' },
  { label: 'Fréquence cardio', target: 165, current: 158, unit: ' bpm' },
];

export default function SuiviPage() {
  const [period, setPeriod] = useState<'1m' | '3m' | '6m'>('1m');

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-[480px] px-4 py-6 md:max-w-[640px]"
    >
      <motion.header variants={itemVariants} className="mb-5">
        <span className="nk-eyebrow">Progression</span>
        <h1 className="nk-h1 text-text-primary mt-1.5 tracking-[-0.02em]">Mon suivi</h1>
      </motion.header>

      {/* Sélecteur période */}
      <motion.div
        variants={itemVariants}
        className="border-border/60 mb-5 flex overflow-hidden rounded-full border p-0.5"
      >
        {(['1m', '3m', '6m'] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            className={cn(
              'flex-1 rounded-full px-3 py-1.5 text-xs font-medium tracking-[0.04em] uppercase transition-colors',
              period === p
                ? 'bg-primary text-primary-foreground'
                : 'text-text-secondary hover:text-text-primary',
            )}
          >
            {p}
          </button>
        ))}
      </motion.div>

      {/* KPIs */}
      <motion.div variants={itemVariants} className="mb-5 grid grid-cols-2 gap-3">
        <Kpi label="Poids" value="76,5 kg" delta="-1,9 kg" deltaPositive />
        <Kpi label="Charge max" value="85 kg" delta="+25 %" deltaPositive />
      </motion.div>

      {/* Graphe poids */}
      <motion.section
        variants={itemVariants}
        className="bg-card border-border/40 mb-5 rounded-xl border p-5"
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="nk-label text-accent-muted">Poids (kg)</span>
          <span className="text-success inline-flex items-center gap-1 text-[12px] font-medium">
            <TrendingDown size={13} />
            -2,4 %
          </span>
        </div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={POIDS_DATA}>
              <defs>
                <linearGradient id="poidsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E5B547" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#E5B547" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fill: '#6B6B6B', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6B6B6B', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={36}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <Tooltip contentStyle={TOOLTIP} cursor={{ stroke: '#262626' }} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#E5B547"
                strokeWidth={2}
                fill="url(#poidsFill)"
                isAnimationActive
                animationDuration={1100}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      {/* Graphe charge max */}
      <motion.section
        variants={itemVariants}
        className="bg-card border-border/40 mb-5 rounded-xl border p-5"
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="nk-label text-accent-muted">Charge max squat (kg)</span>
          <span className="text-success inline-flex items-center gap-1 text-[12px] font-medium">
            <TrendingUp size={13} />
            +25 %
          </span>
        </div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={CHARGE_DATA}>
              <XAxis
                dataKey="date"
                tick={{ fill: '#6B6B6B', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6B6B6B', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip contentStyle={TOOLTIP} cursor={{ stroke: '#262626' }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#E5B547"
                strokeWidth={2}
                dot={{ fill: '#E5B547', r: 3 }}
                activeDot={{ r: 5 }}
                isAnimationActive
                animationDuration={1100}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      {/* Objectifs */}
      <motion.section
        variants={itemVariants}
        className="bg-card border-border/40 mb-5 rounded-xl border p-5"
      >
        <span className="nk-label text-accent-muted mb-4 block">Objectifs</span>
        <div className="flex flex-col gap-4">
          {OBJECTIFS.map((o) => {
            const pct = Math.min((o.current / o.target) * 100, 100);
            return (
              <div key={o.label}>
                <div className="mb-1.5 flex items-center justify-between text-[13px]">
                  <span className="text-text-primary">{o.label}</span>
                  <span className="text-text-tertiary tabular-nums">
                    {o.current}
                    {o.unit} / {o.target}
                    {o.unit}
                  </span>
                </div>
                <div className="bg-border/60 h-1.5 overflow-hidden rounded-full">
                  <div
                    className="bg-accent-gold h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Journal ressentis */}
      <motion.section
        variants={itemVariants}
        className="bg-card border-border/40 rounded-xl border p-5"
      >
        <span className="nk-label text-accent-muted mb-4 block">Journal ressentis</span>
        <ul className="flex flex-col gap-3">
          {RESSENTIS.map((r, i) => (
            <li
              key={i}
              className={cn(
                'flex items-center gap-3',
                i > 0 && 'border-border/40 -mt-1 border-t pt-3',
              )}
            >
              <span className="text-2xl">{r.emoji}</span>
              <div className="flex-1">
                <div className="text-text-primary text-[13.5px] font-medium">
                  {r.label}
                </div>
                <div className="text-text-tertiary text-[11px]">
                  {r.date} · séance Coach Sportif
                </div>
              </div>
            </li>
          ))}
        </ul>
      </motion.section>
    </motion.div>
  );
}

function Kpi({
  label,
  value,
  delta,
  deltaPositive,
}: {
  label: string;
  value: string;
  delta: string;
  deltaPositive?: boolean;
}) {
  return (
    <div className="bg-card border-border/40 rounded-xl border p-4">
      <span className="nk-label text-accent-muted">{label}</span>
      <div className="text-text-primary mt-2 text-[22px] font-bold tabular-nums">
        {value}
      </div>
      <div
        className={cn(
          'mt-1 inline-flex items-center gap-1 text-[11px]',
          deltaPositive ? 'text-success' : 'text-text-tertiary',
        )}
      >
        {deltaPositive ? <TrendingDown size={11} /> : <TrendingUp size={11} />}
        {delta}
      </div>
    </div>
  );
}
