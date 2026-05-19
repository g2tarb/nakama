'use client';

import { use, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Calendar, MessageCircle, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  sportifs,
  seances,
  healthNotes,
  progressionData,
  coachNotes,
} from '@/lib/mock-data';
import { RESSENTI_EMOJIS } from '@/lib/constants';
import { formatDate, formatDuration, formatPrice } from '@/lib/formatters';

type Tab = 'sante' | 'progression' | 'notes' | 'historique';

const TABS: { value: Tab; label: string }[] = [
  { value: 'sante', label: 'Santé' },
  { value: 'progression', label: 'Progression' },
  { value: 'notes', label: 'Notes' },
  { value: 'historique', label: 'Historique' },
];

const ALERTE_STYLES = {
  rouge: {
    bg: 'bg-danger/10',
    border: 'border-danger/30',
    dot: 'bg-danger',
  },
  jaune: {
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    dot: 'bg-warning',
  },
  vert: {
    bg: 'bg-success/10',
    border: 'border-success/30',
    dot: 'bg-success',
  },
};

export default function FicheAthletePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('sante');

  const sportif = sportifs.find((s) => s.id === id);
  const clientSeances = useMemo(
    () =>
      seances
        .filter((s) => s.sportifId === id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [id],
  );
  const notes = healthNotes[id] ?? [];
  const notesCoach = coachNotes[id] ?? [];
  const progression = useMemo(() => progressionData[id] ?? [], [id]);

  const poidsData = useMemo(
    () =>
      progression
        .filter((p) => p.metrique === 'poids')
        .map((p) => ({
          date: format(new Date(p.date), 'd MMM', { locale: fr }),
          value: p.valeur,
        })),
    [progression],
  );

  const chargeData = useMemo(
    () =>
      progression
        .filter((p) => p.metrique === 'charge_max')
        .map((p) => ({
          date: format(new Date(p.date), 'd MMM', { locale: fr }),
          value: p.valeur,
        })),
    [progression],
  );

  if (!sportif) {
    return (
      <div className="flex flex-col items-center py-20">
        <p className="text-text-secondary">Client introuvable</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          Retour
        </Button>
      </div>
    );
  }

  const nbSeances = clientSeances.length;

  return (
    <div className="px-4 py-6 lg:px-8">
      {/* Retour */}
      <button
        onClick={() => router.back()}
        className="text-text-secondary hover:text-text-primary mb-6 flex items-center gap-2 text-sm"
      >
        <ArrowLeft size={18} />
        Mes clients
      </button>

      {/* En-tête */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-full">
            <Image
              src={sportif.photo}
              alt={sportif.prenom}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold">
              {sportif.prenom} {sportif.nom}
            </h1>
            <p className="text-text-secondary text-sm">
              {sportif.age} ans · {sportif.sports[0]} ·{' '}
              {sportif.clientDepuis
                ? `Client depuis ${formatDate(sportif.clientDepuis)}`
                : ''}{' '}
              · {nbSeances} séance{nbSeances > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <MessageCircle size={14} />
            Contacter
          </Button>
          <Button size="sm" className="gap-1.5">
            <Calendar size={14} />
            Planifier
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-border mt-6 flex gap-1 border-b">
        {TABS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={cn(
              'relative px-4 py-2.5 text-sm font-medium transition-colors',
              tab === value
                ? 'text-accent-gold'
                : 'text-text-tertiary hover:text-text-secondary',
            )}
          >
            {label}
            {tab === value && (
              <motion.div
                layoutId="tab-underline"
                className="bg-accent-gold absolute inset-x-0 -bottom-px h-0.5"
                transition={{ duration: 0.25 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Contenu onglets */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="mt-6"
        >
          {/* TAB SANTÉ */}
          {tab === 'sante' && (
            <div className="space-y-3">
              {notes.map((note, i) => {
                const style = ALERTE_STYLES[note.niveau];
                return (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={cn('rounded-xl border p-4', style.bg, style.border)}
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn('size-2.5 rounded-full', style.dot)} />
                      <h3 className="font-semibold">{note.titre}</h3>
                    </div>
                    <p className="text-text-secondary mt-1.5 text-sm">
                      {note.description}
                    </p>
                    <p className="text-text-tertiary mt-2 text-xs">
                      Ajouté le {formatDate(note.dateAjout)}
                    </p>
                  </motion.div>
                );
              })}
              <Button variant="outline" className="mt-4 w-full gap-2">
                <Plus size={16} />
                Ajouter une info santé
              </Button>
            </div>
          )}

          {/* TAB PROGRESSION */}
          {tab === 'progression' && (
            <div className="space-y-6">
              {/* Chiffres clés */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {poidsData.length > 0 && (
                  <div className="border-border bg-surface rounded-xl border p-4">
                    <p className="text-text-tertiary text-xs">Poids actuel</p>
                    <p className="text-accent-gold mt-1 text-2xl font-bold">
                      {poidsData[poidsData.length - 1]?.value} kg
                    </p>
                    <p className="text-success mt-0.5 text-xs">
                      -
                      {(
                        (poidsData[0]?.value ?? 0) -
                        (poidsData[poidsData.length - 1]?.value ?? 0)
                      ).toFixed(1)}{' '}
                      kg
                    </p>
                  </div>
                )}
                {chargeData.length > 0 && (
                  <div className="border-border bg-surface rounded-xl border p-4">
                    <p className="text-text-tertiary text-xs">Charge max</p>
                    <p className="text-accent-gold mt-1 text-2xl font-bold">
                      {chargeData[chargeData.length - 1]?.value} kg
                    </p>
                    <p className="text-success mt-0.5 text-xs">
                      +
                      {(
                        (chargeData[chargeData.length - 1]?.value ?? 0) -
                        (chargeData[0]?.value ?? 0)
                      ).toFixed(0)}{' '}
                      kg
                    </p>
                  </div>
                )}
                <div className="border-border bg-surface rounded-xl border p-4">
                  <p className="text-text-tertiary text-xs">Séances</p>
                  <p className="text-accent-gold mt-1 text-2xl font-bold">{nbSeances}</p>
                </div>
              </div>

              {/* Graphique poids */}
              {poidsData.length > 0 && (
                <div className="border-border bg-surface rounded-xl border p-4">
                  <h3 className="mb-4 text-sm font-semibold">Évolution du poids</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={poidsData}>
                        <XAxis
                          dataKey="date"
                          tick={{ fill: '#6B6B6B', fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          domain={['auto', 'auto']}
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
                          dot={{ fill: '#E5B547', r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Graphique charge */}
              {chargeData.length > 0 && (
                <div className="border-border bg-surface rounded-xl border p-4">
                  <h3 className="mb-4 text-sm font-semibold">
                    Évolution charge max (kg)
                  </h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chargeData}>
                        <XAxis
                          dataKey="date"
                          tick={{ fill: '#6B6B6B', fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          domain={['auto', 'auto']}
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
                          stroke="#4ADE80"
                          strokeWidth={2}
                          dot={{ fill: '#4ADE80', r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB NOTES */}
          {tab === 'notes' && (
            <div className="space-y-3">
              {notesCoach.map((note) => (
                <div
                  key={note.id}
                  className="border-border bg-surface rounded-xl border p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-text-tertiary text-xs">
                      {format(new Date(note.date), "d MMMM yyyy 'à' HH:mm", {
                        locale: fr,
                      })}
                    </p>
                    <Badge className="bg-warning/10 text-warning text-xs">Privé</Badge>
                  </div>
                  <p className="text-text-secondary mt-2 text-sm leading-relaxed">
                    {note.contenu}
                  </p>
                </div>
              ))}
              {notesCoach.length === 0 && (
                <p className="text-text-tertiary py-8 text-center text-sm">
                  Aucune note pour ce client
                </p>
              )}
              <Button variant="outline" className="mt-2 w-full gap-2">
                <Plus size={16} />
                Nouvelle note
              </Button>
            </div>
          )}

          {/* TAB HISTORIQUE */}
          {tab === 'historique' && (
            <div className="relative space-y-0">
              {/* Timeline verticale */}
              <div className="bg-border absolute top-2 bottom-2 left-4 w-px" />

              {clientSeances.map((seance) => {
                const ressenti = seance.ressentiClient
                  ? RESSENTI_EMOJIS[seance.ressentiClient]
                  : null;
                return (
                  <div key={seance.id} className="relative pb-6 pl-10">
                    {/* Point timeline */}
                    <div
                      className={cn(
                        'border-background absolute top-1.5 left-3 size-3 rounded-full border-2',
                        seance.statut === 'terminee'
                          ? 'bg-success'
                          : seance.statut === 'annulee'
                            ? 'bg-text-tertiary'
                            : 'bg-accent-gold',
                      )}
                    />

                    <div className="border-border bg-surface rounded-xl border p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {format(new Date(seance.date), "d MMM yyyy 'à' HH:mm", {
                            locale: fr,
                          })}
                        </p>
                        {ressenti && <span className="text-lg">{ressenti}</span>}
                      </div>
                      <p className="text-text-tertiary mt-1 text-xs">
                        {seance.lieu} · {formatDuration(seance.dureeMinutes)} ·{' '}
                        {formatPrice(seance.tarif)}
                      </p>

                      {seance.chargePercue != null && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-text-tertiary">Charge perçue</span>
                            <span>{seance.chargePercue}/10</span>
                          </div>
                          <div className="bg-border mt-1 h-1.5 overflow-hidden rounded-full">
                            <div
                              className="bg-accent-gold h-full rounded-full"
                              style={{
                                width: `${seance.chargePercue * 10}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {seance.compteRenduCoach && (
                        <p className="text-text-secondary mt-3 text-sm italic">
                          {seance.compteRenduCoach}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              {clientSeances.length === 0 && (
                <p className="text-text-tertiary py-8 text-center text-sm">
                  Aucune séance avec ce client
                </p>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
