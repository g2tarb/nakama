'use client';

import { useEffect, useRef, useState } from 'react';
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

const SCORE_MIN = 65;
const SCORE_MAX = 99;

function useAnimatedScores(initial: number[]) {
  const [scores, setScores] = useState(initial);
  const scoresRef = useRef<number[]>(initial);
  scoresRef.current = scores;

  useEffect(() => {
    const cancellers: Array<() => void> = [];

    initial.forEach((_, i) => {
      let cancelled = false;
      let rafId: number | undefined;
      let timeoutId: ReturnType<typeof setTimeout> | undefined;

      const animateTo = (target: number) => {
        const start = scoresRef.current[i] ?? initial[i] ?? SCORE_MIN;
        const startTime = performance.now();
        const duration = 1100 + Math.random() * 400;

        const step = (now: number) => {
          if (cancelled) return;
          const t = Math.min(1, (now - startTime) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          const value = Math.round(start + (target - start) * eased);
          setScores((prev) => {
            if (prev[i] === value) return prev;
            const next = [...prev];
            next[i] = value;
            return next;
          });
          if (t < 1) {
            rafId = requestAnimationFrame(step);
          } else {
            scheduleNext();
          }
        };
        rafId = requestAnimationFrame(step);
      };

      const scheduleNext = () => {
        const delay = 1800 + Math.random() * 2000;
        timeoutId = setTimeout(() => {
          if (cancelled) return;
          const target =
            SCORE_MIN + Math.floor(Math.random() * (SCORE_MAX - SCORE_MIN + 1));
          animateTo(target);
        }, delay);
      };

      scheduleNext();

      cancellers.push(() => {
        cancelled = true;
        if (rafId) cancelAnimationFrame(rafId);
        if (timeoutId) clearTimeout(timeoutId);
      });
    });

    return () => cancellers.forEach((c) => c());
  }, [initial]);

  return scores;
}

export function FeatureMockup() {
  const initialScores = MATCHED_PROS.map((p) => p.score);
  const scores = useAnimatedScores(initialScores);
  const topScore = scores[0] ?? initialScores[0] ?? 0;

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
          <PhoneMockup scores={scores} />
          <CompatibilityCard score={topScore} />
        </motion.div>
      </div>
    </section>
  );
}

function PhoneMockup({ scores }: { scores: number[] }) {
  return (
    <motion.div
      animate={{ y: [0, -6, 0, -3, 0], rotate: [-3, -2.6, -3, -3.2, -3] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      className="relative w-[280px] rounded-[38px] p-2"
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
        {MATCHED_PROS.map((pro, i) => (
          <motion.div
            key={pro.name}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.25 + i * 0.18,
            }}
          >
            <motion.div
              animate={{ y: [0, -1.5, 0, 1, 0] }}
              transition={{
                duration: 3.4 + i * 0.6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.4,
              }}
              className="bg-card mb-2 flex items-center gap-2.5 rounded-xl p-3"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
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
                className="text-accent-gold rounded-md px-1.5 py-[3px] text-[11px] font-bold tabular-nums"
                style={{ background: 'rgba(201,178,122,0.20)' }}
              >
                {scores[i] ?? pro.score}%
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function CompatibilityCard({ score }: { score: number }) {
  return (
    <motion.div
      animate={{ y: [0, 4, 0, -2, 0], rotate: [2, 1.7, 2, 2.3, 2] }}
      transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
      className="bg-card border-border absolute right-0 bottom-7 w-[220px] rounded-xl border p-4 md:-right-2"
      style={{ boxShadow: 'var(--shadow-elevated)' }}
    >
      <div className="mb-2.5 flex items-center gap-2">
        <Sparkles size={16} className="text-accent-gold" />
        <span className="nk-label" style={{ color: 'var(--color-accent-muted)' }}>
          Compatibilité
        </span>
      </div>
      <div className="text-accent-gold text-[32px] leading-none font-bold tabular-nums">
        {score} %
      </div>
      <div className="text-text-secondary mt-1.5 text-xs">
        Suivi rapproché · cadre adaptatif · progressivité
      </div>
    </motion.div>
  );
}
