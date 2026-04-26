'use client';

import { motion } from 'framer-motion';

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="text-accent-gold mb-12 text-center text-2xl font-bold md:text-3xl"
    >
      {children}
    </motion.h2>
  );
}
