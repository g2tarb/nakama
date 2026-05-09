'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  CircleDot,
  Dumbbell,
  Flower,
  Footprints,
  HandMetal,
  MapPin,
  Medal,
  Search,
  Swords,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { suggestPlaces, type PlaceSuggestion } from '@/lib/mapbox/suggest';

type SportSlug =
  | 'fitness'
  | 'running'
  | 'yoga'
  | 'musculation'
  | 'crossfit'
  | 'natation'
  | 'boxe'
  | 'football'
  | 'tennis';

const SPORTS: Array<{ slug: SportSlug; label: string; icon: LucideIcon }> = [
  { slug: 'fitness', label: 'Fitness', icon: Dumbbell },
  { slug: 'musculation', label: 'Musculation', icon: Dumbbell },
  { slug: 'running', label: 'Running', icon: Footprints },
  { slug: 'yoga', label: 'Yoga', icon: Flower },
  { slug: 'crossfit', label: 'Crossfit', icon: Zap },
  { slug: 'boxe', label: 'Boxe', icon: Swords },
  { slug: 'natation', label: 'Natation', icon: HandMetal },
  { slug: 'football', label: 'Football', icon: CircleDot },
  { slug: 'tennis', label: 'Tennis', icon: Medal },
];

const POPULAIRES: SportSlug[] = ['yoga', 'boxe', 'musculation', 'crossfit', 'running'];

const VILLES_FALLBACK = [
  'Paris 11e',
  'Boulogne-Billancourt',
  'Vincennes',
  'Levallois-Perret',
  'Lyon',
  'Marseille',
  'Bordeaux',
  'Nantes',
  'Toulouse',
];

type OpenField = 'sport' | 'date' | 'ville' | null;

