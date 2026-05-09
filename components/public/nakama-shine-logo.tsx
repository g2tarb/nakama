'use client';

import { motion } from 'framer-motion';

const LETTERS = ['N', 'A', 'K', 'A', 'M', 'A'];

export function NakamaShineLogo() {
  return (
    <div className="flex items-center gap-1.5 select-none sm:gap-3 md:gap-4">
      {LETTERS.map((letter, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.3, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.55,
            delay: i * 0.18,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="nk-shine-letter"
        >
          {letter}
        </motion.span>
      ))}
    </div>
  );
}
