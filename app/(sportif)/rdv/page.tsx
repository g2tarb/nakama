'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Calendar, CalendarDays, Clock, List, MapPin } from 'lucide-react';
import {
  format,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
} from 'date-fns';
import { fr } from 'date-fns/locale';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { seances, pros } from '@/lib/mock-data';

type ViewMode = 'liste' | 'calendrier';

const STATUT_BADGE: Record<string, { label: string; className: string }> = {
  confirmee: {
    label: 'Confirmé',
    className: 'bg-accent-gold/10 text-accent-gold',
  },
  en_attente: {
    label: 'En attente',
    className: 'bg-warning/10 text-warning',
  },
  annulee: { label: 'Annulé', className: 'bg-muted text-text-tertiary' },
  terminee: { label: 'Terminé', className: 'bg-success/10 text-success' },
};

export default function RdvPage() {
  const [view, setView] = useState<ViewMode>('liste');
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  const sortedSeances = useMemo(
    () =>
      [...seances].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [],
  );

  // Groupe par jour
  const groupedByDay = useMemo(() => {
    const groups = new Map<string, typeof seances>();
    for (const s of sortedSeances) {
      const key = format(new Date(s.date), 'yyyy-MM-dd');
      const group = groups.get(key) ?? [];
      group.push(s);
      groups.set(key, group);
    }
    return groups;
  }, [sortedSeances]);

  // Jours du mois pour le calendrier
  const monthDays = useMemo(() => {
    const start = startOfMonth(selectedDay);
    const end = endOfMonth(selectedDay);
    return eachDayOfInterval({ start, end });
  }, [selectedDay]);

  const seancesOfDay = useMemo(
    () => sortedSeances.filter((s) => isSameDay(new Date(s.date), selectedDay)),
    [sortedSeances, selectedDay],
  );

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-accent-gold text-xl font-bold">Mes rendez-vous</h1>
        <div className="border-border flex overflow-hidden rounded-lg border">
          <button
            onClick={() => setView('liste')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors',
              view === 'liste' ? 'bg-accent-gold text-background' : 'text-text-secondary',
            )}
          >
            <List size={14} />
            Liste
          </button>
          <button
            onClick={() => setView('calendrier')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors',
              view === 'calendrier'
                ? 'bg-accent-gold text-background'
                : 'text-text-secondary',
            )}
          >
            <CalendarDays size={14} />
            Calendrier
          </button>
        </div>
      </div>

      {/* Vue Liste */}
      {view === 'liste' && (
        <div className="space-y-6">
          {Array.from(groupedByDay.entries()).map(([dateKey, daySeances]) => (
            <div key={dateKey}>
              <h2 className="text-text-secondary mb-3 text-sm font-semibold">
                {format(new Date(dateKey), 'EEEE d MMMM', { locale: fr })}
              </h2>
              <div className="space-y-3">
                {daySeances.map((seance) => {
                  const pro = pros.find((p) => p.id === seance.proId);
                  const badge = STATUT_BADGE[seance.statut];
                  const carte = pro?.cartesServices.find(
                    (c) => c.id === seance.carteServiceId,
                  );
                  return (
                    <div
                      key={seance.id}
                      className="border-border bg-surface rounded-xl border p-4"
                    >
                      <div className="flex gap-3">
                        {pro && (
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
                            <Image
                              src={pro.photo}
                              alt={pro.prenom}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold">
                                {pro ? `${pro.prenom} ${pro.nom}` : 'Pro inconnu'}
                              </p>
                            </div>
                            {badge && (
                              <Badge className={badge.className}>{badge.label}</Badge>
                            )}
                          </div>
                          <div className="text-text-secondary mt-2 space-y-1 text-xs">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={12} />
                              {format(new Date(seance.date), 'd MMM yyyy', {
                                locale: fr,
                              })}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock size={12} />
                              {format(new Date(seance.date), 'HH:mm')} ·{' '}
                              {seance.dureeMinutes} min
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin size={12} />
                              {seance.lieu}
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-text-tertiary text-xs">
                              {carte?.nom}
                            </span>
                            <span className="text-sm font-semibold">{seance.tarif}€</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vue Calendrier */}
      {view === 'calendrier' && (
        <div>
          <h2 className="mb-4 text-center font-semibold capitalize">
            {format(selectedDay, 'MMMM yyyy', { locale: fr })}
          </h2>

          {/* Grille jours de la semaine */}
          <div className="text-text-tertiary mb-2 grid grid-cols-7 gap-1 text-center text-xs">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          {/* Grille mois */}
          <div className="grid grid-cols-7 gap-1">
            {/* Cellules vides pour l'offset */}
            {Array.from({ length: (getDay(monthDays[0]!) + 6) % 7 }, (_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {monthDays.map((day) => {
              const hasSeance = sortedSeances.some((s) =>
                isSameDay(new Date(s.date), day),
              );
              const isSelected = isSameDay(day, selectedDay);
              const isToday = isSameDay(day, new Date());
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    'relative flex h-10 items-center justify-center rounded-lg text-sm transition-colors',
                    isSelected && 'ring-accent-gold ring-2',
                    isToday && !isSelected && 'text-accent-gold font-bold',
                    !isSelected && 'hover:bg-surface',
                  )}
                >
                  {format(day, 'd')}
                  {hasSeance && (
                    <span className="bg-success absolute bottom-1 size-1.5 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Séances du jour sélectionné */}
          <div className="mt-6">
            <h3 className="text-text-secondary mb-3 text-sm font-semibold">
              {format(selectedDay, 'EEEE d MMMM', { locale: fr })}
            </h3>
            {seancesOfDay.length === 0 ? (
              <p className="text-text-tertiary py-8 text-center text-sm">
                Aucun rendez-vous ce jour
              </p>
            ) : (
              <div className="space-y-3">
                {seancesOfDay.map((seance) => {
                  const pro = pros.find((p) => p.id === seance.proId);
                  return (
                    <div
                      key={seance.id}
                      className="border-border bg-surface flex items-center gap-3 rounded-xl border p-3"
                    >
                      <span className="text-accent-gold text-sm font-bold">
                        {format(new Date(seance.date), 'HH:mm')}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {pro ? `${pro.prenom} ${pro.nom}` : 'Pro inconnu'}
                        </p>
                        <p className="text-text-tertiary truncate text-xs">
                          {seance.lieu}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
