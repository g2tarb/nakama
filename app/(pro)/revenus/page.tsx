'use client';

import { TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

import { useUserStore } from '@/stores/user-store';
import { pros, sportifs, seances } from '@/lib/mock-data';
import { useCountUp } from '@/hooks/use-count-up';

const MONTHLY_DATA = [
  { month: 'Sep', value: 800 },
  { month: 'Oct', value: 1050 },
  { month: 'Nov', value: 1200 },
  { month: 'Déc', value: 1850 },
  { month: 'Jan', value: 1600 },
  { month: 'Fév', value: 2100 },
  { month: 'Mar', value: 2340 },
  { month: 'Avr', value: 2580 },
];

const CLIENTS_DATA = [
  { month: 'Nov', clients: 8 },
  { month: 'Déc', clients: 10 },
  { month: 'Jan', clients: 12 },
  { month: 'Fév', clients: 14 },
  { month: 'Mar', clients: 16 },
  { month: 'Avr', clients: 18 },
];

const PIE_COLORS = ['#E5B547', '#4ADE80', '#60A5FA', '#F87171', '#FBBF24'];

const TOOLTIP_STYLE = {
  background: '#131313',
  border: '1px solid rgba(51,51,51,0.6)',
  borderRadius: 10,
  fontSize: 12,
  boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
};

export default function RevenusPage() {
  const pro = useUserStore((s) => s.pro) ?? pros[4]!;
  const ca = useCountUp(2580, 1100);

  const pieData = pro.cartesServices.map((c) => ({
    name: c.nom,
    value: c.caGenere,
  }));

  const topClients = sportifs
    .slice(0, 5)
    .map((s) => ({
      ...s,
      nbSeances: seances.filter((se) => se.sportifId === s.id && se.statut === 'terminee')
        .length,
      ca: seances
        .filter((se) => se.sportifId === s.id && se.statut === 'terminee')
        .reduce((sum, se) => sum + se.tarif, 0),
    }))
    .sort((a, b) => b.ca - a.ca);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 lg:px-10 lg:py-8">
      <header className="mb-6">
        <span className="nk-eyebrow">Avril 2026</span>
        <h1 className="nk-h1 text-text-primary mt-1.5 tracking-[-0.02em]">Mes revenus</h1>
      </header>

      <div className="grid gap-4 lg:grid-cols-12">
        <section className="bg-card border-border/40 rounded-xl border p-5 lg:col-span-5 lg:p-6">
          <span className="nk-label text-accent-muted">Chiffre d’affaires</span>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-accent-gold text-glow-or text-[40px] font-bold tracking-[-0.02em] tabular-nums">
              {ca.toLocaleString('fr-FR')} €
            </span>
            <span className="text-success inline-flex items-center gap-1 text-sm font-medium">
              <TrendingUp size={13} />
              +10,3 % vs mars
            </span>
          </div>
          <div className="border-border/40 mt-5 grid grid-cols-3 gap-3 border-t pt-4">
            <Stat label="Séances" value="32" />
            <Stat label="Tarif moyen" value="80 €" />
            <Stat label="Clients" value="18" accent />
          </div>
        </section>

        <section className="bg-card border-border/40 rounded-xl border p-5 lg:col-span-7 lg:p-6">
          <h3 className="nk-label text-accent-muted mb-4">Évolution sur 8 mois</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={MONTHLY_DATA}
                margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
              >
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#6B6B6B', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#6B6B6B', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: '#262626' }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#E5B547"
                  strokeWidth={2}
                  dot={{ fill: '#E5B547', r: 3 }}
                  activeDot={{ r: 5, fill: '#E5B547' }}
                  isAnimationActive
                  animationDuration={1100}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-card border-border/40 rounded-xl border p-5 lg:col-span-5 lg:p-6">
          <h3 className="nk-label text-accent-muted mb-4">Répartition par service</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                  isAnimationActive
                  animationDuration={900}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
            {pieData.map((d, i) => (
              <span
                key={d.name}
                className="text-text-secondary inline-flex items-center gap-1.5 text-[12px]"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                {d.name}
              </span>
            ))}
          </div>
        </section>

        <section className="bg-card border-border/40 rounded-xl border p-5 lg:col-span-7 lg:p-6">
          <h3 className="nk-label text-accent-muted mb-4">Clients actifs</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={CLIENTS_DATA}
                margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
              >
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#6B6B6B', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#6B6B6B', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  cursor={{ fill: 'rgba(229,181,71,0.06)' }}
                />
                <Bar
                  dataKey="clients"
                  fill="#E5B547"
                  radius={[6, 6, 0, 0]}
                  isAnimationActive
                  animationDuration={900}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-card border-border/40 rounded-xl border p-5 lg:col-span-12 lg:p-6">
          <h3 className="nk-label text-accent-muted mb-4">Top clients</h3>
          <ul className="flex flex-col">
            {topClients.map((client, i) => (
              <li
                key={client.id}
                className={
                  'grid grid-cols-[24px_1fr_auto_auto] items-center gap-4 py-3 ' +
                  (i > 0 ? 'border-border/40 border-t' : '')
                }
              >
                <span className="text-text-tertiary nk-mono text-xs font-semibold tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <p className="text-text-primary truncate text-sm font-medium">
                    {client.prenom} {client.nom}
                  </p>
                </div>
                <span className="text-text-secondary text-xs tabular-nums">
                  {client.nbSeances} séance{client.nbSeances > 1 ? 's' : ''}
                </span>
                <span className="text-accent-gold text-sm font-bold tabular-nums">
                  {client.ca.toLocaleString('fr-FR')} €
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-text-tertiary text-[11px]">{label}</span>
      <span
        className={
          'mt-0.5 text-[16px] font-bold tabular-nums ' +
          (accent ? 'text-accent-gold' : 'text-text-primary')
        }
      >
        {value}
      </span>
    </div>
  );
}
