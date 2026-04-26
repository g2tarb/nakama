'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { fr } from 'date-fns/locale';

import { cn } from '@/lib/utils';
import { seances, sportifs } from '@/lib/mock-data';
import { useUserStore } from '@/stores/user-store';
import { pros } from '@/lib/mock-data';

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6h-22h

export default function AgendaPage() {
  const pro = useUserStore((s) => s.pro) ?? pros[4]!;
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const proSeances = useMemo(
    () => seances.filter((s) => s.proId === pro.id && s.statut !== 'annulee'),
    [pro.id],
  );

  return (
    <div className="px-4 py-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-accent-gold text-xl font-bold">Agenda</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekStart(subWeeks(weekStart, 1))}
            className="border-border hover:bg-surface rounded-lg border p-1.5"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-medium">
            {format(weekDays[0]!, 'd MMM', { locale: fr })} -{' '}
            {format(weekDays[6]!, 'd MMM yyyy', { locale: fr })}
          </span>
          <button
            onClick={() => setWeekStart(addWeeks(weekStart, 1))}
            className="border-border hover:bg-surface rounded-lg border p-1.5"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Vue semaine */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* En-têtes jours */}
          <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-px">
            <div />
            {weekDays.map((day) => (
              <div
                key={day.toISOString()}
                className={cn(
                  'py-2 text-center text-xs font-medium',
                  isSameDay(day, new Date()) ? 'text-accent-gold' : 'text-text-secondary',
                )}
              >
                <div className="uppercase">{format(day, 'EEE', { locale: fr })}</div>
                <div
                  className={cn(
                    'mt-1 inline-flex size-7 items-center justify-center rounded-full text-sm',
                    isSameDay(day, new Date()) &&
                      'bg-accent-gold text-background font-bold',
                  )}
                >
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>

          {/* Grille heures */}
          <div className="border-border grid grid-cols-[60px_repeat(7,1fr)] gap-px border-t">
            {HOURS.map((hour) => (
              <div key={hour} className="contents">
                <div className="text-text-tertiary flex h-12 items-start justify-end pt-0.5 pr-2 text-[10px]">
                  {hour}:00
                </div>
                {weekDays.map((day) => {
                  const daySeances = proSeances.filter(
                    (s) =>
                      isSameDay(new Date(s.date), day) &&
                      new Date(s.date).getHours() === hour,
                  );
                  return (
                    <div
                      key={`${day.toISOString()}-${hour}`}
                      className="border-border relative h-12 border-b border-l"
                    >
                      {daySeances.map((seance) => {
                        const client = sportifs.find((s) => s.id === seance.sportifId);
                        return (
                          <div
                            key={seance.id}
                            className="bg-accent-gold/20 text-accent-gold absolute inset-x-0.5 top-0.5 rounded px-1 py-0.5 text-[10px] leading-tight"
                          >
                            {client?.prenom ?? 'Client'}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
