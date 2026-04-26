'use client';

import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { ProCard } from '@/components/sportif/pro-card';
import { cn } from '@/lib/utils';
import { pros } from '@/lib/mock-data';
import { useMatchedPros } from '@/hooks/use-matching';
import { SPORTS_DISPONIBLES, SPECIALITES } from '@/lib/constants';
import type { Sport, Specialite, Format } from '@/types';

function PillToggle({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
        selected
          ? 'border-accent-gold bg-accent-gold text-background'
          : 'border-border text-text-secondary hover:border-text-tertiary',
      )}
    >
      {label}
    </button>
  );
}

export default function RecherchePage() {
  return (
    <Suspense>
      <RechercheContent />
    </Suspense>
  );
}

function RechercheContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const matchedPros = useMatchedPros();

  const initialSport = searchParams.get('sport') as Sport | null;

  const [showFilters, setShowFilters] = useState(false);
  const [selectedSports, setSelectedSports] = useState<Sport[]>(
    initialSport ? [initialSport] : [],
  );
  const [selectedSpecialites, setSelectedSpecialites] = useState<Specialite[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<Format[]>([]);
  const [tarifMax, setTarifMax] = useState(150);

  function toggle<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
  }

  const filteredPros = useMemo(() => {
    let result = [...pros];

    if (selectedSports.length > 0) {
      result = result.filter((p) => p.sports.some((s) => selectedSports.includes(s)));
    }
    if (selectedSpecialites.length > 0) {
      result = result.filter((p) => selectedSpecialites.includes(p.specialite));
    }
    if (selectedFormats.length > 0) {
      result = result.filter((p) => p.formats.some((f) => selectedFormats.includes(f)));
    }
    result = result.filter((p) => p.tarifMin <= tarifMax);

    // Tri par score matching si disponible
    if (matchedPros.length > 0) {
      const scoreMap = new Map(matchedPros.map((m) => [m.proId, m.scoreTotal]));
      result.sort((a, b) => (scoreMap.get(b.id) ?? 0) - (scoreMap.get(a.id) ?? 0));
    }

    return result;
  }, [selectedSports, selectedSpecialites, selectedFormats, tarifMax, matchedPros]);

  const matchScoreMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of matchedPros) {
      map.set(m.proId, m.scoreTotal);
    }
    return map;
  }, [matchedPros]);

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-accent-gold text-xl font-bold">Trouve ton Nakama</h1>
          <p className="text-text-secondary mt-1 text-sm">
            {filteredPros.length} professionnel
            {filteredPros.length > 1 ? 's' : ''} trouvé
            {filteredPros.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters((s) => !s)}
          className="gap-2"
        >
          <SlidersHorizontal size={16} />
          Filtres
        </Button>
      </div>

      {/* Panneau filtres */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-border bg-surface mb-6 overflow-hidden rounded-xl border"
          >
            <div className="space-y-5 p-4">
              {/* Fermer */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Filtres</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-text-tertiary hover:text-text-primary"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Spécialité */}
              <div>
                <p className="text-text-secondary mb-2 text-xs font-medium">Spécialité</p>
                <div className="flex flex-wrap gap-2">
                  {SPECIALITES.map(({ value, label }) => (
                    <PillToggle
                      key={value}
                      label={label}
                      selected={selectedSpecialites.includes(value)}
                      onClick={() =>
                        setSelectedSpecialites(toggle(selectedSpecialites, value))
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Sport */}
              <div>
                <p className="text-text-secondary mb-2 text-xs font-medium">Sport</p>
                <div className="flex flex-wrap gap-2">
                  {SPORTS_DISPONIBLES.map(({ value, label }) => (
                    <PillToggle
                      key={value}
                      label={label}
                      selected={selectedSports.includes(value)}
                      onClick={() => setSelectedSports(toggle(selectedSports, value))}
                    />
                  ))}
                </div>
              </div>

              {/* Format */}
              <div>
                <p className="text-text-secondary mb-2 text-xs font-medium">Format</p>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { value: 'presentiel', label: 'Présentiel' },
                      { value: 'distanciel', label: 'Distanciel' },
                      { value: 'hybride', label: 'Hybride' },
                    ] as const
                  ).map(({ value, label }) => (
                    <PillToggle
                      key={value}
                      label={label}
                      selected={selectedFormats.includes(value)}
                      onClick={() => setSelectedFormats(toggle(selectedFormats, value))}
                    />
                  ))}
                </div>
              </div>

              {/* Tarif */}
              <div>
                <p className="text-text-secondary mb-1.5 text-xs font-medium">
                  Tarif maximum : {tarifMax}€/h
                </p>
                <input
                  type="range"
                  min={20}
                  max={150}
                  value={tarifMax}
                  onChange={(e) => setTarifMax(Number(e.target.value))}
                  className="vibe-slider w-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Résultats */}
      {filteredPros.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-text-secondary text-lg font-semibold">Aucun résultat</p>
          <p className="text-text-tertiary mt-1 text-sm">
            Essaie d&apos;élargir tes filtres
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredPros.map((pro) => {
            const score = matchScoreMap.get(pro.id);
            return (
              <ProCard
                key={pro.id}
                pro={pro}
                {...(score != null ? { compatibilityScore: score } : {})}
                className="w-full"
                onClick={() => router.push(`/pros/${pro.id}`)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
