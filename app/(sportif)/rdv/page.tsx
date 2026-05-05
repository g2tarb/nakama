'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { CalendarDays, ChevronRight, Clock, List, MapPin } from 'lucide-react';
import {
  format,
  isAfter,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { seances, pros } from '@/lib/mock-data';
import type { Seance } from '@/types';

type ViewMode = 'liste' | 'calendrier';
type ListFilter = 'venir' | 'passees';

const STATUT_BADGE: Record<Seance['statut'], { label: string; className: string }> = {
  confirmee: { label: 'Confirmé', className: 'bg-accent-gold/15 text-accent-gold' },
  en_attente: { label: 'En attente', className: 'bg-warning/15 text-warning' },
  annulee: { label: 'Annulé', className: 'bg-muted text-text-tertiary' },
  terminee: { label: 'Terminé', className: 'bg-success/15 text-success' },
};

export default function RdvPage() {
  const [view, setView] = useState<ViewMode>('liste');
  const [filter, setFilter] = useState<ListFilter>('venir');
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  const sortedSeances = useMemo(
    () =>
      [...seances].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    [],
  );

  const filteredSeances = useMemo(() => {
    const now = new Date();
    if (filter === 'venir') {
      return sortedSeances.filter(
        (s) =>
          (s.statut === 'confirmee' || s.statut === 'en_attente') &&
          isAfter(new Date(s.date), now),
      );
    }
    return [...sortedSeances]
      .filter(
        (s) =>
          s.statut === 'terminee' ||
          s.statut === 'annulee' ||
          !isAfter(new Date(s.date), now),
      )
      .reverse();
  }, [sortedSeances, filter]);

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
    <div className="mx-auto max-w-[480px] px-4 pt-6 pb-8 md:max-w-[640px]">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="nk-h1 text-text-primary tracking-[-0.02em]">Mes séances</h1>
        <div
          className="border-border/60 flex overflow-hidden rounded-full border p-0.5"
          role="tablist"
        >
          <ViewToggle
            label="Liste"
            icon={List}
            active={view === 'liste'}
            onClick={() => setView('liste')}
          />
          <ViewToggle
            label="Calendrier"
            icon={CalendarDays}
            active={view === 'calendrier'}
            onClick={() => setView('calendrier')}
          />
        </div>
      </div>

      {view === 'liste' && (
        <>
          <div className="border-border/60 mb-5 flex border-b" role="tablist">
            <FilterTab
              label="À venir"
              active={filter === 'venir'}
              onClick={() => setFilter('venir')}
            />
            <FilterTab
              label="Passées"
              active={filter === 'passees'}
              onClick={() => setFilter('passees')}
            />
          </div>

          {filteredSeances.length === 0 ? (
            <p className="text-text-tertiary py-12 text-center text-sm">
              {filter === 'venir'
                ? 'Aucune séance à venir. Réserve ton premier Nakama.'
                : 'Aucune séance passée pour le moment.'}
            </p>
          ) : (
            <motion.ul
              key={filter}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06 } },
              }}
              className="flex flex-col gap-2.5"
            >
              {filteredSeances.map((seance) => {
                const pro = pros.find((p) => p.id === seance.proId);
                const badge = STATUT_BADGE[seance.statut];
                const carte = pro?.cartesServices.find(
                  (c) => c.id === seance.carteServiceId,
                );
                const start = new Date(seance.date);
                const end = new Date(start.getTime() + seance.dureeMinutes * 60_000);
                return (
                  <motion.li
                    key={seance.id}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                      },
                    }}
                    className="bg-card border-border/40 hover:bg-surface-elevated rounded-xl border p-4 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-accent-gold text-[11px] font-semibold tracking-[0.06em] uppercase">
                          {format(start, 'EEE d MMM', { locale: fr })}
                        </div>
                        <div className="text-text-primary mt-1 text-[18px] font-semibold tabular-nums">
                          {format(start, 'HH:mm')} – {format(end, 'HH:mm')}
                        </div>
                      </div>
                      {badge && (
                        <span
                          className={cn(
                            'rounded-full px-2.5 py-1 text-[11px] font-medium',
                            badge.className,
                          )}
                        >
                          {badge.label}
                        </span>
                      )}
                    </div>

                    <div className="border-border/40 mt-3 flex items-center gap-3 border-t pt-3">
                      {pro && (
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                          <Image
                            src={pro.photo}
                            alt={pro.prenom}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-text-primary truncate text-sm font-medium">
                          {pro ? `${pro.prenom} ${pro.nom}` : 'Pro inconnu'}
                        </div>
                        <div className="text-text-tertiary truncate text-xs">
                          {carte?.nom ?? seance.lieu}
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-text-tertiary" />
                    </div>

                    <div className="text-text-tertiary mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                      <span className="inline-flex items-center gap-1">
                        <Clock size={11} />
                        {seance.dureeMinutes} min
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={11} />
                        {seance.lieu}
                      </span>
                      <span className="text-accent-gold ml-auto text-sm font-bold tabular-nums">
                        {seance.tarif} €
                      </span>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          )}
        </>
      )}

      {view === 'calendrier' && (
        <div>
          <h2 className="text-text-primary mb-4 text-center font-semibold capitalize">
            {format(selectedDay, 'MMMM yyyy', { locale: fr })}
          </h2>

          <div className="text-text-tertiary mb-2 grid grid-cols-7 gap-1 text-center text-xs tracking-[0.04em] uppercase">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
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
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    'relative flex h-10 items-center justify-center rounded-lg text-sm transition-colors',
                    isSelected
                      ? 'bg-primary text-primary-foreground font-semibold'
                      : 'hover:bg-surface text-text-secondary',
                    isToday && !isSelected && 'text-accent-gold font-bold',
                  )}
                >
                  {format(day, 'd')}
                  {hasSeance && !isSelected && (
                    <span className="bg-accent-gold absolute bottom-1 size-1 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <h3 className="text-accent-muted mb-3 text-[11px] font-semibold tracking-[0.08em] uppercase">
              {format(selectedDay, 'EEEE d MMMM', { locale: fr })}
            </h3>
            {seancesOfDay.length === 0 ? (
              <p className="text-text-tertiary py-8 text-center text-sm">
                Aucun rendez-vous ce jour
              </p>
            ) : (
              <div className="flex flex-col gap-2.5">
                {seancesOfDay.map((seance) => {
                  const pro = pros.find((p) => p.id === seance.proId);
                  return (
                    <div
                      key={seance.id}
                      className="bg-card border-border/40 flex items-center gap-3 rounded-xl border p-3"
                    >
                      <span className="text-accent-gold text-sm font-bold tabular-nums">
                        {format(new Date(seance.date), 'HH:mm')}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-text-primary truncate text-sm font-medium">
                          {pro ? `${pro.prenom} ${pro.nom}` : 'Pro inconnu'}
                        </div>
                        <div className="text-text-tertiary truncate text-xs">
                          {seance.lieu}
                        </div>
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

function ViewToggle({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: typeof List;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors',
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-text-secondary hover:text-text-primary',
      )}
    >
      <Icon size={13} />
      {label}
    </button>
  );
}

function FilterTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'relative flex-1 px-2 pt-2 pb-3 text-sm font-medium transition-colors',
        active ? 'text-text-primary' : 'text-text-tertiary hover:text-text-secondary',
      )}
    >
      {label}
      {active && (
        <motion.span
          layoutId="rdv-tab-underline"
          className="bg-accent-gold absolute right-0 -bottom-px left-0 h-[2px] rounded-full"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </button>
  );
}
