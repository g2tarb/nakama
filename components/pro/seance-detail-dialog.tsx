'use client';

import Link from 'next/link';
import { ChevronRight, Globe, MapPin, Star } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { pros, sportifs } from '@/lib/mock-data';
import { SPORTS_DISPONIBLES } from '@/lib/constants';
import { formatPrice } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import type { Seance } from '@/types';

interface SeanceDetailDialogProps {
  seance: Seance | null;
  open: boolean;
  onClose: () => void;
  onCancel?: (id: string) => void;
}

const STATUT_PILL: Record<Seance['statut'], { label: string; cls: string }> = {
  confirmee: { label: 'Confirmée', cls: 'bg-accent-gold/15 text-accent-gold' },
  en_attente: { label: 'En attente', cls: 'bg-warning/15 text-warning' },
  annulee: { label: 'Annulée', cls: 'bg-danger/15 text-danger' },
  terminee: { label: 'Terminée', cls: 'bg-success/15 text-success' },
};

const FORMAT_LABEL: Record<string, string> = {
  presentiel: 'Présentiel',
  distanciel: 'Visio',
  hybride: 'Hybride',
};

export function SeanceDetailDialog({
  seance,
  open,
  onClose,
  onCancel,
}: SeanceDetailDialogProps) {
  if (!seance) return null;

  const pro = pros.find((p) => p.id === seance.proId);
  const carte = pro?.cartesServices.find((c) => c.id === seance.carteServiceId);
  const sportif = sportifs.find((s) => s.id === seance.sportifId);

  const sportLabel =
    SPORTS_DISPONIBLES.find((s) => s.value === carte?.sport)?.label ?? carte?.sport ?? '';
  const formatLabel = carte?.format ? (FORMAT_LABEL[carte.format] ?? carte.format) : null;

  const start = new Date(seance.date);
  const end = new Date(start.getTime() + seance.dureeMinutes * 60_000);
  const statut = STATUT_PILL[seance.statut];

  const canCancel = seance.statut === 'confirmee' || seance.statut === 'en_attente';

  const handleCancel = () => {
    if (!onCancel) return;
    if (
      window.confirm(
        `Confirmer l'annulation de la séance du ${format(start, 'EEEE d MMMM à HH:mm', { locale: fr })} ?`,
      )
    ) {
      onCancel(seance.id);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="capitalize">
            {format(start, 'EEEE d MMMM', { locale: fr })}
          </DialogTitle>
          <DialogDescription>
            {format(start, 'HH:mm')} – {format(end, 'HH:mm')} · {seance.dureeMinutes} min
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium',
                statut.cls,
              )}
            >
              {statut.label}
            </span>
            <span className="text-text-secondary text-xs">·</span>
            <span className="text-text-secondary text-xs">
              {sportLabel}
              {formatLabel ? ` · ${formatLabel}` : ''}
            </span>
          </div>

          {carte && (
            <div className="border-border/40 bg-card rounded-lg border p-3">
              <div className="text-text-primary text-[13.5px] font-medium">
                {carte.nom}
              </div>
              <div className="text-text-tertiary mt-0.5 text-xs">{carte.description}</div>
            </div>
          )}

          {sportif && (
            <Link
              href={`/clients/${sportif.id}`}
              onClick={onClose}
              className="bg-card border-border/40 hover:bg-surface-elevated group flex items-center gap-3 rounded-lg border p-3 transition-colors"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{
                  background: 'linear-gradient(135deg,#262626,#131313)',
                  color: 'rgba(229,181,71,0.7)',
                }}
              >
                {(sportif.prenom[0] ?? '') + (sportif.nom[0] ?? '')}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-text-primary truncate text-[13.5px] font-medium">
                  {sportif.prenom} {sportif.nom}
                </div>
                <div className="text-text-tertiary text-[11px]">
                  Voir la fiche athlète
                </div>
              </div>
              <ChevronRight
                size={16}
                className="text-text-tertiary group-hover:text-accent-gold transition-colors"
              />
            </Link>
          )}

          <div className="flex items-start gap-2">
            {carte?.format === 'distanciel' ? (
              <Globe size={16} className="text-accent-gold mt-0.5 shrink-0" />
            ) : (
              <MapPin size={16} className="text-accent-gold mt-0.5 shrink-0" />
            )}
            <div className="flex-1">
              <div className="text-text-tertiary text-[11px] tracking-wider uppercase">
                Lieu
              </div>
              <div className="text-text-primary text-[13.5px]">{seance.lieu}</div>
            </div>
            <div className="text-accent-gold shrink-0 text-base font-bold tabular-nums">
              {formatPrice(seance.tarif)}
            </div>
          </div>

          {seance.ressentiClient != null && (
            <div className="border-border/40 bg-card rounded-lg border p-3">
              <div className="text-text-tertiary mb-1.5 text-[11px] tracking-wider uppercase">
                Ressenti sportif
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={cn(
                      i < seance.ressentiClient!
                        ? 'text-warning fill-warning'
                        : 'text-border',
                    )}
                  />
                ))}
                <span className="text-text-secondary ml-1 text-xs">
                  {seance.ressentiClient}/4
                </span>
              </div>
            </div>
          )}

          {seance.compteRenduCoach && (
            <div className="border-border/40 bg-card rounded-lg border p-3">
              <div className="text-text-tertiary mb-1 text-[11px] tracking-wider uppercase">
                Notes coach (privées)
              </div>
              <p className="text-text-primary text-[13px] leading-relaxed">
                {seance.compteRenduCoach}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="sm:flex-1"
            disabled
            title="Disponible en V2"
          >
            Reprogrammer
          </Button>
          {canCancel && onCancel && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="sm:flex-1"
              onClick={handleCancel}
            >
              Annuler la séance
            </Button>
          )}
          {!canCancel && (
            <Button
              type="button"
              variant="default"
              size="sm"
              className="sm:flex-1"
              onClick={onClose}
            >
              Fermer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
