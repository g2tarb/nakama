'use client';

import { ArrowUpRight } from 'lucide-react';
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

const PIE_COLORS = ['#E5B547', '#4ADE80', '#60A5FA', '#F87171', '#FBBF24'];

export default function RevenusPage() {
  const pro = useUserStore((s) => s.pro) ?? pros[4]!;
  const ca = useCountUp(2580, 1000);

  const pieData = pro.cartesServices.map((c) => ({
    name: c.nom,
    value: c.caGenere,
  }));

  const clientsData = [
    { month: 'Nov', clients: 8 },
    { month: 'Déc', clients: 10 },
    { month: 'Jan', clients: 12 },
    { month: 'Fév', clients: 14 },
    { month: 'Mar', clients: 16 },
    { month: 'Avr', clients: 18 },
  ];

  const topClients = sportifs.slice(0, 3).map((s) => ({
    ...s,
    nbSeances: seances.filter((se) => se.sportifId === s.id).length,
    ca: seances
      .filter((se) => se.sportifId === s.id && se.statut === 'terminee')
      .reduce((sum, se) => sum + se.tarif, 0),
  }));

  return (
    <div className="px-4 py-6 lg:px-8">
      <h1 className="text-accent-gold mb-2 text-xl font-bold">Mes revenus</h1>
      <p className="text-text-secondary mb-8 text-sm">Avril 2026</p>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* CA principal */}
        <div className="border-border bg-surface rounded-xl border p-6 lg:col-span-5">
          <p className="text-text-secondary text-sm">Chiffre d&apos;affaires</p>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="text-accent-gold text-4xl font-bold">{ca}€</span>
            <span className="text-success flex items-center gap-1 text-sm font-medium">
              <ArrowUpRight size={14} />
              +10.3%
            </span>
          </div>
        </div>

        {/* Courbe CA */}
        <div className="border-border bg-surface rounded-xl border p-6 lg:col-span-7">
          <h3 className="mb-4 text-sm font-semibold">Évolution du CA (12 mois)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY_DATA}>
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
                <Tooltip
                  contentStyle={{
                    background: '#131313',
                    border: '1px solid #262626',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#E5B547"
                  strokeWidth={2}
                  dot={{ fill: '#E5B547', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Camembert */}
        <div className="border-border bg-surface rounded-xl border p-6 lg:col-span-5">
          <h3 className="mb-4 text-sm font-semibold">Répartition par service</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, i) => {
                    const color = PIE_COLORS[i % PIE_COLORS.length] ?? '#E5B547';
                    return <Cell key={i} fill={color} />;
                  })}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#131313',
                    border: '1px solid #262626',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-3">
            {pieData.map((d, i) => (
              <span
                key={d.name}
                className="text-text-secondary flex items-center gap-1.5 text-xs"
              >
                <span
                  className="size-2 rounded-full"
                  style={{
                    background: PIE_COLORS[i % PIE_COLORS.length],
                  }}
                />
                {d.name}
              </span>
            ))}
          </div>
        </div>

        {/* Clients actifs */}
        <div className="border-border bg-surface rounded-xl border p-6 lg:col-span-7">
          <h3 className="mb-4 text-sm font-semibold">Clients actifs</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clientsData}>
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
                  contentStyle={{
                    background: '#131313',
                    border: '1px solid #262626',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="clients" fill="#E5B547" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top clients */}
        <div className="border-border bg-surface rounded-xl border p-6 lg:col-span-12">
          <h3 className="mb-4 text-sm font-semibold">Top clients</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-border text-text-tertiary border-b text-left text-xs">
                  <th className="pb-2 font-medium">Client</th>
                  <th className="pb-2 font-medium">Séances</th>
                  <th className="pb-2 text-right font-medium">CA</th>
                </tr>
              </thead>
              <tbody>
                {topClients.map((client) => (
                  <tr key={client.id} className="border-border/50 border-b">
                    <td className="py-3 font-medium">
                      {client.prenom} {client.nom}
                    </td>
                    <td className="text-text-secondary py-3">{client.nbSeances}</td>
                    <td className="text-accent-gold py-3 text-right font-semibold">
                      {client.ca}€
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
