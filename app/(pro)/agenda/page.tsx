'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import {
  format,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  startOfDay,
  addDays,
  isSameDay,
  isSameMonth,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  eachDayOfInterval,
} from 'date-fns';
import { fr } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { seances, sportifs, pros } from '@/lib/mock-data';
import { useUserStore } from '@/stores/user-store';

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6);

type View = 'semaine' | 'mois';

interface BlockedSlot {
  id: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  raison: string;
}

export default function AgendaPage() {
  const pro = useUserStore((s) => s.pro) ?? pros[4]!;
  const [view, setView] = useState<View>('semaine');
  const [refDate, setRefDate] = useState(() => startOfDay(new Date()));
  const [blockOpen, setBlockOpen] = useState(false);
  const [blocks, setBlocks] = useState<BlockedSlot[]>([]);
  const [blockForm, setBlockForm] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    heureDebut: '12:00',
    heureFin: '14:00',
    raison: '',
  });

  const weekStart = useMemo(() => startOfWeek(refDate, { weekStartsOn: 1 }), [refDate]);
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const monthStart = startOfMonth(refDate);
  const monthEnd = endOfMonth(refDate);
  const monthGridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const monthGridEnd = addDays(startOfWeek(monthEnd, { weekStartsOn: 1 }), 34);
  const monthDays = useMemo(
    () => eachDayOfInterval({ start: monthGridStart, end: monthGridEnd }),
    [monthGridStart, monthGridEnd],
  );

  const proSeances = useMemo(
    () => seances.filter((s) => s.proId === pro.id && s.statut !== 'annulee'),
    [pro.id],
  );

  function navigatePrev() {
    setRefDate(view === 'semaine' ? subWeeks(refDate, 1) : subMonths(refDate, 1));
  }
  function navigateNext() {
    setRefDate(view === 'semaine' ? addWeeks(refDate, 1) : addMonths(refDate, 1));
  }
  function goToday() {
    setRefDate(startOfDay(new Date()));
  }

  function handleAddBlock() {
    if (!blockForm.raison.trim()) {
      alert('Indique une raison pour le blocage.');
      return;
    }
    setBlocks((prev) => [
      ...prev,
      {
        id: `block-${Date.now()}`,
        date: blockForm.date,
        heureDebut: blockForm.heureDebut,
        heureFin: blockForm.heureFin,
        raison: blockForm.raison.trim(),
      },
    ]);
    setBlockForm({ ...blockForm, raison: '' });
    setBlockOpen(false);
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] px-4 py-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-accent-gold text-xl font-bold">Agenda</h1>
          <button
            onClick={goToday}
            className="border-border text-text-secondary hover:bg-surface rounded-lg border px-3 py-1 text-xs font-medium"
          >
            Aujourd&apos;hui
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Semaine/Mois */}
          <div className="border-border bg-surface flex overflow-hidden rounded-lg border">
            {(['semaine', 'mois'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                  view === v
                    ? 'bg-accent-gold text-background'
                    : 'text-text-secondary hover:text-text-primary',
                )}
              >
                {v}
              </button>
            ))}
          </div>

          <button
            onClick={navigatePrev}
            className="border-border hover:bg-surface rounded-lg border p-1.5"
            aria-label="Précédent"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="min-w-[140px] text-center text-sm font-medium">
            {view === 'semaine'
              ? `${format(weekDays[0]!, 'd MMM', { locale: fr })} - ${format(weekDays[6]!, 'd MMM yyyy', { locale: fr })}`
              : format(refDate, 'MMMM yyyy', { locale: fr })}
          </span>
          <button
            onClick={navigateNext}
            className="border-border hover:bg-surface rounded-lg border p-1.5"
            aria-label="Suivant"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Vue Semaine */}
      {view === 'semaine' && (
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-px">
              <div />
              {weekDays.map((day) => (
                <div
                  key={day.toISOString()}
                  className={cn(
                    'py-2 text-center text-xs font-medium',
                    isSameDay(day, new Date())
                      ? 'text-accent-gold'
                      : 'text-text-secondary',
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
                    const dayBlocks = blocks.filter(
                      (b) =>
                        b.date === format(day, 'yyyy-MM-dd') &&
                        parseInt(b.heureDebut.slice(0, 2), 10) <= hour &&
                        parseInt(b.heureFin.slice(0, 2), 10) > hour,
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
                        {dayBlocks.map((b) => (
                          <div
                            key={b.id}
                            title={b.raison}
                            className="bg-text-tertiary/30 text-text-secondary absolute inset-x-0.5 top-0.5 rounded px-1 py-0.5 text-[10px] leading-tight"
                          >
                            🚫 {b.raison}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Vue Mois */}
      {view === 'mois' && (
        <div>
          <div className="grid grid-cols-7 gap-px text-center text-xs font-medium uppercase">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d) => (
              <div key={d} className="text-text-secondary py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="border-border grid grid-cols-7 gap-px border-t">
            {monthDays.map((day) => {
              const daySeances = proSeances.filter((s) =>
                isSameDay(new Date(s.date), day),
              );
              const dayBlocks = blocks.filter(
                (b) => b.date === format(day, 'yyyy-MM-dd'),
              );
              const inMonth = isSameMonth(day, refDate);
              const today = isSameDay(day, new Date());
              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    'border-border min-h-[88px] border-b border-l p-1.5 transition-colors',
                    !inMonth && 'opacity-40',
                    today && 'bg-accent-gold/5',
                  )}
                >
                  <div
                    className={cn(
                      'inline-flex size-6 items-center justify-center rounded-full text-xs',
                      today
                        ? 'bg-accent-gold text-background font-bold'
                        : 'text-text-secondary',
                    )}
                  >
                    {format(day, 'd')}
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {daySeances.slice(0, 3).map((s) => {
                      const client = sportifs.find((c) => c.id === s.sportifId);
                      return (
                        <div
                          key={s.id}
                          className="bg-accent-gold/15 text-accent-gold truncate rounded px-1 text-[10px] leading-tight"
                        >
                          {format(new Date(s.date), 'HH:mm')} {client?.prenom ?? ''}
                        </div>
                      );
                    })}
                    {daySeances.length > 3 && (
                      <div className="text-text-tertiary text-[10px]">
                        +{daySeances.length - 3} autre
                        {daySeances.length - 3 > 1 ? 's' : ''}
                      </div>
                    )}
                    {dayBlocks.length > 0 && (
                      <div className="text-text-tertiary text-[10px]">
                        🚫 {dayBlocks.length} blocage
                        {dayBlocks.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FAB Bloquer plage */}
      <button
        onClick={() => setBlockOpen(true)}
        className="bg-accent-gold text-background fixed right-6 bottom-24 z-40 flex h-14 items-center gap-2 rounded-full px-5 shadow-lg transition-transform hover:scale-105 lg:bottom-8"
        aria-label="Bloquer une plage horaire"
      >
        <Plus size={20} />
        <span className="text-sm font-semibold">Bloquer une plage</span>
      </button>

      {/* Dialog Bloquer plage */}
      <Dialog open={blockOpen} onOpenChange={setBlockOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bloquer une plage horaire</DialogTitle>
            <DialogDescription>
              Indisponible pour cette plage — aucun client ne pourra réserver.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-text-secondary mb-1.5 block text-xs font-medium">
                Date
              </label>
              <input
                type="date"
                value={blockForm.date}
                onChange={(e) => setBlockForm({ ...blockForm, date: e.target.value })}
                className="border-border bg-surface focus:border-accent-gold h-10 w-full rounded-[10px] border px-3 text-sm focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-text-secondary mb-1.5 block text-xs font-medium">
                  Début
                </label>
                <input
                  type="time"
                  value={blockForm.heureDebut}
                  onChange={(e) =>
                    setBlockForm({ ...blockForm, heureDebut: e.target.value })
                  }
                  className="border-border bg-surface focus:border-accent-gold h-10 w-full rounded-[10px] border px-3 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="text-text-secondary mb-1.5 block text-xs font-medium">
                  Fin
                </label>
                <input
                  type="time"
                  value={blockForm.heureFin}
                  onChange={(e) =>
                    setBlockForm({ ...blockForm, heureFin: e.target.value })
                  }
                  className="border-border bg-surface focus:border-accent-gold h-10 w-full rounded-[10px] border px-3 text-sm focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-text-secondary mb-1.5 block text-xs font-medium">
                Raison
              </label>
              <input
                type="text"
                value={blockForm.raison}
                onChange={(e) => setBlockForm({ ...blockForm, raison: e.target.value })}
                placeholder="Ex. Vacances, formation, RDV perso…"
                className="border-border bg-surface focus:border-accent-gold h-10 w-full rounded-[10px] border px-3 text-sm focus:outline-none"
              />
            </div>
            {blocks.length > 0 && (
              <div className="border-border border-t pt-3">
                <p className="text-text-secondary mb-2 text-xs font-medium">
                  Blocages actifs ({blocks.length})
                </p>
                <ul className="max-h-32 space-y-1.5 overflow-y-auto">
                  {blocks.map((b) => (
                    <li
                      key={b.id}
                      className="bg-surface flex items-center justify-between rounded-md px-2 py-1.5 text-xs"
                    >
                      <span>
                        {format(new Date(b.date), 'd MMM', { locale: fr })} {b.heureDebut}
                        -{b.heureFin} · {b.raison}
                      </span>
                      <button
                        onClick={() =>
                          setBlocks((prev) => prev.filter((x) => x.id !== b.id))
                        }
                        className="text-text-tertiary hover:text-danger"
                      >
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddBlock}>Bloquer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
