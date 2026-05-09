'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ENDINGS = [
  'te fera progresser',
  'te comprend vraiment',
  'te pousse à fond',
  't’écoute sans juger',
  'te respecte',
  'te suit dans la durée',
  'te motive chaque séance',
  'te remet en mouvement',
  'te ressemble',
];

const ROTATION_INTERVAL_MS = 2800;
const NAKAMA_LETTERS = ['N', 'a', 'k', 'a', 'm', 'a'];

interface Props {
  /** Quand true, le mot Nakama brille lettre par lettre (déclenché pendant la pause vidéo) */
  shine?: boolean;
  /** Clé qui change à chaque cycle pour relancer l'animation shine */
  shineKey?: number;
}

export function RotatingHeadline({ shine = false, shineKey = 0 }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % ENDINGS.length);
    }, ROTATION_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.h1
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
      className="nk-display text-text-primary mt-6"
    >
      Trouve le{' '}
      <span
        key={`nakama-${shineKey}`}
        className="relative inline-flex align-baseline"
        aria-label="Nakama"
      >
        {NAKAMA_LETTERS.map((letter, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            initial={shine ? { scale: 0.6, opacity: 0.3 } : false}
            animate={
              shine
                ? {
                    scale: [0.6, 1.25, 1],
                    opacity: [0.3, 1, 1],
                  }
                : {}
            }
            transition={{
              duration: 0.7,
              delay: shine ? i * 0.13 : 0,
              ease: [0.22, 1, 0.36, 1],
              times: [0, 0.5, 1],
            }}
            className={
              shine ? 'nk-shine-letter inline-block' : 'text-accent-gold inline-block'
            }
            style={{
              fontSize: 'inherit',
              fontWeight: 'inherit',
              lineHeight: 'inherit',
              letterSpacing: 'inherit',
            }}
          >
            {letter}
          </motion.span>
        ))}
      </span>{' '}
      qui{' '}
      <span className="relative inline-block align-baseline">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={ENDINGS[index]}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block"
          >
            {ENDINGS[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </motion.h1>
  );
}
