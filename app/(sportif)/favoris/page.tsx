'use client';

import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

import { ProCard } from '@/components/sportif/pro-card';
import { containerVariants, itemVariants } from '@/lib/animations';
import { pros } from '@/lib/mock-data';

// Démo : on prend les 5 premiers pros comme "favoris" (mock)
const FAVORIS_IDS = ['pro-001', 'pro-005', 'pro-008', 'pro-012', 'pro-015'];

export default function FavorisPage() {
  const router = useRouter();
  const favoris = pros.filter((p) => FAVORIS_IDS.includes(p.id));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-[480px] px-4 py-6 md:max-w-[640px]"
    >
      <motion.header variants={itemVariants} className="mb-5">
        <span className="nk-eyebrow">Mes pros</span>
        <h1 className="nk-h1 text-text-primary mt-1.5 tracking-[-0.02em]">Mes favoris</h1>
        <p className="text-text-secondary mt-1 text-sm">
          {favoris.length} pro{favoris.length > 1 ? 's' : ''} sauvegardé
          {favoris.length > 1 ? 's' : ''}
        </p>
      </motion.header>

      {favoris.length === 0 ? (
        <div className="bg-card border-border/40 flex flex-col items-center gap-3 rounded-xl border py-12 text-center">
          <span
            className="bg-accent-gold-wash flex h-14 w-14 items-center justify-center rounded-full"
            aria-hidden="true"
          >
            <Heart size={22} className="text-accent-gold" />
          </span>
          <p className="text-text-primary text-sm font-semibold">
            Aucun favori pour l&apos;instant
          </p>
          <p className="text-text-tertiary max-w-[260px] text-xs">
            Appuie sur le cœur d&apos;une fiche pro pour la sauvegarder ici.
          </p>
          <button
            type="button"
            onClick={() => router.push('/recherche')}
            className="border-accent-muted text-accent-gold hover:bg-accent-gold-wash mt-2 rounded-lg border px-4 py-2 text-[12.5px] font-medium transition-colors"
          >
            Découvrir des pros
          </button>
        </div>
      ) : (
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
          {favoris.map((pro) => (
            <ProCard
              key={pro.id}
              pro={pro}
              className="w-full"
              onClick={() => router.push(`/pros/${pro.id}`)}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
