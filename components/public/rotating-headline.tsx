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

export function RotatingHeadline() {
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
      Trouve le <span className="text-accent-gold">Nakama</span> qui{' '}
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
