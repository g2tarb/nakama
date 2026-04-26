'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center md:py-32">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="max-w-3xl text-4xl leading-tight font-bold md:text-5xl lg:text-6xl"
      >
        Trouve le <span className="text-accent-gold">Nakama</span> qui te fera progresser
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.08 }}
        className="text-text-secondary mt-6 max-w-xl text-lg"
      >
        La plateforme qui connecte sportifs et coachs grâce au matching comportemental.
        Trouve le professionnel qui te correspond vraiment.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.16 }}
        className="mt-10 flex flex-col gap-4 sm:flex-row"
      >
        <Link href="/inscription/sportif">
          <Button size="lg" className="gap-2">
            Je suis sportif
            <ArrowRight size={18} />
          </Button>
        </Link>
        <Link href="/inscription/pro">
          <Button variant="outline" size="lg" className="gap-2">
            Je suis pro
            <ArrowRight size={18} />
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
