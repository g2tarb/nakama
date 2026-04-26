'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/sportif/onboarding/progress-bar';
import { StepWrapper } from '@/components/sportif/onboarding/step-wrapper';
import { VibeSlider } from '@/components/sportif/onboarding/vibe-slider';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores/user-store';
import { useModeStore } from '@/stores/mode-store';
import { SPORTS_DISPONIBLES, OBJECTIFS, NIVEAUX, FREQUENCES } from '@/lib/constants';
import { onboardingSportifSchema } from '@/lib/schemas';
import type { Sportif, Genre, Objectif, Sport, Niveau } from '@/types';

const TOTAL_STEPS = 6;

function PillButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-4 py-2 text-sm font-medium transition-all',
        selected
          ? 'border-accent-gold bg-accent-gold text-background'
          : 'border-border text-text-primary hover:border-text-tertiary',
      )}
    >
      {children}
    </button>
  );
}

export default function InscriptionSportifPage() {
  const router = useRouter();
  const setSportif = useUserStore((s) => s.setSportif);
  const setMode = useModeStore((s) => s.setMode);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [done, setDone] = useState(false);

  // Étape 1 — Identité
  const [prenom, setPrenom] = useState('');
  const [age, setAge] = useState(25);
  const [genre, setGenre] = useState<Genre>('homme');

  // Étape 2 — Objectifs
  const [objectifs, setObjectifs] = useState<Objectif[]>([]);

  // Étape 3 — Sports
  const [sports, setSports] = useState<Sport[]>([]);

  // Étape 4 — Niveau
  const [niveau, setNiveau] = useState<Niveau>('intermediaire');
  const [contraintes, setContraintes] = useState('');
  const [frequence, setFrequence] = useState<'1x' | '2-3x' | '4+'>('2-3x');

  // Étape 5 — Localisation & budget
  const [ville, setVille] = useState('Paris');
  const [codePostal, setCodePostal] = useState('75011');
  const [rayonKm, setRayonKm] = useState(10);
  const [budgetMin, setBudgetMin] = useState(30);
  const [budgetMax, setBudgetMax] = useState(70);

  // Étape 6 — Vibe
  const [pedagogieDiscipline, setPedagogieDiscipline] = useState(5);
  const [suiviAutonomie, setSuiviAutonomie] = useState(5);
  const [dataRessenti, setDataRessenti] = useState(5);

  const goNext = useCallback(() => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  function toggleInArray<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
  }

  function handleValidation() {
    const input = {
      prenom: prenom || 'Thomas',
      age,
      genre,
      objectifs,
      sports,
      ...(contraintes ? { contraintes } : {}),
      niveau,
      frequence,
      ville,
      codePostal,
      rayonKm,
      budgetMin,
      budgetMax,
      vibe: { pedagogieDiscipline, suiviAutonomie, dataRessenti },
    };

    const parsed = onboardingSportifSchema.safeParse(input);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      alert(`Champ invalide : ${firstError?.path.join('.')} — ${firstError?.message}`);
      return;
    }

    const sportif: Sportif = {
      id: 'sportif-user',
      nom: 'DEMO',
      photo:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
      ...parsed.data,
    };

    setSportif(sportif);
    setMode('sportif');
    setDone(true);

    setTimeout(() => {
      router.push('/accueil');
    }, 1200);
  }

  // Écran de confirmation
  if (done) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="bg-success/20 flex size-20 items-center justify-center rounded-full"
        >
          <Check size={40} className="text-success" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg font-semibold"
        >
          Profil créé !
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-text-secondary text-sm"
        >
          On cherche tes meilleurs matchs...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg px-4">
      {/* Logo */}
      <div className="mb-6 text-center">
        <span className="text-accent-gold text-2xl font-bold">NAKAMA</span>
      </div>

      {/* Barre de progression */}
      <div className="mb-8">
        <ProgressBar
          currentStep={step}
          totalSteps={TOTAL_STEPS}
          onStepClick={(s) => {
            setDirection(s < step ? -1 : 1);
            setStep(s);
          }}
        />
      </div>

      <StepWrapper stepKey={step} direction={direction}>
        {/* ÉTAPE 1 — Qui es-tu ? */}
        {step === 0 && (
          <div className="space-y-6">
            <h2 className="text-center text-xl font-bold">Qui es-tu ?</h2>
            <div>
              <label className="text-text-secondary mb-1.5 block text-sm">Prénom</label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Ton prénom"
                className="border-border bg-surface focus:border-accent-gold focus:ring-accent-gold/30 h-12 w-full rounded-[10px] border px-4 text-sm focus:ring-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-text-secondary mb-1.5 block text-sm">
                Âge : {age} ans
              </label>
              <input
                type="range"
                min={16}
                max={70}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="vibe-slider w-full"
              />
            </div>
            <div>
              <label className="text-text-secondary mb-2 block text-sm">Genre</label>
              <div className="flex gap-3">
                {(
                  [
                    { value: 'homme', label: 'Homme' },
                    { value: 'femme', label: 'Femme' },
                    { value: 'autre', label: 'Autre' },
                  ] as const
                ).map(({ value, label }) => (
                  <PillButton
                    key={value}
                    selected={genre === value}
                    onClick={() => setGenre(value)}
                  >
                    {label}
                  </PillButton>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 — Objectifs */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-center text-xl font-bold">Ton objectif</h2>
            <p className="text-text-secondary text-center text-sm">
              Sélectionne un ou plusieurs objectifs
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {OBJECTIFS.map(({ value, label }) => (
                <PillButton
                  key={value}
                  selected={objectifs.includes(value)}
                  onClick={() => setObjectifs(toggleInArray(objectifs, value))}
                >
                  {label}
                </PillButton>
              ))}
            </div>
          </div>
        )}

        {/* ÉTAPE 3 — Sports */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-center text-xl font-bold">Ton sport</h2>
            <p className="text-text-secondary text-center text-sm">
              Quels sports te tentent ?
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {SPORTS_DISPONIBLES.map(({ value, label }) => (
                <PillButton
                  key={value}
                  selected={sports.includes(value)}
                  onClick={() => setSports(toggleInArray(sports, value))}
                >
                  {label}
                </PillButton>
              ))}
            </div>
          </div>
        )}

        {/* ÉTAPE 4 — Niveau et contraintes */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-center text-xl font-bold">Niveau et contraintes</h2>
            <div>
              <label className="text-text-secondary mb-2 block text-sm">Ton niveau</label>
              <div className="flex gap-3">
                {NIVEAUX.map(({ value, label }) => (
                  <PillButton
                    key={value}
                    selected={niveau === value}
                    onClick={() => setNiveau(value)}
                  >
                    {label}
                  </PillButton>
                ))}
              </div>
            </div>
            <div>
              <label className="text-text-secondary mb-1.5 block text-sm">
                Antécédents / contraintes (optionnel)
              </label>
              <textarea
                value={contraintes}
                onChange={(e) => setContraintes(e.target.value)}
                placeholder="Ex : ancienne blessure genou..."
                rows={3}
                className="border-border bg-surface focus:border-accent-gold focus:ring-accent-gold/30 w-full rounded-[10px] border px-4 py-3 text-sm focus:ring-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-text-secondary mb-2 block text-sm">
                Fréquence souhaitée
              </label>
              <div className="flex gap-3">
                {FREQUENCES.map(({ value, label }) => (
                  <PillButton
                    key={value}
                    selected={frequence === value}
                    onClick={() => setFrequence(value)}
                  >
                    {label}
                  </PillButton>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 5 — Localisation & budget */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-center text-xl font-bold">Localisation et budget</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-text-secondary mb-1.5 block text-sm">Ville</label>
                <input
                  type="text"
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  className="border-border bg-surface focus:border-accent-gold focus:ring-accent-gold/30 h-12 w-full rounded-[10px] border px-4 text-sm focus:ring-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-text-secondary mb-1.5 block text-sm">
                  Code postal
                </label>
                <input
                  type="text"
                  value={codePostal}
                  onChange={(e) => setCodePostal(e.target.value)}
                  className="border-border bg-surface focus:border-accent-gold focus:ring-accent-gold/30 h-12 w-full rounded-[10px] border px-4 text-sm focus:ring-2 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-text-secondary mb-1.5 block text-sm">
                Rayon de recherche : {rayonKm} km
              </label>
              <input
                type="range"
                min={1}
                max={50}
                value={rayonKm}
                onChange={(e) => setRayonKm(Number(e.target.value))}
                className="vibe-slider w-full"
              />
            </div>
            <div>
              <label className="text-text-secondary mb-1.5 block text-sm">
                Budget par séance : {budgetMin}€ — {budgetMax}€
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={20}
                  max={150}
                  value={budgetMin}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setBudgetMin(Math.min(val, budgetMax - 5));
                  }}
                  className="vibe-slider flex-1"
                />
                <input
                  type="range"
                  min={20}
                  max={150}
                  value={budgetMax}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setBudgetMax(Math.max(val, budgetMin + 5));
                  }}
                  className="vibe-slider flex-1"
                />
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 6 — Ta vibe (CRITIQUE) */}
        {step === 5 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-xl font-bold">Ta vibe</h2>
              <p className="text-text-secondary mt-1 text-sm">
                Quel type de coach te correspond ?
              </p>
            </div>

            <div className="border-border bg-surface space-y-8 rounded-xl border p-6">
              <VibeSlider
                labelLeft="Pédagogie, écoute"
                labelRight="Discipline, dépassement"
                value={pedagogieDiscipline}
                onChange={setPedagogieDiscipline}
              />
              <div className="bg-border h-px" />
              <VibeSlider
                labelLeft="Suivi quotidien, réactif"
                labelRight="Point hebdo, autonomie"
                value={suiviAutonomie}
                onChange={setSuiviAutonomie}
              />
              <div className="bg-border h-px" />
              <VibeSlider
                labelLeft="Approche data, mesures"
                labelRight="Approche ressenti"
                value={dataRessenti}
                onChange={setDataRessenti}
              />
            </div>
          </div>
        )}
      </StepWrapper>

      {/* Navigation */}
      <div className="mt-8 flex gap-3">
        {step > 0 && (
          <Button variant="outline" onClick={goPrev} className="flex-1">
            Retour
          </Button>
        )}
        {step < TOTAL_STEPS - 1 ? (
          <Button onClick={goNext} className="flex-1">
            Continuer
          </Button>
        ) : (
          <Button onClick={handleValidation} className="flex-1">
            Valider mon profil
          </Button>
        )}
      </div>
    </div>
  );
}
