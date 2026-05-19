'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import {
  format,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  startOfDay,
  addDays,
  subDays,
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
import { formatPrice } from '@/lib/formatters';
import { seances, sportifs, pros } from '@/lib/mock-data';
import { useUserStore } from '@/stores/user-store';
import { useMobile } from '@/hooks/use-mobile';

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6);

type View = 'jour' | 'semaine' | 'mois';

interface BlockedSlot {
  id: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  raison: string;
}

export default function AgendaPage() {
  const pro = useUserStore((s) => s.pro) ?? pros[4]!;
  const isMobile = useMobile(); // null | true | false
  const [view, setView] = useState<View>('semaine');
  const [refDate, setRefDate] = useState(() => startOfDay(new Date()));
  const [dayDetailDate, setDayDetailDate] = useState<Date | null>(null);
  const [blockOpen, setBlockOpen] = useState(false);
  const [blocks, setBlocks] = useState<BlockedSlot[]>([]);
  const [blockForm, setBlockForm] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    heureDebut: '12:00',
    heureFin: '14:00',
    raison: '',
  });

  // Une fois la détection client effective :
  // - mobile → bascule en vue Jour (par défaut)
  // - mobile + vue Semaine choisie → impossible : forcer Jour
  //   (la vue Semaine est masquée du toggle sur mobile, voir plus bas)
  const [hasAutoSet, setHasAutoSet] = useState(false);
  useEffect(() => {
    if (isMobile === null) return; // pas encore détecté, on attend
    if (!hasAutoSet && isMobile) {
      setView('jour');
    }
    setHasAutoSet(true);
  }, [isMobile, hasAutoSet]);

  // Garde-fou continu : si on passe en mobile (resize) alors qu'on est en
  // vue Semaine, basculer automatiquement en Jour (Semaine non utilisable
  // sur mobile : grille fixe 700px).
  useEffect(() => {
    if (isMobile === true && view === 'semaine') {
      setView('jour');
    }
  }, [isMobile, view]);

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
    if (view === 'jour') setRefDate(subDays(refDate, 1));
    else if (view === 'semaine') setRefDate(subWeeks(refDate, 1));
    else setRefDate(subMonths(refDate, 1));
  }
  function navigateNext() {
    if (view === 'jour') setRefDate(addDays(refDate, 1));
    else if (view === 'semaine') setRefDate(addWeeks(refDate, 1));
    else setRefDate(addMonths(refDate, 1));
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

  function getDateSeances(day: Date) {
    return proSeances
      .filter((s) => isSameDay(new Date(s.date), day))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  function getDateBlocks(day: Date) {
    const ymd = format(day, 'yyyy-MM-dd');
    return blocks.filter((b) => b.date === ymd);
  }

  const periodLabel =
    view === 'jour'
      ? format(refDate, 'EEEE d MMMM', { locale: fr })
      : view === 'semaine'
        ? `${format(weekDays[0]!, 'd MMM', { locale: fr })} au ${format(weekDays[6]!, 'd MMM', { locale: fr })}`
        : format(refDate, 'MMMM yyyy', { locale: fr });

  return (
    <div className="relative mx-auto min-h-[calc(100vh-4rem)] w-full max-w-[1280px] px-4 py-6 lg:px-10 lg:py-8">
      <div className="mb-5 flex flex-col gap-4 sm:mb-7">
        <div>
          <span className="nk-eyebrow">Planning</span>
          <h1 className="nk-h1 text-text-primary mt-1.5 tracking-[-0.02em]">Agenda</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={goToday}
            className="border-border/60 text-text-secondary hover:border-accent-muted hover:text-text-primary rounded-full border px-3 py-1.5 text-xs font-medium transition-colors active:translate-y-px"
          >
            Aujourd&apos;hui
          </button>

          <div className="border-border/60 flex flex-1 overflow-hidden rounded-full border p-0.5 sm:flex-initial">
            {(['jour', 'semaine', 'mois'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'flex-1 rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors sm:flex-initial',
                  v === 'semaine' && 'hidden sm:block',
                  view === v
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-secondary hover:text-text-primary',
                )}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="border-border/60 ml-auto flex items-center gap-1 rounded-full border px-1 py-0.5">
            <button
              onClick={navigatePrev}
              className="hover:bg-card hover:text-accent-gold text-text-secondary rounded-full p-1.5 transition-colors active:translate-y-px"
              aria-label="Précédent"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="text-text-primary min-w-[90px] text-center text-xs font-medium capitalize sm:min-w-[160px] sm:text-sm">
              {periodLabel}
            </span>
            <button
              onClick={navigateNext}
              className="hover:bg-card hover:text-accent-gold text-text-secondary rounded-full p-1.5 transition-colors active:translate-y-px"
              aria-label="Suivant"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Vue Jour (mobile-first) */}
      {view === 'jour' && (
        <DayView
          date={refDate}
          seances={getDateSeances(refDate)}
          blocks={getDateBlocks(refDate)}
        />
      )}

      {/* Vue Semaine (scroll horizontal sur mobile, grille pleine sur desktop) */}
      {view === 'semaine' && (
        <div>
          <p className="text-text-tertiary mb-2 text-center text-[11px] sm:hidden">
            ← Glisse horizontalement pour voir toute la semaine →
          </p>
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-px">
                <div />
                {weekDays.map((day) => (
                  <button
                    key={day.toISOString()}
                    onClick={() => {
                      setRefDate(day);
                      setView('jour');
                    }}
                    className={cn(
                      'py-2 text-center text-xs font-medium transition-colors hover:opacity-80',
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
                  </button>
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
                            const client = sportifs.find(
                              (s) => s.id === seance.sportifId,
                            );
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
                              className="bg-text-tertiary/30 text-text-secondary absolute inset-x-0.5 top-0.5 truncate rounded px-1 py-0.5 text-[10px] leading-tight"
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
        </div>
      )}

      {/* Vue Mois (compact mobile, expansif desktop) */}
      {view === 'mois' && (
        <div>
          <div className="grid grid-cols-7 gap-px text-center text-[10px] font-medium uppercase sm:text-xs">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d) => (
              <div key={d} className="text-text-secondary py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="border-border grid grid-cols-7 gap-px border-t">
            {monthDays.map((day) => {
              const daySeances = getDateSeances(day);
              const dayBlocks = getDateBlocks(day);
              const inMonth = isSameMonth(day, refDate);
              const today = isSameDay(day, new Date());
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setDayDetailDate(day)}
                  className={cn(
                    'border-border hover:bg-surface relative min-h-[52px] border-b border-l p-1 text-left transition-colors sm:min-h-[88px] sm:p-1.5',
                    !inMonth && 'opacity-40',
                    today && 'bg-accent-gold/5',
                  )}
                >
                  <div
                    className={cn(
                      'inline-flex size-5 items-center justify-center rounded-full text-[10px] sm:size-6 sm:text-xs',
                      today
                        ? 'bg-accent-gold text-background font-bold'
                        : 'text-text-secondary',
                    )}
                  >
                    {format(day, 'd')}
                  </div>
                  <div className="mt-1 hidden space-y-0.5 sm:block">
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
                        🚫 {dayBlocks.length}
                      </div>
                    )}
                  </div>
                  {/* Indicateur compact mobile */}
                  {(daySeances.length > 0 || dayBlocks.length > 0) && (
                    <div className="absolute right-1 bottom-1 flex gap-0.5 sm:hidden">
                      {daySeances.length > 0 && (
                        <span className="bg-accent-gold size-1.5 rounded-full" />
                      )}
                      {dayBlocks.length > 0 && (
                        <span className="bg-text-tertiary size-1.5 rounded-full" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* FAB Bloquer plage : icon-only mobile, label desktop */}
      <button
        onClick={() => setBlockOpen(true)}
        className="bg-accent-gold text-background fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom)+0.5rem)] z-40 flex h-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 sm:right-6 sm:gap-2 sm:px-5 lg:bottom-8"
        aria-label="Bloquer une plage horaire"
      >
        <Plus size={20} className="mx-3 sm:mx-0" />
        <span className="hidden text-sm font-semibold sm:inline">Bloquer une plage</span>
      </button>

      {/* Dialog Détail jour (depuis vue Mois) */}
      <Dialog
        open={dayDetailDate !== null}
        onOpenChange={(o) => !o && setDayDetailDate(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="capitalize">
              {dayDetailDate && format(dayDetailDate, 'EEEE d MMMM yyyy', { locale: fr })}
            </DialogTitle>
            <DialogDescription>
              {dayDetailDate && getDateSeances(dayDetailDate).length} séance
              {dayDetailDate && getDateSeances(dayDetailDate).length > 1 ? 's' : ''}{' '}
              prévue
              {dayDetailDate && getDateSeances(dayDetailDate).length > 1 ? 's' : ''}
            </DialogDescription>
          </DialogHeader>
          {dayDetailDate && (
            <DayContentList
              seances={getDateSeances(dayDetailDate)}
              blocks={getDateBlocks(dayDetailDate)}
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDayDetailDate(null)}>
              Fermer
            </Button>
            <Button
              onClick={() => {
                if (dayDetailDate) {
                  setRefDate(dayDetailDate);
                  setView('jour');
                  setDayDetailDate(null);
                }
              }}
            >
              Ouvrir le jour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Bloquer plage */}
      <Dialog open={blockOpen} onOpenChange={setBlockOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bloquer une plage horaire</DialogTitle>
            <DialogDescription>
              Indisponible pour cette plage : aucun client ne pourra réserver.
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
                      <span className="truncate">
                        {format(new Date(b.date), 'd MMM', { locale: fr })} {b.heureDebut}
                        -{b.heureFin} · {b.raison}
                      </span>
                      <button
                        onClick={() =>
                          setBlocks((prev) => prev.filter((x) => x.id !== b.id))
                        }
                        className="text-text-tertiary hover:text-danger ml-2 shrink-0"
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

// ──────────────────────────────────────────────────────────
// Sous-composant : Vue Jour (timeline verticale, mobile-first)
// ──────────────────────────────────────────────────────────

interface DayViewProps {
  date: Date;
  seances: typeof seances;
  blocks: BlockedSlot[];
}

function DayView({ date, seances, blocks }: DayViewProps) {
  const isToday = isSameDay(date, new Date());

  if (seances.length === 0 && blocks.length === 0) {
    return (
      <div className="border-border bg-surface flex flex-col items-center justify-center gap-2 rounded-xl border py-16 text-center">
        <p className="text-text-secondary text-sm">
          {isToday ? 'Pas de séance aujourd’hui' : 'Aucune séance ce jour'}
        </p>
        <p className="text-text-tertiary text-xs">
          Ta journée est libre. Profites-en pour bloquer du temps perso si besoin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <DayContentList seances={seances} blocks={blocks} />
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Sous-composant : Liste des items d'un jour (réutilisé par Dialog mois)
// ──────────────────────────────────────────────────────────

interface DayContentListProps {
  seances: typeof seances;
  blocks: BlockedSlot[];
}

function DayContentList({ seances, blocks }: DayContentListProps) {
  if (seances.length === 0 && blocks.length === 0) {
    return (
      <p className="text-text-tertiary py-4 text-center text-sm">
        Aucune séance ce jour.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {seances.map((s) => {
        const client = sportifs.find((c) => c.id === s.sportifId);
        const isPending = s.statut === 'en_attente';
        return (
          <li
            key={s.id}
            className="bg-card border-border/40 hover:bg-surface-elevated flex items-center gap-3 rounded-xl border p-4 transition-colors"
          >
            <div className="w-14 shrink-0 text-center">
              <p className="text-accent-gold nk-mono text-sm font-bold tabular-nums">
                {format(new Date(s.date), 'HH:mm')}
              </p>
              <p className="text-text-tertiary mt-0.5 text-[10px]">
                {s.dureeMinutes} min
              </p>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-text-primary truncate text-sm font-medium">
                {client ? `${client.prenom} ${client.nom}` : 'Client'}
              </p>
              <p className="text-text-tertiary truncate text-xs">
                {s.lieu ?? 'Lieu à confirmer'}
              </p>
            </div>
            <span
              className={cn(
                'shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-medium',
                isPending
                  ? 'bg-warning/15 text-warning'
                  : 'bg-accent-gold/15 text-accent-gold',
              )}
            >
              {isPending ? 'Attente' : 'Confirmé'}
            </span>
            <span className="text-accent-gold shrink-0 text-sm font-bold tabular-nums">
              {formatPrice(s.tarif)}
            </span>
          </li>
        );
      })}
      {blocks.map((b) => (
        <li
          key={b.id}
          className="border-border/40 bg-card/50 flex items-center gap-3 rounded-xl border border-dashed p-4"
        >
          <div className="text-text-tertiary nk-mono w-14 shrink-0 text-center text-sm font-bold tabular-nums">
            {b.heureDebut}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-text-secondary truncate text-sm font-medium">{b.raison}</p>
            <p className="text-text-tertiary truncate text-xs">
              Indisponible jusqu&apos;à {b.heureFin}
            </p>
          </div>
          <span className="bg-text-tertiary/15 text-text-tertiary shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-medium">
            Bloqué
          </span>
        </li>
      ))}
    </ul>
  );
}
