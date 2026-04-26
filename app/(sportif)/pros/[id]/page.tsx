'use client';

import { use, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Calendar, Heart, MapPin, MessageCircle, Star } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CompatibilityBadge } from '@/components/common/compatibility-badge';
import { pros } from '@/lib/mock-data';
import { SPECIALITES } from '@/lib/constants';
import { formatPricePerHour, formatDate } from '@/lib/formatters';
import { useUserStore } from '@/stores/user-store';
import { computeMatchScore } from '@/lib/matching';

export default function FicheProPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const sportif = useUserStore((s) => s.sportif);

  const pro = pros.find((p) => p.id === id);

  const matchScore = useMemo(() => {
    if (!sportif || !pro) return null;
    return computeMatchScore(sportif, pro);
  }, [sportif, pro]);

  if (!pro) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-text-secondary text-lg font-semibold">
          Professionnel introuvable
        </p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          Retour
        </Button>
      </div>
    );
  }

  const specialiteLabel =
    SPECIALITES.find((s) => s.value === pro.specialite)?.label ?? pro.specialite;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="pb-24"
    >
      {/* Header retour */}
      <div className="bg-background/80 sticky top-14 z-30 flex h-12 items-center px-4 backdrop-blur-sm">
        <button
          onClick={() => router.back()}
          className="text-text-secondary hover:text-text-primary flex items-center gap-2 text-sm"
        >
          <ArrowLeft size={18} />
          Retour
        </button>
      </div>

      <div className="mx-auto max-w-2xl px-4">
        {/* En-tête pro */}
        <div className="flex items-start gap-4">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-full">
            <Image
              src={pro.photo}
              alt={`${pro.prenom} ${pro.nom}`}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between">
              <h1 className="text-xl font-bold">
                {pro.prenom} {pro.nom}
              </h1>
              <button className="text-danger hover:scale-110">
                <Heart size={22} />
              </button>
            </div>
            <p className="text-text-secondary text-sm">{specialiteLabel}</p>
            <div className="mt-1 flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1">
                <Star size={14} className="fill-warning text-warning" />
                {pro.note} ({pro.nbAvis} avis)
              </span>
              <span className="text-accent-gold font-semibold">
                {formatPricePerHour(pro.tarifMin)}
              </span>
            </div>
            {matchScore && (
              <div className="mt-2">
                <CompatibilityBadge score={matchScore.scoreTotal} size="md" />
              </div>
            )}
          </div>
        </div>

        {/* Infos */}
        <div className="border-border bg-surface mt-6 rounded-xl border p-4">
          <div className="text-text-secondary flex items-center gap-2 text-sm">
            <MapPin size={16} />
            {pro.ville} · Rayon {pro.rayonKm} km
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {pro.sports.map((sport) => (
              <Badge key={sport} variant="secondary" className="capitalize">
                {sport}
              </Badge>
            ))}
            {pro.formats.map((format) => (
              <Badge key={format} variant="outline" className="capitalize">
                {format}
              </Badge>
            ))}
          </div>
          {pro.formule !== 'standard' && (
            <Badge className="bg-accent-gold/10 text-accent-gold mt-3">
              {pro.formule === 'elite' ? 'Élite' : 'Premium'}
            </Badge>
          )}
        </div>

        {/* À propos */}
        <div className="border-border bg-surface mt-6 rounded-xl border p-4">
          <h2 className="mb-2 font-semibold">À propos</h2>
          <p className="text-text-secondary text-sm leading-relaxed">{pro.bio}</p>
          <div className="text-text-tertiary mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <span>{pro.anneesExperience} ans d&apos;expérience</span>
            {pro.formations.map((f) => (
              <span key={f}>{f}</span>
            ))}
          </div>
        </div>

        {/* Cartes de service */}
        <div className="mt-6">
          <h2 className="mb-3 font-semibold">Cartes de service</h2>
          <div className="space-y-3">
            {pro.cartesServices
              .filter((c) => c.actif)
              .map((carte) => (
                <div
                  key={carte.id}
                  className="border-border bg-surface hover:bg-surface-elevated rounded-xl border p-4 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{carte.nom}</h3>
                      <Badge variant="outline" className="mt-1 text-xs capitalize">
                        {carte.sport}
                      </Badge>
                    </div>
                    <span className="text-accent-gold text-lg font-bold">
                      {carte.tarifHeure}€
                      <span className="text-text-tertiary text-xs font-normal">/h</span>
                    </span>
                  </div>
                  <p className="text-text-secondary mt-2 text-sm">{carte.description}</p>
                </div>
              ))}
          </div>
        </div>

        {/* Avis */}
        <div className="mt-6">
          <h2 className="mb-3 font-semibold">Avis ({pro.avis.length})</h2>
          <div className="space-y-3">
            {pro.avis.map((avis) => (
              <div
                key={avis.id}
                className="border-border bg-surface rounded-xl border p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{avis.auteur}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          i < avis.note ? 'fill-warning text-warning' : 'text-border'
                        }
                      />
                    ))}
                  </div>
                </div>
                <p className="text-text-secondary mt-2 text-sm">{avis.commentaire}</p>
                <p className="text-text-tertiary mt-1 text-xs">{formatDate(avis.date)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar fixe */}
      <div className="border-border bg-background/95 fixed inset-x-0 bottom-0 z-50 border-t p-4 backdrop-blur-sm md:bottom-0">
        <div className="mx-auto flex max-w-2xl gap-3">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => router.push(`/messages`)}
          >
            <MessageCircle size={18} />
            Contacter
          </Button>
          <Button
            className="flex-1 gap-2"
            onClick={() => router.push(`/reservation/${pro.id}`)}
          >
            <Calendar size={18} />
            Réserver
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
