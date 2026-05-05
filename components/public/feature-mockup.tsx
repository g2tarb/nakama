'use client';

import { Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const HIGHLIGHTS = [
  'Score de compatibilité de 0 à 100 %',
  'Filtres budget et distance combinés',
  'Pas d’engagement, annulation 24 h',
];

const MATCHED_PROS = [
  { name: 'Julie BERNARD', specialty: 'Coach sportif', price: 45, score: 94 },
  {
    name: 'Karim BENSALAH',
    specialty: 'Préparateur physique',
    price: 60,
    score: 88,
  },
  {
    name: 'Léa MORENO',
    specialty: 'Préparateur mental',
    price: 50,
    score: 82,
  },
];

export function FeatureMockup() {
  return (
    <section
      className="border-border border-t border-b px-4 py-24"
      style={{ background: 'var(--color-bg-overlay)' }}
    >
      <div className="mx-auto grid max-w-[1180px] items-center gap-16 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="nk-eyebrow">Matching comportemental</span>
          <h2 className="nk-h1 text-accent-gold mt-3 mb-4">
            Le bon coach, pas juste un coach
          </h2>
          <p className="text-text-secondary mb-7 text-base leading-relaxed">
            Trois axes psychologiques évaluent comment tu fonctionnes : suivi rapproché ou
            autonomie, cadre strict ou souplesse, intensité ou progressivité. On compare
            avec le profil des pros et on te propose les meilleurs fits.
          </p>
          <ul className="m-0 flex flex-col gap-2.5 p-0">
            {HIGHLIGHTS.map((label) => (
              <li
                key={label}
                className="text-text-primary flex items-center gap-2.5 text-[15px]"
              >
                <Check size={16} className="text-accent-gold" />
                {label}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative flex justify-center"
        >
          <PhoneMockup />
          <CompatibilityCard />
        </motion.div>
      </div>
    </section>
  );
}

function PhoneMockup() {
  return (
    <div
      className="relative w-[280px] -rotate-3 rounded-[38px] p-2"
      style={{
        background: 'var(--color-bg-deep)',
        boxShadow: '0 30px 60px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
        height: 560,
      }}
    >
      <div className="bg-background relative h-full w-full overflow-hidden rounded-[30px] p-5">
        <div
          aria-hidden="true"
          className="absolute top-2 left-1/2 h-[22px] w-[90px] -translate-x-1/2 rounded-full bg-black"
        />
        <div className="mt-7">
          <div className="nk-label" style={{ color: 'var(--color-accent-muted)' }}>
            Matchés pour toi
          </div>
          <h3 className="text-text-primary mt-1 mb-4 text-lg font-semibold">
            3 Nakamas trouvés
          </h3>
        </div>
        {MATCHED_PROS.map((pro) => (
          <div
            key={pro.name}
            className="bg-card mb-2 flex items-center gap-2.5 rounded-xl p-3"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-bold"
              style={{
                background: 'linear-gradient(135deg,#34465e,#1c2737)',
                color: 'rgba(201,178,122,0.5)',
              }}
            >
              {pro.name
                .split(' ')
                .map((w) => w[0])
                .join('')}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-text-primary truncate text-[13px] font-semibold">
                {pro.name}
              </div>
              <div className="text-text-secondary text-[11px]">
                {pro.specialty} · {pro.price} €/h
              </div>
            </div>
            <div
              className="text-accent-gold rounded-md px-1.5 py-[3px] text-[11px] font-bold"
              style={{ background: 'rgba(201,178,122,0.20)' }}
            >
              {pro.score}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompatibilityCard() {
  return (
    <div
      className="bg-card border-border absolute right-0 bottom-7 w-[220px] rotate-[2deg] rounded-xl border p-4 md:-right-2"
      style={{ boxShadow: 'var(--shadow-elevated)' }}
    >
      <div className="mb-2.5 flex items-center gap-2">
        <Sparkles size={16} className="text-accent-gold" />
        <span className="nk-label" style={{ color: 'var(--color-accent-muted)' }}>
          Compatibilité
        </span>
      </div>
      <div className="text-accent-gold text-[32px] leading-none font-bold">94 %</div>
      <div className="text-text-secondary mt-1.5 text-xs">
        Suivi rapproché · cadre adaptatif · progressivité
      </div>
    </div>
  );
}
