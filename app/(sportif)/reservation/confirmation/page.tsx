'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';

export default function ConfirmationPage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="bg-success/20 flex size-24 items-center justify-center rounded-full"
      >
        <Check size={48} className="text-success" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mt-6 text-2xl font-bold"
      >
        Réservation confirmée !
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-text-secondary mt-2 text-sm"
      >
        Tu recevras un rappel avant ta séance.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 flex gap-3"
      >
        <Link href="/accueil">
          <Button variant="outline">Retour à l&apos;accueil</Button>
        </Link>
        <Link href="/rdv">
          <Button>Voir mes RDV</Button>
        </Link>
      </motion.div>
    </div>
  );
}
