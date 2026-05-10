'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { HeroSearchBar } from './hero-search-bar';
import { RotatingHeadline } from './rotating-headline';

// Three.js bundle ~150 KB → on lazy-load et on garde un fond gradient en fallback
const ThreeBackground = dynamic(
  () => import('./three-background').then((mod) => mod.ThreeBackground),
  {
    ssr: false,
    loading: () => null,
  },
);

const SHINE_DURATION_MS = 3500;
const SHINE_INTERVAL_MS = 9000;

export function Hero() {
  const [shineKey, setShineKey] = useState(0);
  const [isShining, setIsShining] = useState(false);

  // Déclenche un shine du H1 toutes les 9 s
  useEffect(() => {
    let resetTimer: ReturnType<typeof setTimeout> | undefined;
    const id = setInterval(() => {
      setShineKey((k) => k + 1);
      setIsShining(true);
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => setIsShining(false), SHINE_DURATION_MS);
    }, SHINE_INTERVAL_MS);
    return () => {
      clearInterval(id);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, []);

  return (
    <section className="nk-hero-bg relative isolate px-4 py-20 md:py-28">
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <ThreeBackground />
      </div>
      {/* Voile bleu nuit haut + bas pour fondre les bords avec le reste de la page */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(30,42,58,0.55) 0%, rgba(30,42,58,0.10) 35%, rgba(30,42,58,0.10) 65%, rgba(30,42,58,0.85) 100%)',
        }}
      />

      <div className="relative mx-auto max-w-[1080px] text-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="nk-eyebrow inline-block"
        >
          Matching comportemental · plateforme française
        </motion.span>

        <RotatingHeadline shine={isShining} shineKey={shineKey} />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}
          className="text-text-secondary mx-auto mt-6 max-w-[620px] text-lg leading-relaxed"
        >
          La plateforme qui connecte sportifs et coachs grâce au matching comportemental.
          Trouve le pro qui te correspond vraiment.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.24 }}
          className="mt-10"
        >
          <HeroSearchBar />
        </motion.div>
      </div>
    </section>
  );
}
