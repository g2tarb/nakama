'use client';

import { memo, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Heart, MapPin, Star } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Pro } from '@/types';
import { useCountUp } from '@/hooks/use-count-up';
import { formatPricePerHour } from '@/lib/formatters';
import { SPECIALITES, SPORTS_DISPONIBLES } from '@/lib/constants';

interface ProArticleCardProps {
  pro: Pro;
  compatibilityScore?: number;
  distance?: number;
  onClick?: () => void;
  className?: string;
}

export const ProArticleCard = memo(function ProArticleCard({
  pro,
  compatibilityScore,
  distance,
  onClick,
  className,
}: ProArticleCardProps) {
  const [favorited, setFavorited] = useState(false);
  const animatedScore = useCountUp(compatibilityScore ?? 0, 900);

  const specialiteLabel =
    SPECIALITES.find((s) => s.value === pro.specialite)?.label ?? pro.specialite;
  const sportLabel = (slug: string) =>
    SPORTS_DISPONIBLES.find((s) => s.value === slug)?.label ?? slug;

  const formattedDistance =
    distance != null
      ? distance < 1
        ? `${Math.round(distance * 1000)} m`
        : `${distance.toFixed(1)} km`
      : null;

  return (
    <article
      onClick={onClick}
      className={cn(
        'group bg-card border-border/40 relative flex w-[300px] shrink-0 cursor-pointer snap-start flex-col overflow-hidden rounded-[18px] border transition-all',
        'hover:border-accent-muted hover:bg-surface-elevated md:w-[340px]',
        className,
      )}
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      {/* Image hero */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={pro.photo}
          alt={`${pro.prenom} ${pro.nom}`}
          fill
          sizes="340px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 35%, rgba(30,42,58,0.65) 100%)',
          }}
        />

        {/* Badge compatibilité */}
        {compatibilityScore != null && (
          <div
            className="text-accent-gold absolute top-3 left-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-bold tabular-nums backdrop-blur-md"
            style={{
              background: 'rgba(201,178,122,0.22)',
              boxShadow: '0 0 16px rgba(201,178,122,0.2)',
            }}
          >
            ✦ {animatedScore} %
          </div>
        )}

        {/* Heart favori */}
        <button
          type="button"
          aria-label={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          aria-pressed={favorited}
          onClick={(e) => {
            e.stopPropagation();
            setFavorited((v) => !v);
          }}
          className={cn(
            'absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full text-white backdrop-blur-md transition-all active:scale-95',
            favorited ? 'bg-danger/85 hover:bg-danger' : 'bg-black/45 hover:bg-black/65',
          )}
        >
          <Heart size={15} className={cn('transition-all', favorited && 'fill-white')} />
        </button>

        {/* Note bottom-right sur photo */}
        <div className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[11.5px] font-semibold text-white backdrop-blur-md">
          <Star size={11} className="fill-warning text-warning" />
          {pro.note.toFixed(1)}
          <span className="text-text-tertiary text-[10.5px]">({pro.nbAvis})</span>
        </div>

        {/* Distance bottom-left sur photo */}
        {formattedDistance && (
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[11.5px] font-medium text-white backdrop-blur-md">
            <MapPin size={11} />
            {formattedDistance}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Header nom + tarif */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-text-primary text-[16px] leading-tight font-semibold tracking-[-0.01em]">
              {pro.prenom} {pro.nom}
            </h3>
            <p className="text-text-secondary mt-0.5 truncate text-[13px]">
              {specialiteLabel} · {pro.ville}
            </p>
          </div>
          <div className="text-right">
            <div className="text-accent-gold text-[16px] font-bold tabular-nums">
              {formatPricePerHour(pro.tarifMin)}
            </div>
            <div className="text-text-tertiary text-[10.5px]">à partir de</div>
          </div>
        </div>

        {/* Bio courte */}
        {pro.bio && (
          <p className="text-text-secondary line-clamp-2 text-[12.5px] leading-snug">
            {pro.bio}
          </p>
        )}

        {/* Sports tags */}
        {pro.sports.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {pro.sports.slice(0, 3).map((sport) => (
              <span
                key={sport}
                className="border-border/60 text-text-secondary inline-flex rounded-full border px-2 py-0.5 text-[10.5px] font-medium"
              >
                {sportLabel(sport)}
              </span>
            ))}
            {pro.sports.length > 3 && (
              <span className="text-text-tertiary inline-flex items-center text-[10.5px]">
                +{pro.sports.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer CTA */}
        <div className="border-border/40 mt-auto flex items-center justify-between border-t pt-3">
          <span className="text-text-tertiary text-[11px]">
            {pro.anneesExperience} an{pro.anneesExperience > 1 ? 's' : ''} d’expérience
          </span>
          <span className="text-accent-gold inline-flex items-center gap-1 text-[12.5px] font-semibold transition-transform group-hover:translate-x-0.5">
            Voir le profil
            <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </article>
  );
});
