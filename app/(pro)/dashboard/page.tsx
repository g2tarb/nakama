'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  Calendar,
  MessageCircle,
  Plus,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { useCountUp } from '@/hooks/use-count-up';
import { useUserStore } from '@/stores/user-store';
import { pros, seances, sportifs } from '@/lib/mock-data';
import { containerVariants, itemVariants } from '@/lib/animations';

// Données sparkline revenus (6 derniers mois)
const SPARKLINE_DATA = [
  { month: 'Nov', value: 1200 },
  { month: 'Déc', value: 1850 },
  { month: 'Jan', value: 1600 },
  { month: 'Fév', value: 2100 },
  { month: 'Mar', value: 2340 },
  { month: 'Avr', value: 2580 },
];

export default function DashboardPage() {
  const router = useRouter();
  const pro = useUserStore((s) => s.pro) ?? pros[4]!; // Julie Martin par défaut

  const revenuAnimated = useCountUp(2580, 1000);

  // Prochaines séances (futures)
  const prochainesSeances = useMemo(() => {
    const now = new Date();
    return seances
      .filter(
        (s) => s.proId === pro.id && new Date(s.date) > now && s.statut !== 'annulee',
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 4);
  }, [pro.id]);

  // Nouveaux clients (sportifs mock)
  const nouveauxClients = sportifs.slice(0, 3);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="px-4 py-6 lg:px-8"
    >
      {/* Header salutation */}
      <motion.div
        variants={itemVariants}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">
            Bonjour {pro.prenom} {String.fromCodePoint(0x1f44b)}
          </h1>
          <p className="text-text-secondary text-sm">Voici ton activité du moment</p>
        </div>
        <div className="relative size-10 overflow-hidden rounded-full">
          <Image
            src={pro.photo}
            alt={pro.prenom}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
      </motion.div>

      {/* Grille principale */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Bloc Revenus (8 cols desktop) */}
        <motion.div
          variants={itemVariants}
          className="border-border bg-surface rounded-xl border p-6 lg:col-span-8"
        >
          <p className="text-text-secondary text-sm">Revenus d&apos;avril</p>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="text-accent-gold text-4xl font-bold">{revenuAnimated}€</span>
            <span className="text-success flex items-center gap-1 text-sm font-medium">
              <ArrowUpRight size={14} />
              +12% vs mars
            </span>
          </div>
          <div className="mt-4 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SPARKLINE_DATA}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#C9B27A"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bloc Prochaines séances (4 cols desktop) */}
        <motion.div
          variants={itemVariants}
          className="border-border bg-surface rounded-xl border p-6 lg:col-span-4"
        >
          <p className="mb-4 text-sm font-semibold">Aujourd&apos;hui et demain</p>
          <div className="space-y-3">
            {prochainesSeances.length > 0 ? (
              prochainesSeances.map((seance) => {
                const client = sportifs.find((s) => s.id === seance.sportifId);
                const carte = pro.cartesServices.find(
                  (c) => c.id === seance.carteServiceId,
                );
                return (
                  <div key={seance.id} className="flex items-center gap-3">
                    <span className="text-accent-gold w-12 shrink-0 text-sm font-bold">
                      {format(new Date(seance.date), 'HH:mm')}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {client ? `${client.prenom} ${client.nom}` : 'Client'}
                      </p>
                      <p className="text-text-tertiary truncate text-xs">{carte?.nom}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-text-tertiary text-sm">Aucune séance à venir</p>
            )}
          </div>
          <button
            onClick={() => router.push('/agenda')}
            className="text-accent-gold mt-4 text-xs font-medium hover:underline"
          >
            Voir tout l&apos;agenda →
          </button>
        </motion.div>

        {/* Bloc Nouveaux clients (4 cols) */}
        <motion.div
          variants={itemVariants}
          className="border-border bg-surface rounded-xl border p-6 lg:col-span-4"
        >
          <p className="mb-4 text-sm font-semibold">Nouveaux clients cette semaine</p>
          <div className="flex items-center gap-2">
            {/* Avatar stack */}
            <div className="flex -space-x-2">
              {nouveauxClients.map((client) => (
                <div
                  key={client.id}
                  className="border-surface relative size-10 overflow-hidden rounded-full border-2"
                >
                  <Image
                    src={client.photo}
                    alt={client.prenom}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <span className="text-accent-gold ml-1 text-sm font-semibold">
              +{nouveauxClients.length}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 w-full gap-2"
            onClick={() => router.push('/clients')}
          >
            <MessageCircle size={14} />
            Envoyer un message de bienvenue
          </Button>
        </motion.div>

        {/* Grille Indicateurs (8 cols) */}
        <motion.div
          variants={itemVariants}
          className="grid gap-4 sm:grid-cols-3 lg:col-span-8"
        >
          {/* Taux remplissage */}
          <div className="border-border bg-surface flex flex-col items-center rounded-xl border p-5">
            <KpiGauge value={72} label="Remplissage" />
          </div>

          {/* NPS moyen */}
          <div className="border-border bg-surface flex flex-col items-center rounded-xl border p-5">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={
                    i < Math.round(pro.note) ? 'fill-warning text-warning' : 'text-border'
                  }
                />
              ))}
            </div>
            <span className="text-accent-gold mt-2 text-2xl font-bold">{pro.note}</span>
            <span className="text-text-tertiary text-xs">Note moyenne</span>
          </div>

          {/* Fidélité */}
          <div className="border-border bg-surface flex flex-col items-center rounded-xl border p-5">
            <span className="text-accent-gold text-3xl font-bold">86%</span>
            <span className="text-text-tertiary text-xs">Taux de fidélité</span>
            <span className="text-success mt-1 flex items-center gap-1 text-xs">
              <ArrowUpRight size={12} />
              +4%
            </span>
          </div>
        </motion.div>

        {/* Actions rapides (full width) */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-12"
        >
          {[
            {
              icon: Plus,
              label: 'Créer carte service',
              href: '/cartes-services',
            },
            {
              icon: Users,
              label: 'Inviter client',
              href: '/clients',
            },
            {
              icon: Calendar,
              label: 'Voir agenda',
              href: '/agenda',
            },
            {
              icon: TrendingUp,
              label: 'Voir revenus',
              href: '/revenus',
            },
          ].map(({ icon: Icon, label, href }) => (
            <button
              key={label}
              onClick={() => router.push(href)}
              className="border-border bg-surface hover:bg-surface-elevated flex items-center gap-3 rounded-xl border p-4 transition-colors"
            >
              <Icon size={20} className="text-accent-gold shrink-0" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

// Sous-composant jauge circulaire SVG
function KpiGauge({ value, label }: { value: number; label: string }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <>
      <div className="relative">
        <svg width={88} height={88} className="-rotate-90">
          <circle
            cx={44}
            cy={44}
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={6}
          />
          <motion.circle
            cx={44}
            cy={44}
            r={radius}
            fill="none"
            stroke="var(--color-accent-gold)"
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </svg>
        <span className="text-accent-gold absolute inset-0 flex items-center justify-center text-lg font-bold">
          {value}%
        </span>
      </div>
      <span className="text-text-tertiary mt-2 text-xs">{label}</span>
    </>
  );
}
