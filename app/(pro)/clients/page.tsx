'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { sportifs, seances } from '@/lib/mock-data';
import { SPORTS_DISPONIBLES } from '@/lib/constants';
import { formatDate } from '@/lib/formatters';

type Filter = 'tous' | 'actifs' | 'nouveaux';

const FILTERS: ReadonlyArray<{ value: Filter; label: string }> = [
  { value: 'tous', label: 'Tous' },
  { value: 'actifs', label: 'Actifs' },
  { value: 'nouveaux', label: 'Nouveaux' },
];

export default function ClientsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('tous');
  const [search, setSearch] = useState('');
  const [newThreshold] = useState(() => Date.now() - 30 * 24 * 60 * 60 * 1000);

  const clientsWithMeta = useMemo(() => {
    return sportifs.map((s) => {
      const clientSeances = seances.filter((se) => se.sportifId === s.id);
      const lastSeance = clientSeances
        .filter((se) => se.statut === 'terminee')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      return {
        ...s,
        nbSeances: clientSeances.length,
        lastSeance: lastSeance?.date,
        isNew: s.clientDepuis ? new Date(s.clientDepuis) > new Date(newThreshold) : false,
      };
    });
  }, [newThreshold]);

  const filtered = useMemo(() => {
    let list = clientsWithMeta;
    if (filter === 'actifs') list = list.filter((c) => c.lastSeance);
    if (filter === 'nouveaux') list = list.filter((c) => c.isNew);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) => c.prenom.toLowerCase().includes(q) || c.nom.toLowerCase().includes(q),
      );
    }
    return list;
  }, [clientsWithMeta, filter, search]);

  return (
    <div className="mx-auto w-full max-w-[960px] px-4 py-6 lg:px-10 lg:py-8">
      <header className="mb-5">
        <span className="nk-eyebrow">Athlètes</span>
        <h1 className="nk-h1 text-text-primary mt-1.5 tracking-[-0.02em]">Mes clients</h1>
        <p className="text-text-secondary mt-1 text-sm">
          {filtered.length} client{filtered.length > 1 ? 's' : ''}
        </p>
      </header>

      <div className="relative mb-3">
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-3 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full"
          style={{ background: 'var(--color-accent-gold-wash)' }}
        >
          <Search size={14} className="text-accent-gold" />
        </span>
        <input
          type="text"
          placeholder="Rechercher un athlète…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-border/60 bg-card focus:border-accent-muted focus:ring-accent-gold/15 placeholder:text-text-tertiary text-text-primary h-12 w-full rounded-[14px] border pr-4 pl-12 text-sm transition-all focus:ring-3 focus:outline-none"
        />
      </div>

      <div className="mb-5 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-all active:translate-y-px',
              filter === f.value
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border/60 text-text-secondary hover:border-accent-muted hover:text-text-primary',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-text-tertiary py-12 text-center text-sm">
          Aucun client ne correspond. Élargis ta recherche.
        </p>
      ) : (
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.04 } },
          }}
          className="flex flex-col gap-2"
        >
          {filtered.map((client) => {
            const sportLabel =
              SPORTS_DISPONIBLES.find((s) => s.value === client.sports[0])?.label ??
              client.sports[0];
            return (
              <motion.li
                key={client.id}
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
              >
                <button
                  type="button"
                  onClick={() => router.push(`/clients/${client.id}`)}
                  className="bg-card border-border/40 hover:bg-surface-elevated flex w-full items-center gap-3.5 rounded-xl border p-3.5 text-left transition-colors active:translate-y-px"
                >
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={client.photo}
                      alt={client.prenom}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-text-primary truncate text-[14.5px] font-semibold">
                        {client.prenom} {client.nom}
                      </p>
                      {client.isNew && (
                        <span className="bg-accent-gold/15 text-accent-gold rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-[0.04em] uppercase">
                          Nouveau
                        </span>
                      )}
                    </div>
                    <p className="text-text-tertiary mt-0.5 truncate text-xs">
                      {sportLabel} · {client.nbSeances} séance
                      {client.nbSeances > 1 ? 's' : ''}
                      {client.lastSeance && (
                        <> · dernière le {formatDate(client.lastSeance)}</>
                      )}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'h-2 w-2 shrink-0 rounded-full',
                      client.lastSeance ? 'bg-success' : 'bg-text-tertiary',
                    )}
                  />
                  <ChevronRight size={16} className="text-text-tertiary shrink-0" />
                </button>
              </motion.li>
            );
          })}
        </motion.ul>
      )}
    </div>
  );
}