export function HeroSearchBar() {
  const router = useRouter();
  const [openField, setOpenField] = useState<OpenField>(null);
  const [selectedSport, setSelectedSport] = useState<SportSlug>('musculation');
  const [date, setDate] = useState(''); // ISO yyyy-mm-dd
  const [ville, setVille] = useState('Paris 11e');

  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpenField(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const sportLabel = SPORTS.find((s) => s.slug === selectedSport)?.label ?? 'Sport';
  const SportIcon = SPORTS.find((s) => s.slug === selectedSport)?.icon ?? Dumbbell;

  const dateLabel = (() => {
    if (!date) return 'Quand tu veux';
    const d = parseISO(date);
    return isValid(d) ? format(d, 'EEE d MMM', { locale: fr }) : 'Quand tu veux';
  })();

  function handleSearch() {
    const params = new URLSearchParams();
    params.set('sport', selectedSport);
    if (date) params.set('date', date);
    if (ville) params.set('ville', ville);
    router.push(`/recherche?${params.toString()}`);
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="bg-card border-border/40 mx-auto flex max-w-[880px] flex-col items-stretch gap-1 rounded-xl border p-2 text-left md:flex-row md:gap-0">
        <FieldButton
          label="Sport"
          icon={SportIcon}
          value={sportLabel}
          active={openField === 'sport'}
          onClick={() => setOpenField(openField === 'sport' ? null : 'sport')}
        />
        <Divider />
        <FieldButton
          label="Quand"
          icon={Calendar}
          value={dateLabel}
          active={openField === 'date'}
          onClick={() => setOpenField(openField === 'date' ? null : 'date')}
        />
        <Divider />
        <FieldButton
          label="Où"
          icon={MapPin}
          value={ville || 'Toute la France'}
          active={openField === 'ville'}
          onClick={() => setOpenField(openField === 'ville' ? null : 'ville')}
        />
        <button type="button" onClick={handleSearch} className="nk-btn m-1">
          <span>
            <Search size={16} />
            Rechercher
          </span>
        </button>
      </div>

      {/* Popovers */}
      <AnimatePresence>
        {openField === 'sport' && (
          <Popover>
            <SportGrid
              selected={selectedSport}
              onSelect={(slug) => {
                setSelectedSport(slug);
                setOpenField(null);
              }}
            />
          </Popover>
        )}
        {openField === 'date' && (
          <Popover>
            <DatePresets
              selected={date}
              onSelect={(iso) => {
                setDate(iso);
                setOpenField(null);
              }}
            />
          </Popover>
        )}
        {openField === 'ville' && (
          <Popover>
            <VilleAutocomplete
              value={ville}
              onChange={setVille}
              onPick={(v) => {
                setVille(v);
                setOpenField(null);
              }}
            />
          </Popover>
        )}
      </AnimatePresence>

      {/* Populaire chips */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <span className="text-text-secondary text-[13px]">Populaire :</span>
        {POPULAIRES.map((slug) => {
          const item = SPORTS.find((s) => s.slug === slug);
          if (!item) return null;
          const active = slug === selectedSport;
          return (
            <button
              key={slug}
              type="button"
              onClick={() => setSelectedSport(slug)}
              className={
                active
                  ? 'bg-primary text-primary-foreground border-primary cursor-pointer rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors'
                  : 'text-text-secondary border-border hover:border-accent-muted hover:text-text-primary cursor-pointer rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors'
              }
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FieldButton({
  label,
  icon: Icon,
  value,
  active,
  onClick,
}: {
  label: string;
  icon: LucideIcon;
  value: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={active}
      className={cn(
        'flex-1 rounded-[10px] px-4 py-2 text-left transition-colors',
        active ? 'bg-surface-elevated' : 'hover:bg-surface-elevated/60',
      )}
    >
      <div className="nk-label mb-1">{label}</div>
      <div className="text-text-primary flex items-center gap-2 text-[15px]">
        <Icon size={16} className="text-accent-gold" />
        <span className="truncate">{value}</span>
      </div>
    </button>
  );
}

function Divider() {
  return <div className="bg-border hidden w-px md:block" aria-hidden="true" />;
}

function Popover({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="bg-card border-border absolute left-1/2 z-30 mt-2 w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border p-4 text-left shadow-[var(--shadow-elevated)]"
    >
      {children}
    </motion.div>
  );
}

function SportGrid({
  selected,
  onSelect,
}: {
  selected: SportSlug;
  onSelect: (s: SportSlug) => void;
}) {
  return (
    <div>
      <div className="nk-label mb-3">Choisis un sport</div>
      <div className="grid grid-cols-3 gap-2">
        {SPORTS.map(({ slug, label, icon: Icon }) => {
          const active = slug === selected;
          return (
            <button
              key={slug}
              type="button"
              onClick={() => onSelect(slug)}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-lg border px-3 py-3 text-[13px] font-medium transition-colors',
                active
                  ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                  : 'border-border/60 text-text-secondary hover:border-accent-muted hover:text-text-primary',
              )}
            >
              <Icon size={18} className={active ? 'text-accent-gold' : ''} />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DatePresets({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (iso: string) => void;
}) {
  const today = new Date();
  const presets: Array<{ label: string; date: Date }> = [
    { label: "Aujourd'hui", date: today },
    {
      label: 'Demain',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
    },
    {
      label: 'Ce week-end',
      date: nextSaturday(today),
    },
    {
      label: 'Cette semaine',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
    },
  ];

  return (
    <div>
      <div className="nk-label mb-3">Quand veux-tu t&apos;entraîner ?</div>
      <div className="grid grid-cols-2 gap-2">
        {presets.map(({ label, date }) => {
          const iso = format(date, 'yyyy-MM-dd');
          const active = iso === selected;
          return (
            <button
              key={label}
              type="button"
              onClick={() => onSelect(iso)}
              className={cn(
                'flex flex-col items-start gap-0.5 rounded-lg border px-3 py-2.5 text-left transition-colors',
                active
                  ? 'border-accent-gold bg-accent-gold/10'
                  : 'border-border/60 hover:border-accent-muted',
              )}
            >
              <span
                className={cn(
                  'text-[13px] font-semibold',
                  active ? 'text-accent-gold' : 'text-text-primary',
                )}
              >
                {label}
              </span>
              <span className="text-text-tertiary text-[11px] capitalize">
                {format(date, 'EEE d MMM', { locale: fr })}
              </span>
            </button>
          );
        })}
      </div>

      <div className="border-border/40 mt-3 border-t pt-3">
        <label className="nk-label mb-2 block">Date personnalisée</label>
        <input
          type="date"
          value={selected}
          min={format(today, 'yyyy-MM-dd')}
          onChange={(e) => onSelect(e.target.value)}
          className="border-border/60 bg-card focus:border-accent-muted focus:ring-accent-gold/15 text-text-primary h-10 w-full rounded-[10px] border px-3 text-sm focus:ring-3 focus:outline-none"
        />
      </div>
    </div>
  );
}

function VilleAutocomplete({
  value,
  onChange,
  onPick,
}: {
  value: string;
  onChange: (v: string) => void;
  onPick: (v: string) => void;
}) {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const lastQueryRef = useRef<string>('');

  // Debounce 250 ms sur le fetch Mapbox
  useEffect(() => {
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }
    const handle = setTimeout(async () => {
      lastQueryRef.current = trimmed;
      setIsLoading(true);
      try {
        const results = await suggestPlaces(trimmed);
        // ignore les réponses obsolètes (l'utilisateur a tapé entre temps)
        if (lastQueryRef.current === trimmed) {
          setSuggestions(results);
        }
      } finally {
        if (lastQueryRef.current === trimmed) setIsLoading(false);
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [value]);

  const showFallback = value.trim().length < 2 && suggestions.length === 0;

  return (
    <div>
      <div className="nk-label mb-2">Où</div>
      <input
        type="text"
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ville ou code postal"
        className="border-border/60 bg-card focus:border-accent-muted focus:ring-accent-gold/15 placeholder:text-text-tertiary text-text-primary h-10 w-full rounded-[10px] border px-3 text-sm focus:ring-3 focus:outline-none"
      />

      {isLoading && (
        <div className="text-text-tertiary mt-3 flex items-center gap-2 px-2 text-[12px]">
          <span className="border-accent-muted/40 border-t-accent-gold inline-block h-3 w-3 animate-spin rounded-full border-2" />
          Recherche…
        </div>
      )}

      {!isLoading && suggestions.length > 0 && (
        <ul className="mt-2 flex max-h-[260px] flex-col gap-0.5 overflow-y-auto">
          {suggestions.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onPick(s.name)}
                className="hover:bg-surface-elevated text-text-primary flex w-full items-start gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors"
              >
                <MapPin size={14} className="text-accent-muted mt-0.5 shrink-0" />
                <span className="flex flex-col">
                  <span>{s.name}</span>
                  {s.fullName !== s.name && (
                    <span className="text-text-tertiary text-[11px]">{s.fullName}</span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {!isLoading && suggestions.length === 0 && !showFallback && (
        <p className="text-text-tertiary mt-3 px-2 text-[12px]">
          Aucun résultat. Essaie un code postal ou une autre ville.
        </p>
      )}

      {showFallback && (
        <ul className="mt-3 flex max-h-[260px] flex-col gap-0.5 overflow-y-auto">
          <li className="text-text-tertiary px-2 pb-1 text-[11px] tracking-[0.06em] uppercase">
            Suggestions
          </li>
          {VILLES_FALLBACK.map((v) => (
            <li key={v}>
              <button
                type="button"
                onClick={() => onPick(v)}
                className="hover:bg-surface-elevated text-text-primary flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors"
              >
                <MapPin size={14} className="text-accent-muted" />
                {v}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function nextSaturday(d: Date): Date {
  const day = d.getDay(); // 0=Sun ... 6=Sat
  const daysUntilSat = (6 - day + 7) % 7 || 7;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + daysUntilSat);
}
