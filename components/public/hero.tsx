'use client';

import { motion } from 'framer-motion';

import { BackgroundVideo } from './background-video';
import { HeroSearchBar } from './hero-search-bar';
import { RotatingHeadline } from './rotating-headline';

export function Hero() {
  return (
    <section className="nk-hero-bg relative isolate overflow-hidden px-4 py-20 md:py-28">
      <BackgroundVideo src="/videos/nakama-fond.mp4" />

      <div className="relative mx-auto max-w-[1080px] text-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="nk-eyebrow inline-block"
        >
          Matching comportemental · plateforme française
        </motion.span>

        <RotatingHeadline />

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
