'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/sportif/onboarding/progress-bar';
import { StepWrapper } from '@/components/sportif/onboarding/step-wrapper';
import { VibeSlider } from '@/components/sportif/onboarding/vibe-slider';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores/user-store';
import { useModeStore } from '@/stores/mode-store';
import { SPORTS_DISPONIBLES, SPECIALITES, FORMULES } from '@/lib/constants';
import type { Pro, Sport, Specialite, Format, Formule } from '@/types';

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

export default function InscriptionProPage() {
  const router = useRouter();
  const setPro = useUserStore((s) => s.setPro);
  const setMode = useModeStore((s) => s.setMode);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [done, setDone] = useState(false);

  // Étape 1 — Infos personnelles
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [bio, setBio] = useState('');

  // Étape 2 — Expertise
  const [specialite, setSpecialite] = useState<Specialite>('coach_sportif');
  const [formations, setFormations] = useState<string[]>(['']);
  const [anneesExperience, setAnneesExperience] = useState(5);

  // Étape 3 — Première carte de service
  const [carteSport, setCarteSport] = useState<Sport>('fitness');
  const [carteNom, setCarteNom] = useState('');
  const [carteTarif, setCarteTarif] = useState(50);
  const [carteDuree, setCarteDuree] = useState(60);
  const [carteDescription, setCarteDescription] = useState('');

  // Étape 4 — Zones et formats
  const [ville, setVille] = useState('Paris');
  const [codePostal, setCodePostal] = useState('75011');
  const [rayonKm, setRayonKm] = useState(10);
  const [formats, setFormats] = useState<Format[]>(['presentiel']);

  // Étape 5 — Formule
  const [formule, setFormule] = useState<Formule>('premium');

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

  function toggleFormat(f: Format) {
    setFormats((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  }

  function handleValidation() {
    const pro: Pro = {
      id: 'pro-user',
      prenom: prenom || 'Julie',
      nom: (nom || 'MARTIN').toUpperCase(),
      photo:
        'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop&q=80',
      specialite,
      sports: [carteSport],
      bio: bio || 'Coach passionné(e) et à votre écoute.',
      anneesExperience,
      formations: formations.filter(Boolean),
      ville,
      codePostal,
      rayonKm,
      formats,
      formule,
      note: 4.8,
      nbAvis: 0,
      avis: [],
      cartesServices: [
        {
          id: 'cs-user-001',
          nom: carteNom || 'Séance découverte',
          sport: carteSport,
          description: carteDescription || 'Première séance personnalisée.',
          tarifHeure: carteTarif,
          dureeMinutes: carteDuree,
          tags: [],
          format: formats[0] ?? 'presentiel',
          actif: true,
          nbReservations: 0,
          caGenere: 0,
        },
      ],
      niveauEnseigne: ['debutant', 'intermediaire', 'avance'],
      tarifMin: carteTarif,
      tarifMax: carteTarif,
      vibe: { pedagogieDiscipline, suiviAutonomie, dataRessenti },
    };

    setPro(pro);
    setMode('pro');
    setDone(true);

    setTimeout(() => {
      router.push('/dashboard');
    }, 1200);
  }

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
          Profil pro créé !
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-text-secondary text-sm"
        >
          Bienvenue sur ton dashboard...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg px-4">
      <div className="mb-6 text-center">
        <span className="text-accent-gold text-2xl font-bold">NAKAMA</span>
        <span className="bg-accent-gold/10 text-accent-gold ml-2 rounded-full px-2 py-0.5 text-xs font-medium">
          Pro
        </span>
      </div>

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
        {/* ÉTAPE 1 — Infos personnelles */}
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="text-center text-xl font-bold">Informations personnelles</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-text-secondary mb-1.5 block text-sm">Prénom</label>
                <input
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Julie"
                  className="border-border bg-surface focus:border-accent-gold focus:ring-accent-gold/30 h-12 w-full rounded-[10px] border px-4 text-sm focus:ring-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-text-secondary mb-1.5 block text-sm">Nom</label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Martin"
                  className="border-border bg-surface focus:border-accent-gold focus:ring-accent-gold/30 h-12 w-full rounded-[10px] border px-4 text-sm focus:ring-2 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-text-secondary mb-1.5 block text-sm">
                Bio (ce que verront les sportifs)
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Décris-toi en quelques lignes..."
                rows={4}
                className="border-border bg-surface focus:border-accent-gold focus:ring-accent-gold/30 w-full rounded-[10px] border px-4 py-3 text-sm focus:ring-2 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* ÉTAPE 2 — Expertise */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-center text-xl font-bold">Ton expertise</h2>
            <div>
              <label className="text-text-secondary mb-2 block text-sm">Spécialité</label>
              <div className="flex flex-wrap gap-2">
                {SPECIALITES.map(({ value, label }) => (
                  <PillButton
                    key={value}
                    selected={specialite === value}
                    onClick={() => setSpecialite(value)}
                  >
                    {label}
                  </PillButton>
                ))}
              </div>
            </div>
            <div>
              <label className="text-text-secondary mb-1.5 block text-sm">
                Années d&apos;expérience : {anneesExperience} ans
              </label>
              <input
                type="range"
                min={1}
                max={20}
                value={anneesExperience}
                onChange={(e) => setAnneesExperience(Number(e.target.value))}
                className="vibe-slider w-full"
              />
            </div>
            <div>
              <label className="text-text-secondary mb-2 block text-sm">
                Diplômes / certifications
              </label>
              {formations.map((f, i) => (
                <div key={i} className="mb-2 flex gap-2">
                  <input
                    type="text"
                    value={f}
                    onChange={(e) => {
                      const next = [...formations];
                      next[i] = e.target.value;
                      setFormations(next);
                    }}
                    placeholder="Ex : BPJEPS AF"
                    className="border-border bg-surface focus:border-accent-gold focus:ring-accent-gold/30 h-10 flex-1 rounded-[10px] border px-4 text-sm focus:ring-2 focus:outline-none"
                  />
                  {formations.length > 1 && (
                    <button
                      onClick={() => setFormations(formations.filter((_, j) => j !== i))}
                      className="text-text-tertiary hover:text-danger"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => setFormations([...formations, ''])}
                className="text-accent-gold flex items-center gap-1 text-xs hover:underline"
              >
                <Plus size={14} />
                Ajouter un diplôme
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 — Première carte de service */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-center text-xl font-bold">Ta première offre</h2>
            <p className="text-text-secondary text-center text-sm">
              Tu pourras en ajouter d&apos;autres plus tard
            </p>
            <div>
              <label className="text-text-secondary mb-2 block text-sm">Sport</label>
              <div className="flex flex-wrap gap-2">
                {SPORTS_DISPONIBLES.map(({ value, label }) => (
                  <PillButton
                    key={value}
                    selected={carteSport === value}
                    onClick={() => setCarteSport(value)}
                  >
                    {label}
                  </PillButton>
                ))}
              </div>
            </div>
            <div>
              <label className="text-text-secondary mb-1.5 block text-sm">
                Nom de l&apos;offre
              </label>
              <input
                type="text"
                value={carteNom}
                onChange={(e) => setCarteNom(e.target.value)}
                placeholder="Ex : Remise en forme"
                className="border-border bg-surface focus:border-accent-gold focus:ring-accent-gold/30 h-12 w-full rounded-[10px] border px-4 text-sm focus:ring-2 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-text-secondary mb-1.5 block text-sm">
                  Tarif/heure : {carteTarif}€
                </label>
                <input
                  type="range"
                  min={20}
                  max={120}
                  value={carteTarif}
                  onChange={(e) => setCarteTarif(Number(e.target.value))}
                  className="vibe-slider w-full"
                />
              </div>
              <div>
                <label className="text-text-secondary mb-1.5 block text-sm">
                  Durée : {carteDuree} min
                </label>
                <input
                  type="range"
                  min={30}
                  max={120}
                  step={15}
                  value={carteDuree}
                  onChange={(e) => setCarteDuree(Number(e.target.value))}
                  className="vibe-slider w-full"
                />
              </div>
            </div>
            <div>
              <label className="text-text-secondary mb-1.5 block text-sm">
                Description
              </label>
              <textarea
                value={carteDescription}
                onChange={(e) => setCarteDescription(e.target.value)}
                placeholder="Décris ton offre en 1-2 lignes..."
                rows={2}
                className="border-border bg-surface focus:border-accent-gold focus:ring-accent-gold/30 w-full rounded-[10px] border px-4 py-3 text-sm focus:ring-2 focus:outline-none"
              />
            </div>

            {/* Preview carte */}
            {carteNom && (
              <div className="border-accent-gold/30 bg-accent-gold/5 rounded-xl border p-4">
                <p className="text-accent-gold text-xs font-medium">Aperçu</p>
                <div className="mt-2 flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{carteNom}</p>
                    <p className="text-text-tertiary mt-0.5 text-xs capitalize">
                      {carteSport}
                    </p>
                  </div>
                  <span className="text-accent-gold text-lg font-bold">
                    {carteTarif}€/h
                  </span>
                </div>
                {carteDescription && (
                  <p className="text-text-secondary mt-1 text-sm">{carteDescription}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ÉTAPE 4 — Zones et formats */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-center text-xl font-bold">Zone et formats</h2>
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
                Rayon d&apos;intervention : {rayonKm} km
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
              <label className="text-text-secondary mb-2 block text-sm">
                Formats de séance
              </label>
              <div className="flex gap-3">
                {(
                  [
                    { value: 'presentiel', label: 'Présentiel' },
                    { value: 'distanciel', label: 'Distanciel' },
                    { value: 'hybride', label: 'Hybride' },
                  ] as const
                ).map(({ value, label }) => (
                  <PillButton
                    key={value}
                    selected={formats.includes(value)}
                    onClick={() => toggleFormat(value)}
                  >
                    {label}
                  </PillButton>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 5 — Formule */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-center text-xl font-bold">Choisis ta formule</h2>
            <div className="space-y-4">
              {FORMULES.map(({ value, label, prix, features }) => (
                <button
                  key={value}
                  onClick={() => setFormule(value)}
                  className={cn(
                    'w-full rounded-xl border p-5 text-left transition-all',
                    formule === value
                      ? 'border-accent-gold bg-accent-gold/5 scale-[1.02]'
                      : 'border-border bg-surface hover:bg-surface-elevated',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">{label}</h3>
                    <span className="text-accent-gold text-xl font-bold">
                      {prix}€
                      <span className="text-text-tertiary text-xs font-normal">
                        /mois
                      </span>
                    </span>
                  </div>
                  <ul className="mt-3 space-y-1">
                    {features.map((f) => (
                      <li
                        key={f}
                        className="text-text-secondary flex items-center gap-2 text-sm"
                      >
                        <Check size={14} className="text-success" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ÉTAPE 6 — Vibe */}
        {step === 5 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-xl font-bold">Ta vibe de coach</h2>
              <p className="text-text-secondary mt-1 text-sm">
                Comment te décrirais-tu ?
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
            Lancer mon activité
          </Button>
        )}
      </div>
    </div>
  );
}
