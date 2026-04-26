'use client';

import { memo } from 'react';
import Image from 'next/image';
import { MapPin, Star } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Pro } from '@/types';
import { CompatibilityBadge } from '@/components/common/compatibility-badge';
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
    >
      {/* Photo */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={pro.photo}
          alt={`${pro.prenom} ${pro.nom}`}
          fill
          sizes="240px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Overlay gradient pour lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Badge compatibilité */}
        {compatibilityScore != null && (
          <div className="absolute top-2 left-2">
            <CompatibilityBadge score={compatibilityScore} />
          </div>
        )}

        {/* Note */}
        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/40 px-1.5 py-0.5 text-xs font-semibold backdrop-blur-sm">
          <Star size={12} className="fill-warning text-warning" />
          {pro.note}
        </div>

        {/* Distance */}
        {distance != null && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 text-xs text-white">
            <MapPin size={12} />
            {distance < 1
              ? `${Math.round(distance * 1000)}m`
              : `${distance.toFixed(1)} km`}
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="p-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold">
              {pro.prenom} {pro.nom}
            </h3>
            <p className="text-text-secondary truncate text-xs">{specialiteLabel}</p>
          </div>
          <span className="text-accent-gold ml-2 shrink-0 text-sm font-bold">
            {formatPricePerHour(pro.tarifMin)}
          </span>
        </div>
      </div>
    </article>
  );
});
