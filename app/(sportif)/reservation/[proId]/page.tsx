'use client';

import { use, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, CreditCard, Lock, MapPin } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { pros } from '@/lib/mock-data';

const MOCK_CRENEAUX = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

export default function ReservationPage({
  params,
}: {
  params: Promise<{ proId: string }>;
}) {
  const { proId } = use(params);
  const router = useRouter();
  const pro = pros.find((p) => p.id === proId);

  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedHeure, setSelectedHeure] = useState<string | null>(null);

  const prochains14Jours = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 14 }, (_, i) => addDays(today, i + 1));
  }, []);

  if (!pro) {
    return (
      <div className="flex flex-col items-center py-20">
        <p className="text-text-secondary">Pro introuvable</p>
      </div>
    );
  }

  const service = pro.cartesServices.find((c) => c.id === selectedService);
  const fraisNakama = service
    ? Math.round((service.tarifHeure * 0.035 + 0.5) * 100) / 100
    : 0;

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Retour */}
      <button
        onClick={() => (step > 0 ? setStep(step - 1) : router.back())}
        className="text-text-secondary hover:text-text-primary mb-6 flex items-center gap-2 text-sm"
      >
        <ArrowLeft size={18} />
        {step > 0 ? 'Retour' : 'Annuler'}
      </button>

      {/* Progress */}
      <div className="mb-8 flex gap-2">
        {[0, 1, 2].map((s) => (
          <div
            key={s}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              s <= step ? 'bg-accent-gold' : 'bg-border',
            )}
          />
        ))}
      </div>

      {/* ÉTAPE 1 — Choix service + créneau */}
      {step === 0 && (
        <div className="space-y-6">
          <h1 className="text-xl font-bold">Que veux-tu réserver ?</h1>

          {/* Services */}
          <div className="space-y-3">
            {pro.cartesServices
              .filter((c) => c.actif)
              .map((carte) => (
                <button
                  key={carte.id}
                  onClick={() => setSelectedService(carte.id)}
                  className={cn(
                    'w-full rounded-xl border p-4 text-left transition-all',
                    selectedService === carte.id
                      ? 'border-accent-gold bg-accent-gold/5'
                      : 'border-border bg-surface hover:bg-surface-elevated',
                  )}
                >
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{carte.nom}</h3>
                    <span className="text-accent-gold font-bold">
                      {carte.tarifHeure}€
                    </span>
                  </div>
                  <p className="text-text-secondary mt-1 text-sm">{carte.description}</p>
                </button>
              ))}
          </div>

          {/* Dates */}
          {selectedService && (
            <>
              <h2 className="text-text-secondary text-sm font-semibold">
                Choisis une date
              </h2>
              <div className="scrollbar-hide flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2">
                {prochains14Jours.map((date) => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  const isSelected = selectedDate === dateStr;
                  return (
                    <button
                      key={dateStr}
                      onClick={() => {
                        setSelectedDate(dateStr);
                        setSelectedHeure(null);
                      }}
                      className={cn(
                        'flex shrink-0 snap-start flex-col items-center rounded-xl border px-4 py-3 text-center transition-all',
                        isSelected
                          ? 'border-accent-gold bg-accent-gold/10'
                          : 'border-border bg-surface hover:bg-surface-elevated',
                      )}
                    >
                      <span className="text-text-tertiary text-xs uppercase">
                        {format(date, 'EEE', { locale: fr })}
                      </span>
                      <span className="text-lg font-bold">{format(date, 'd')}</span>
                      <span className="text-text-tertiary text-xs">
                        {format(date, 'MMM', { locale: fr })}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Heures */}
              {selectedDate && (
                <div className="flex flex-wrap gap-2">
                  {MOCK_CRENEAUX.map((h) => (
                    <button
                      key={h}
                      onClick={() => setSelectedHeure(h)}
                      className={cn(
                        'rounded-lg border px-4 py-2 text-sm font-medium transition-all',
                        selectedHeure === h
                          ? 'border-accent-gold bg-accent-gold text-background'
                          : 'border-border hover:border-text-tertiary',
                      )}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          <Button
            className="w-full"
            disabled={!selectedService || !selectedDate || !selectedHeure}
            onClick={() => setStep(1)}
          >
            Continuer
          </Button>
        </div>
      )}

      {/* ÉTAPE 2 — Récapitulatif */}
      {step === 1 && service && selectedDate && selectedHeure && (
        <div className="space-y-6">
          <h1 className="text-xl font-bold">Ta réservation</h1>

          <div className="border-border bg-surface space-y-4 rounded-xl border p-4">
            {/* Pro */}
            <div className="flex items-center gap-3">
              <div className="relative size-12 overflow-hidden rounded-full">
                <Image
                  src={pro.photo}
                  alt={pro.prenom}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-semibold">
                  {pro.prenom} {pro.nom}
                </p>
                <p className="text-text-secondary text-sm">{service.nom}</p>
              </div>
            </div>

            <div className="bg-border h-px" />

            <div className="space-y-2 text-sm">
              <div className="text-text-secondary flex items-center gap-2">
                <Calendar size={16} />
                {format(new Date(selectedDate), 'EEEE d MMMM yyyy', {
                  locale: fr,
                })}
              </div>
              <div className="text-text-secondary flex items-center gap-2">
                <Clock size={16} />
                {selectedHeure} · {service.dureeMinutes} min
              </div>
              <div className="text-text-secondary flex items-center gap-2">
                <MapPin size={16} />
                {pro.ville}
              </div>
            </div>

            <div className="bg-border h-px" />

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Séance</span>
                <span>{service.tarifHeure}€</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Frais Nakama (3,5% + 0,50€)</span>
                <span>{fraisNakama.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between pt-2 font-bold">
                <span>Total</span>
                <span className="text-accent-gold">
                  {(service.tarifHeure + fraisNakama).toFixed(2)}€
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep(0)}>
              Retour
            </Button>
            <Button className="flex-1" onClick={() => setStep(2)}>
              Payer
            </Button>
          </div>
        </div>
      )}

      {/* ÉTAPE 3 — Paiement simulé */}
      {step === 2 && service && (
        <div className="space-y-6">
          <h1 className="text-xl font-bold">Paiement</h1>

          {/* Carte bancaire visuelle */}
          <div className="from-accent-gold/20 via-accent-gold/5 to-surface relative h-44 overflow-hidden rounded-2xl bg-gradient-to-br p-5 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-text-tertiary text-xs uppercase">Total à payer</p>
                <p className="text-accent-gold mt-1 text-2xl font-bold">
                  {(service.tarifHeure + fraisNakama).toFixed(2)}€
                </p>
              </div>
              <CreditCard size={28} className="text-accent-gold/60" />
            </div>
            <p className="text-text-secondary absolute bottom-12 left-5 font-mono text-base tracking-widest">
              •••• •••• •••• 4242
            </p>
            <div className="absolute bottom-5 left-5 flex items-end gap-4 text-xs">
              <div>
                <p className="text-text-tertiary uppercase">Titulaire</p>
                <p className="font-medium">THOMAS LEROY</p>
              </div>
              <div>
                <p className="text-text-tertiary uppercase">Exp</p>
                <p className="font-medium">12/28</p>
              </div>
            </div>
          </div>

          <div className="border-border bg-surface space-y-4 rounded-xl border p-4">
            <div>
              <label className="text-text-secondary mb-1.5 block text-xs font-medium">
                Numéro de carte
              </label>
              <input
                type="text"
                defaultValue="4242 4242 4242 4242"
                placeholder="0000 0000 0000 0000"
                className="border-border bg-background focus:border-accent-gold focus:ring-accent-gold/30 h-12 w-full rounded-[10px] border px-4 font-mono text-sm tracking-wider focus:ring-2 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-text-secondary mb-1.5 block text-xs font-medium">
                  Expiration
                </label>
                <input
                  type="text"
                  defaultValue="12/28"
                  placeholder="MM/AA"
                  className="border-border bg-background focus:border-accent-gold focus:ring-accent-gold/30 h-12 w-full rounded-[10px] border px-4 font-mono text-sm focus:ring-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-text-secondary mb-1.5 block text-xs font-medium">
                  CVV
                </label>
                <input
                  type="text"
                  defaultValue="123"
                  placeholder="000"
                  className="border-border bg-background focus:border-accent-gold focus:ring-accent-gold/30 h-12 w-full rounded-[10px] border px-4 font-mono text-sm focus:ring-2 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="text-text-tertiary flex items-center justify-center gap-2 text-xs">
            <Lock size={12} />
            <span>Paiement sécurisé par</span>
            <span className="text-text-secondary inline-flex items-center rounded bg-[#635BFF] px-2 py-0.5 font-bold tracking-tight text-white">
              stripe
            </span>
          </div>

          <Button
            className="w-full"
            onClick={() => router.push('/reservation/confirmation')}
          >
            Confirmer le paiement de {(service.tarifHeure + fraisNakama).toFixed(2)}€
          </Button>

          <p className="text-text-tertiary text-center text-xs">
            Mode démo : aucune carte n&apos;est débitée.
          </p>
        </div>
      )}
    </div>
  );
}
