'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, MapPin, Search } from 'lucide-react';

import { SPORTS_DISPONIBLES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Sport } from '@/types';

const POPULAIRES: Array<{ slug: Sport; label: string }> = [
  { slug: 'boxe', label: 'Boxe' },
  { slug: 'yoga', label: 'Yoga' },
  { slug: 'running', label: 'Course' },
  { slug: 'musculation', label: 'Muscu' },
];

const SPORT_OPTIONS = SPORTS_DISPONIBLES.filter((s) => s.value !== 'autre');

export function HeroSearchBar({ prenom }: { prenom: string }) {
  const router = useRouter();
  const villeRef = useRef<HTMLInputElement>(null);
  const [sport, setSport] = useState<Sport | ''>('');
  const [ville, setVille] = useState('');

  const submit = () => {
    const params = new URLSearchParams();
    if (sport) params.set('sport', sport);
    if (ville.trim()) params.set('ville', ville.trim());
    const qs = params.toString();
    router.push(qs ? `/recherche?${qs}` : '/recherche');
  };

  return (
    <section className="px-4 pt-6 pb-2 md:px-0 md:pt-10 md:pb-4">
      <div className="mx-auto max-w-[720px] text-center md:text-left">
        <span className="nk-eyebrow">Bonjour</span>
        <h1 className="nk-h1 text-text-primary mt-1.5">
          Salut <span className="text-accent-gold">{prenom}</span>
        </h1>
        <p className="text-text-secondary mt-2 text-[14px] md:text-base">
          Trouve ton coach en quelques clics.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="mx-auto mt-6 grid max-w-[720px] grid-cols-1 gap-2 md:mt-8 md:grid-cols-[1.3fr_1fr_auto] md:items-stretch md:gap-2"
      >
        <label className="bg-card border-border/60 focus-within:border-accent-muted flex h-14 items-center gap-3 rounded-xl border px-4 transition-colors">
          <Search size={18} className="text-accent-gold shrink-0" />
          <select
            value={sport}
            onChange={(e) => setSport(e.target.value as Sport | '')}
            className="text-text-primary w-full cursor-pointer appearance-none bg-transparent text-[15px] focus:outline-none"
            aria-label="Sport"
          >
            <option value="">Tous les sports</option>
            {SPORT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="text-text-tertiary pointer-events-none shrink-0"
            aria-hidden="true"
          />
        </label>

        <label className="bg-card border-border/60 focus-within:border-accent-muted flex h-14 items-center gap-3 rounded-xl border px-4 transition-colors">
          <MapPin size={18} className="text-accent-gold shrink-0" />
          <input
            ref={villeRef}
            type="text"
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            placeholder="Ville ou code postal"
            className="placeholder:text-text-tertiary text-text-primary w-full bg-transparent text-[15px] focus:outline-none"
            aria-label="Lieu"
          />
        </label>

        <button
          type="submit"
          className="bg-accent-gold text-background hover:bg-accent-gold-hover inline-flex h-14 items-center justify-center gap-2 rounded-xl px-6 text-[15px] font-semibold transition-all hover:-translate-y-px active:translate-y-px md:px-8"
        >
          <Search size={16} className="md:hidden" />
          Rechercher
        </button>
      </form>

      <div className="mx-auto mt-4 flex max-w-[720px] flex-wrap items-center justify-center gap-2 md:justify-start">
        <span className="text-text-tertiary text-[11px] font-semibold tracking-[0.08em] uppercase">
          Populaire
        </span>
        {POPULAIRES.map(({ slug, label }) => {
          const active = slug === sport;
          return (
            <button
              key={slug}
              type="button"
              onClick={() => {
                setSport(slug);
                villeRef.current?.focus();
              }}
              aria-pressed={active}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-all active:translate-y-px',
                active
                  ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                  : 'border-border/60 text-text-secondary hover:border-accent-muted hover:text-text-primary',
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
