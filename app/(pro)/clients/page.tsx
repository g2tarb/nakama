'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronRight, Search } from 'lucide-react';

import { cn } from '@/lib/utils';
import { sportifs, seances } from '@/lib/mock-data';
import { SPORTS_DISPONIBLES } from '@/lib/constants';
import { formatDate } from '@/lib/formatters';

type Filter = 'tous' | 'actifs' | 'nouveaux';

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
    <div className="px-4 py-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-accent-gold text-xl font-bold">Mes clients</h1>
          <p className="text-text-secondary text-sm">
            {filtered.length} client{filtered.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Recherche */}
      <div className="relative mb-4">
        <Search
          size={16}
          className="text-text-tertiary absolute top-1/2 left-3 -translate-y-1/2"
        />
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-border bg-surface focus:border-accent-gold focus:ring-accent-gold/30 h-10 w-full rounded-[10px] border pr-4 pl-9 text-sm focus:ring-2 focus:outline-none"
        />
      </div>

      {/* Filtres */}
      <div className="mb-6 flex gap-2">
        {(['tous', 'actifs', 'nouveaux'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-all',
              filter === f
                ? 'border-accent-gold bg-accent-gold text-background'
                : 'border-border text-text-secondary hover:border-text-tertiary',
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="space-y-2">
        {filtered.map((client) => {
          const sportLabel =
            SPORTS_DISPONIBLES.find((s) => s.value === client.sports[0])?.label ??
            client.sports[0];
          return (
            <button
              key={client.id}
              onClick={() => router.push(`/clients/${client.id}`)}
              className="border-border bg-surface hover:bg-surface-elevated flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors"
            >
              <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={client.photo}
                  alt={client.prenom}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  {client.prenom} {client.nom}
                </p>
                <p className="text-text-tertiary text-xs">
                  {sportLabel} · {client.nbSeances} séance
                  {client.nbSeances > 1 ? 's' : ''}
                  {client.lastSeance && ` · Dernière le ${formatDate(client.lastSeance)}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'size-2 rounded-full',
                    client.lastSeance ? 'bg-success' : 'bg-text-tertiary',
                  )}
                />
                <ChevronRight size={16} className="text-text-tertiary" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
