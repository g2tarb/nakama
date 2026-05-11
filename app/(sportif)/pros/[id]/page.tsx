'use client';

import { use, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Calendar, Heart, MapPin, MessageCircle, Star } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { useCountUp } from '@/hooks/use-count-up';
import { pros } from '@/lib/mock-data';
import { SPECIALITES, SPORTS_DISPONIBLES } from '@/lib/constants';
import { formatPricePerHour, formatDate } from '@/lib/formatters';
import { useUserStore } from '@/stores/user-store';
import { computeMatchScore } from '@/lib/matching';
import { cn } from '@/lib/utils';

export default function FicheProPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const sportif = useUserStore((s) => s.sportif);

  const pro = pros.find((p) => p.id === id);

  const matchScore = useMemo(() => {
    if (!sportif || !pro) return null;
    return computeMatchScore(sportif, pro);
  }, [sportif, pro]);

  const animatedScore = useCountUp(matchScore?.scoreTotal ?? 0, 1100);

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

  const sportLabel = (value: string) =>
    SPORTS_DISPONIBLES.find((s) => s.value === value)?.label ?? value;

  return (
    <div className="pb-40 md:pb-24">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-[280px] w-full"
      >
        <Image
          src={pro.photo}
          alt={`${pro.prenom} ${pro.nom}`}
          fill
          sizes="(max-width: 768px) 100vw, 640px"
          priority
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 35%, rgba(10,10,10,0.6) 75%, var(--color-background) 100%)',
          }}
        />

        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Retour"
          className="absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-all hover:bg-black/65 active:translate-y-px"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          type="button"
          aria-label="Ajouter aux favoris"
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-all hover:bg-black/65 active:translate-y-px"
        >
          <Heart size={18} />
        </button>

        {matchScore && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="text-accent-gold absolute bottom-12 left-4 inline-flex items-center rounded-lg px-2.5 py-1 text-sm font-bold tabular-nums backdrop-blur-sm"
            style={{
              background: 'rgba(229,181,71,0.22)',
              boxShadow: '0 0 16px rgba(229,181,71,0.2)',
            }}
          >
            {animatedScore} % compatible
          </motion.div>
        )}
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="mx-auto -mt-8 max-w-[480px] px-4 md:max-w-[640px]"
      >
        <h1 className="nk-h1 text-text-primary tracking-[-0.02em]">
          {pro.prenom} {pro.nom}
        </h1>
        <div className="text-text-secondary mt-1.5 flex flex-wrap items-center gap-2 text-sm">
          <span>{specialiteLabel}</span>
          <span className="text-text-tertiary">·</span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} />
            {pro.ville}
          </span>
        </div>

        <div className="border-border/40 mt-5 flex items-stretch gap-3 rounded-xl border-y py-4">
          <Stat label="Note" value={pro.note.toFixed(1)} highlight />
          <StatDivider />
          <Stat label="Avis" value={String(pro.nbAvis)} />
          <StatDivider />
          <Stat label="Tarif" value={formatPricePerHour(pro.tarifMin)} accent />
        </div>

        <Section title="À propos">
          <p className="text-text-primary text-[15px] leading-relaxed">{pro.bio}</p>
          <div className="text-text-tertiary mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <span>{pro.anneesExperience} ans d’expérience</span>
            {pro.formations.map((f) => (
              <span key={f}>{f}</span>
            ))}
          </div>
        </Section>

        <Section title="Spécialités">
          <div className="flex flex-wrap gap-1.5">
            {pro.sports.map((sport) => (
              <span
                key={sport}
                className="border-border/60 text-text-secondary inline-flex rounded-full border px-2.5 py-1 text-[12px]"
              >
                {sportLabel(sport)}
              </span>
            ))}
            {pro.formats.map((format) => (
              <span
                key={format}
                className="border-accent-muted/50 text-accent-gold inline-flex rounded-full border px-2.5 py-1 text-[12px] capitalize"
              >
                {format}
              </span>
            ))}
          </div>
        </Section>

        {pro.cartesServices.filter((c) => c.actif).length > 0 && (
          <Section title="Cartes de service">
            <div className="flex flex-col gap-2.5">
              {pro.cartesServices
                .filter((c) => c.actif)
                .map((carte) => (
                  <div
                    key={carte.id}
                    className="border-border/40 bg-card hover:bg-surface-elevated rounded-xl border p-4 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-text-primary text-[15px] font-semibold">
                          {carte.nom}
                        </h3>
                        <span className="border-border/60 text-text-tertiary mt-1 inline-flex rounded-full border px-2 py-0.5 text-[11px]">
                          {sportLabel(carte.sport)}
                        </span>
                      </div>
                      <span className="text-accent-gold shrink-0 text-lg font-bold tabular-nums">
                        {carte.tarifHeure} €
                        <span className="text-text-tertiary text-xs font-normal">
                          {' '}
                          /h
                        </span>
                      </span>
                    </div>
                    <p className="text-text-secondary mt-2 text-[13px] leading-relaxed">
                      {carte.description}
                    </p>
                  </div>
                ))}
            </div>
          </Section>
        )}

        {pro.avis.length > 0 && (
          <Section title={`Avis (${pro.avis.length})`}>
            <div className="flex flex-col gap-2.5">
              {pro.avis.map((avis) => (
                <div
                  key={avis.id}
                  className="border-border/40 bg-card rounded-xl border p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-text-primary text-[13px] font-semibold">
                      {avis.auteur}
                    </span>
                    <div className="flex items-center gap-0.5">
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
                  <p className="text-text-secondary mt-1.5 text-[13px] leading-relaxed">
                    {avis.commentaire}
                  </p>
                  <p className="text-text-tertiary mt-1.5 text-[11px]">
                    {formatDate(avis.date)}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        )}
      </motion.div>

      <div className="border-border bg-background/90 fixed inset-x-0 bottom-20 z-40 border-t p-3 backdrop-blur-md md:bottom-0">
        <div className="mx-auto flex max-w-[480px] gap-2.5 md:max-w-[640px]">
          <button
            type="button"
            onClick={() => router.push('/messages')}
            aria-label="Contacter"
            className="border-border/60 hover:border-accent-muted text-text-primary hover:bg-surface-elevated flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-all active:translate-y-px"
          >
            <MessageCircle size={18} />
          </button>
          <button
            type="button"
            onClick={() => router.push(`/reservation/${pro.id}`)}
            className="bg-primary text-primary-foreground hover:bg-accent-gold-hover flex flex-1 items-center justify-center gap-2 rounded-xl text-[15px] font-semibold transition-all hover:-translate-y-px active:translate-y-px"
          >
            <Calendar size={18} />
            Réserver une séance
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <div className="text-accent-muted mb-2.5 text-[11px] font-semibold tracking-[0.08em] uppercase">
        {title}
      </div>
      {children}
    </section>
  );
}

function Stat({
  label,
  value,
  accent,
  highlight,
}: {
  label: string;
  value: string;
  accent?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-1">
      <div
        className={cn(
          'text-[18px] font-bold tabular-nums',
          accent ? 'text-accent-gold' : 'text-text-primary',
          highlight && 'flex items-center gap-1',
        )}
      >
        {highlight && <Star size={14} className="fill-warning text-warning" />}
        {value}
      </div>
      <div className="text-text-tertiary text-[11px]">{label}</div>
    </div>
  );
}

function StatDivider() {
  return <div className="bg-border/60 w-px self-stretch" aria-hidden="true" />;
}
