'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUserStore } from '@/stores/user-store';
import { pros } from '@/lib/mock-data';
import { formatPricePerHour } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { SPORTS_DISPONIBLES } from '@/lib/constants';
import { carteServiceCreateSchema, type CarteServiceCreateInput } from '@/lib/schemas';
import type { CarteService } from '@/types';

const QUOTA: Record<'standard' | 'premium' | 'elite', number> = {
  standard: 1,
  premium: 3,
  elite: 99,
};

export default function CartesServicesPage() {
  const proFromStore = useUserStore((s) => s.pro);
  const basePro = proFromStore ?? pros[4]!;

  const [cartes, setCartes] = useState<CarteService[]>(basePro.cartesServices);
  const [open, setOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const maxCartes = QUOTA[basePro.formule];
  const activeCount = cartes.filter((c) => c.actif).length;
  const quotaReached = activeCount >= maxCartes;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CarteServiceCreateInput>({
    resolver: zodResolver(carteServiceCreateSchema),
    defaultValues: {
      nom: '',
      sport: 'fitness',
      description: '',
      tarifHeure: 60,
      dureeMinutes: 60,
      format: 'presentiel',
    },
    mode: 'onBlur',
  });

  const sport = watch('sport');
  const format = watch('format');

  function handleAdd() {
    if (quotaReached) {
      setUpgradeOpen(true);
      return;
    }
    setOpen(true);
  }

  const onSubmit = (data: CarteServiceCreateInput) => {
    const newCarte: CarteService = {
      id: `cs-${Date.now()}`,
      nom: data.nom,
      sport: data.sport,
      description: data.description,
      tarifHeure: data.tarifHeure,
      dureeMinutes: data.dureeMinutes,
      tags: [],
      format: data.format,
      actif: true,
      nbReservations: 0,
      caGenere: 0,
    };
    setCartes((prev) => [...prev, newCarte]);
    reset();
    setOpen(false);
  };

  function handleToggle(id: string) {
    setCartes((prev) => prev.map((c) => (c.id === id ? { ...c, actif: !c.actif } : c)));
  }

  function handleDelete(id: string) {
    setCartes((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="px-4 py-6 lg:px-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-accent-gold text-xl font-bold">Cartes de service</h1>
          <p className="text-text-secondary mt-1 text-sm">
            {activeCount} carte{activeCount > 1 ? 's' : ''} active
            {activeCount > 1 ? 's' : ''} sur {maxCartes === 99 ? '∞' : maxCartes} —
            formule <span className="capitalize">{basePro.formule}</span>
          </p>
        </div>
        <Button onClick={handleAdd} size="sm" className="gap-2">
          <Plus size={16} />
          Nouvelle carte
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cartes.map((carte) => (
          <div key={carte.id} className="border-border bg-surface rounded-xl border p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{carte.nom}</h3>
                <Badge variant="outline" className="mt-1 text-xs capitalize">
                  {carte.sport}
                </Badge>
              </div>
              <span className="text-accent-gold text-lg font-bold">
                {formatPricePerHour(carte.tarifHeure)}
              </span>
            </div>
            <p className="text-text-secondary mt-2 text-sm">{carte.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <button
                onClick={() => handleToggle(carte.id)}
                className="cursor-pointer"
                aria-label={carte.actif ? 'Désactiver' : 'Activer'}
              >
                <Badge
                  className={
                    carte.actif
                      ? 'bg-success/10 text-success'
                      : 'bg-muted text-text-tertiary'
                  }
                >
                  {carte.actif ? 'Actif' : 'Inactif'}
                </Badge>
              </button>
              <div className="flex gap-2">
                <button
                  className="text-text-tertiary hover:text-text-primary"
                  aria-label="Modifier"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(carte.id)}
                  className="text-text-tertiary hover:text-danger"
                  aria-label="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="text-text-tertiary mt-3 text-xs">
              {carte.nbReservations} réservations · {carte.caGenere}€ CA généré
            </p>
          </div>
        ))}

        <button
          onClick={handleAdd}
          className="border-border text-text-tertiary hover:border-accent-gold/40 hover:text-text-secondary flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-5 transition-colors"
        >
          {quotaReached ? <Lock size={24} /> : <Plus size={24} />}
          <span className="text-sm font-medium">
            {quotaReached
              ? 'Quota atteint — passer en supérieur'
              : 'Créer une nouvelle carte'}
          </span>
        </button>
      </div>

      {/* Dialog création */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nouvelle carte de service</DialogTitle>
            <DialogDescription>
              Crée un service que tu proposes à tes clients.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            <div>
              <label className="text-text-secondary mb-1.5 block text-xs font-medium">
                Nom du service
              </label>
              <input
                {...register('nom')}
                placeholder="Ex. Préparation marathon"
                className={cn(
                  'border-border bg-surface focus:border-accent-gold focus:ring-accent-gold/30 h-10 w-full rounded-[10px] border px-3 text-sm focus:ring-2 focus:outline-none',
                  errors.nom && 'border-destructive',
                )}
              />
              {errors.nom && (
                <p className="text-destructive mt-1 text-xs">{errors.nom.message}</p>
              )}
            </div>

            <div>
              <label className="text-text-secondary mb-1.5 block text-xs font-medium">
                Sport
              </label>
              <div className="flex flex-wrap gap-2">
                {SPORTS_DISPONIBLES.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setValue('sport', value, { shouldValidate: true })}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                      sport === value
                        ? 'border-accent-gold bg-accent-gold text-background'
                        : 'border-border text-text-secondary hover:border-text-tertiary',
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-text-secondary mb-1.5 block text-xs font-medium">
                Description
              </label>
              <textarea
                {...register('description')}
                placeholder="20 caractères minimum…"
                rows={3}
                className={cn(
                  'border-border bg-surface focus:border-accent-gold focus:ring-accent-gold/30 w-full resize-none rounded-[10px] border px-3 py-2 text-sm focus:ring-2 focus:outline-none',
                  errors.description && 'border-destructive',
                )}
              />
              {errors.description && (
                <p className="text-destructive mt-1 text-xs">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-text-secondary mb-1.5 block text-xs font-medium">
                  Tarif (€/h)
                </label>
                <input
                  {...register('tarifHeure', { valueAsNumber: true })}
                  type="number"
                  min={10}
                  max={500}
                  className={cn(
                    'border-border bg-surface focus:border-accent-gold focus:ring-accent-gold/30 h-10 w-full rounded-[10px] border px-3 text-sm focus:ring-2 focus:outline-none',
                    errors.tarifHeure && 'border-destructive',
                  )}
                />
                {errors.tarifHeure && (
                  <p className="text-destructive mt-1 text-xs">
                    {errors.tarifHeure.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-text-secondary mb-1.5 block text-xs font-medium">
                  Durée (min)
                </label>
                <input
                  {...register('dureeMinutes', { valueAsNumber: true })}
                  type="number"
                  min={30}
                  max={180}
                  step={15}
                  className={cn(
                    'border-border bg-surface focus:border-accent-gold focus:ring-accent-gold/30 h-10 w-full rounded-[10px] border px-3 text-sm focus:ring-2 focus:outline-none',
                    errors.dureeMinutes && 'border-destructive',
                  )}
                />
                {errors.dureeMinutes && (
                  <p className="text-destructive mt-1 text-xs">
                    {errors.dureeMinutes.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="text-text-secondary mb-1.5 block text-xs font-medium">
                Format
              </label>
              <div className="flex gap-2">
                {(['presentiel', 'distanciel', 'hybride'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setValue('format', f, { shouldValidate: true })}
                    className={cn(
                      'flex-1 rounded-[10px] border py-2 text-xs font-medium capitalize transition-all',
                      format === f
                        ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                        : 'border-border text-text-secondary hover:border-text-tertiary',
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                Créer la carte
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog upgrade */}
      <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Quota atteint</DialogTitle>
            <DialogDescription>
              Ta formule <strong className="capitalize">{basePro.formule}</strong>{' '}
              autorise {maxCartes === 99 ? 'illimité' : maxCartes} carte
              {maxCartes > 1 ? 's' : ''}. Passe en formule supérieure pour proposer plus
              de services.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpgradeOpen(false)}>
              Plus tard
            </Button>
            <Button onClick={() => (window.location.href = '/parametres')}>
              Voir les formules
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
