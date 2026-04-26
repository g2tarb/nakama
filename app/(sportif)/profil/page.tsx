'use client';

import Image from 'next/image';
import { Pencil } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/stores/user-store';
import { defaultSportif } from '@/lib/mock-data';
import { NIVEAUX, SPORTS_DISPONIBLES, OBJECTIFS } from '@/lib/constants';

export default function ProfilPage() {
  const sportif = useUserStore((s) => s.sportif) ?? defaultSportif;

  const niveauLabel =
    NIVEAUX.find((n) => n.value === sportif.niveau)?.label ?? sportif.niveau;

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* En-tête profil */}
      <div className="flex items-start gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-full">
          <Image
            src={sportif.photo}
            alt={sportif.prenom}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h1 className="text-xl font-bold">
              {sportif.prenom} {sportif.nom}
            </h1>
            <Button variant="ghost" size="icon-sm">
              <Pencil size={16} />
            </Button>
          </div>
          <p className="text-text-secondary text-sm">
            {sportif.age} ans · {sportif.ville}
          </p>

          {/* Jauge niveau */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-tertiary">Niveau</span>
              <span className="text-accent-gold font-medium">{niveauLabel}</span>
            </div>
            <div className="bg-border mt-1 h-2 overflow-hidden rounded-full">
              <div
                className="bg-accent-gold h-full rounded-full transition-all"
                style={{
                  width:
                    sportif.niveau === 'debutant'
                      ? '33%'
                      : sportif.niveau === 'intermediaire'
                        ? '66%'
                        : '100%',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      {sportif.bio && (
        <div className="border-border bg-surface mt-6 rounded-xl border p-4">
          <h2 className="mb-2 text-sm font-semibold">Bio</h2>
          <p className="text-text-secondary text-sm">{sportif.bio}</p>
        </div>
      )}

      {/* Sports */}
      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold">Sports pratiqués</h2>
        <div className="flex flex-wrap gap-2">
          {sportif.sports.map((sport) => {
            const label =
              SPORTS_DISPONIBLES.find((s) => s.value === sport)?.label ?? sport;
            return (
              <Badge key={sport} variant="secondary" className="capitalize">
                {label}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Objectifs */}
      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold">Objectifs</h2>
        <div className="flex flex-wrap gap-2">
          {sportif.objectifs.map((obj) => {
            const label = OBJECTIFS.find((o) => o.value === obj)?.label ?? obj;
            return (
              <Badge key={obj} variant="outline">
                {label}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Vibe */}
      <div className="border-border bg-surface mt-6 rounded-xl border p-4">
        <h2 className="mb-3 text-sm font-semibold">Ma vibe</h2>
        <div className="space-y-3">
          {[
            {
              label: 'Pédagogie ↔ Discipline',
              value: sportif.vibe.pedagogieDiscipline,
            },
            {
              label: 'Suivi quotidien ↔ Autonomie',
              value: sportif.vibe.suiviAutonomie,
            },
            {
              label: 'Data ↔ Ressenti',
              value: sportif.vibe.dataRessenti,
            },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-tertiary">{label}</span>
                <span className="text-accent-gold font-medium">{value}/10</span>
              </div>
              <div className="bg-border mt-1 h-1.5 overflow-hidden rounded-full">
                <div
                  className="bg-accent-gold h-full rounded-full transition-all"
                  style={{ width: `${value * 10}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
