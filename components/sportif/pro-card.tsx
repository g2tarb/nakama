'use client';

import { memo, useState } from 'react';
import Image from 'next/image';
import { Heart, MapPin, Star } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Pro } from '@/types';
import { useCountUp } from '@/hooks/use-count-up';
import { formatPricePerHour } from '@/lib/formatters';
import { SPECIALITES } from '@/lib/constants';

interface ProCardProps {
  pro: Pro;
  compatibilityScore?: number;
  distance?: number;
  onClick?: () => void;
  className?: string;
}

export const ProCard = memo(function ProCard({
  pro,
  compatibilityScore,
  distance,
  onClick,
  className,
}: ProCardProps) {
  const [favorited, setFavorited] = useState(false);
  const animatedScore = useCountUp(compatibilityScore ?? 0, 900);
  const specialiteLabel =
    SPECIALITES.find((s) => s.value === pro.specialite)?.label ?? pro.specialite;

  return (
    <article
      onClick={onClick}
      className={cn(
        'group bg-surface relative w-[220px] shrink-0 cursor-pointer overflow-hidden rounded-[14px] transition-all md:w-[240px]',
        'hover:bg-surface-elevated hover:scale-[1.01]',
        className,
      )}
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={pro.photo}
          alt={`${pro.prenom} ${pro.nom}`}
          fill
          sizes="240px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

        {compatibilityScore != null && (
          <div
            className="text-accent-gold absolute top-2 left-2 inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-bold tabular-nums backdrop-blur-sm"
            style={{
              background: 'rgba(201,178,122,0.22)',
              boxShadow: '0 0 12px rgba(201,178,122,0.18)',
            }}
          >
            {animatedScore}%
          </div>
        )}

        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/45 px-1.5 py-0.5 text-xs font-semibold backdrop-blur-sm">
          <Star size={11} className="fill-warning text-warning" />
          {pro.note}
        </div>

        <button
          type="button"
          aria-label={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          aria-pressed={favorited}
          onClick={(e) => {
            e.stopPropagation();
            setFavorited((v) => !v);
          }}
          className={cn(
            'absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-full text-white backdrop-blur-sm transition-all active:scale-95',
            favorited ? 'bg-danger/80 hover:bg-danger' : 'bg-black/45 hover:bg-black/65',
          )}
        >
          <Heart size={14} className={cn('transition-all', favorited && 'fill-white')} />
        </button>

        {distance != null && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 text-xs font-medium text-white drop-shadow-sm">
            <MapPin size={12} />
            {distance < 1
              ? `${Math.round(distance * 1000)} m`
              : `${distance.toFixed(1)} km`}
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-text-primary truncate text-sm font-semibold">
              {pro.prenom} {pro.nom}
            </h3>
            <p className="text-text-secondary truncate text-xs">{specialiteLabel}</p>
          </div>
          <span className="text-accent-gold shrink-0 text-sm font-bold">
            {formatPricePerHour(pro.tarifMin)}
          </span>
        </div>
      </div>
    </article>
  );
});
