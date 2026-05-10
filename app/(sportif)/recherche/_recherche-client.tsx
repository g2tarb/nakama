'use client';

import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { BottomSheet } from '@/components/common/bottom-sheet';
import { ProArticleCard } from '@/components/sportif/pro-article-card';
import { cn } from '@/lib/utils';
import { useMatchedPros } from '@/hooks/use-matching';
import { SPORTS_DISPONIBLES, SPECIALITES } from '@/lib/constants';
import type { Pro, Sport, Specialite, Format } from '@/types';

interface RechercheClientProps {
  initialPros: Pro[];
  scoreMap: Record<string, number>;
  initialVille?: string;
}

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

export default function RechercheClient(props: RechercheClientProps) {
  return (
    <Suspense>
      <RechercheContent {...props} />
    </Suspense>
  );
}

function RechercheContent({
  initialPros,
  scoreMap: serverScoreMap,
  initialVille,
}: RechercheClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const matchedProsMock = useMatchedPros();
  const useDbScores = Object.keys(serverScoreMap).length > 0;

  const initialSport = (searchParams?.get('sport') ?? null) as Sport | null;

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
    let result = [...initialPros];

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

    const effectiveScores = useDbScores
      ? serverScoreMap
      : Object.fromEntries(matchedProsMock.map((m) => [m.proId, m.scoreTotal]));
    if (Object.keys(effectiveScores).length > 0) {
      result.sort((a, b) => (effectiveScores[b.id] ?? 0) - (effectiveScores[a.id] ?? 0));
    }
    return result;
  }, [
    initialPros,
    selectedSports,
    selectedSpecialites,
    selectedFormats,
    tarifMax,
    matchedProsMock,
    serverScoreMap,
    useDbScores,
  ]);

  const matchScoreMap = useMemo(() => {
    const map = new Map<string, number>();
    if (useDbScores) {
      for (const [id, score] of Object.entries(serverScoreMap)) map.set(id, score);
    } else {
      for (const m of matchedProsMock) map.set(m.proId, m.scoreTotal);
    }
    return map;
  }, [useDbScores, serverScoreMap, matchedProsMock]);

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-accent-gold text-xl font-bold">
            {initialVille ? `Pros à ${initialVille}` : 'Trouve ton Nakama'}
          </h1>
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

      <BottomSheet
        open={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtres"
      >
        <div className="flex flex-col gap-6">
          <div>
            <p className="nk-label text-accent-muted mb-3">Spécialité</p>
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

          <div>
            <p className="nk-label text-accent-muted mb-3">Sport</p>
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

          <div>
            <p className="nk-label text-accent-muted mb-3">Format</p>
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

          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="nk-label text-accent-muted">Tarif maximum</p>
              <span className="text-accent-gold text-[14px] font-bold tabular-nums">
                {tarifMax} €/h
              </span>
            </div>
            <input
              type="range"
              min={20}
              max={150}
              value={tarifMax}
              onChange={(e) => setTarifMax(Number(e.target.value))}
              className="vibe-slider w-full"
            />
          </div>

          <div className="border-border/40 -mx-5 mt-2 -mb-1 flex gap-3 border-t px-5 pt-4">
            <button
              type="button"
              onClick={() => {
                setSelectedSports([]);
                setSelectedSpecialites([]);
                setSelectedFormats([]);
                setTarifMax(150);
              }}
              className="border-border/60 text-text-secondary hover:text-text-primary nk-tap flex-1 rounded-xl border py-3 text-[13.5px] font-medium"
            >
              Réinitialiser
            </button>
            <Button
              size="lg"
              onClick={() => setShowFilters(false)}
              className="h-12 flex-1"
            >
              Voir {filteredPros.length} pro{filteredPros.length > 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </BottomSheet>

      {/* Résultats — carousel article-style */}
      {filteredPros.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-text-secondary text-lg font-semibold">Aucun résultat</p>
          <p className="text-text-tertiary mt-1 text-sm">
            Essaie d&apos;élargir tes filtres
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Carousel principal — top 12 par compat */}
          <CarouselRow label="Top compatibles">
            {filteredPros.slice(0, 12).map((pro) => {
              const score = matchScoreMap.get(pro.id);
              return (
                <ProArticleCard
                  key={pro.id}
                  pro={pro}
                  {...(score != null ? { compatibilityScore: score } : {})}
                  onClick={() => router.push(`/pros/${pro.id}`)}
                />
              );
            })}
          </CarouselRow>

          {filteredPros.length > 12 && (
            <CarouselRow label="À découvrir aussi">
              {filteredPros.slice(12).map((pro) => {
                const score = matchScoreMap.get(pro.id);
                return (
                  <ProArticleCard
                    key={pro.id}
                    pro={pro}
                    {...(score != null ? { compatibilityScore: score } : {})}
                    onClick={() => router.push(`/pros/${pro.id}`)}
                  />
                );
              })}
            </CarouselRow>
          )}
        </div>
      )}
    </div>
  );
}

function CarouselRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between px-1">
        <h2 className="nk-h3 text-text-primary">{label}</h2>
        <span className="text-text-tertiary hidden text-[11px] sm:inline">
          ← glisse →
        </span>
      </div>
      <div className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3">
        {children}
      </div>
    </section>
  );
}
