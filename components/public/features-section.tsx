'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Calendar, SlidersHorizontal, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const STEPS: Array<{
  num: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  image: string;
}> = [
  {
    num: '01',
    icon: SlidersHorizontal,
    title: 'Réponds au matching',
    desc: 'Trois axes psychologiques. Cinq minutes. Pas de questionnaire interminable.',
    image: '/images/testimonials/nakama1.webp',
  },
  {
    num: '02',
    icon: Users,
    title: 'Découvre tes Nakamas',
    desc: 'On te propose les coachs les plus compatibles. Filtre par sport, budget, distance.',
    image: '/images/testimonials/nakama2.webp',
  },
  {
    num: '03',
    icon: Calendar,
    title: 'Réserve ta première séance',
    desc: 'Paiement sécurisé, annulation jusqu’à 24 h avant. Aucun engagement.',
    image: '/images/testimonials/nakama3.webp',
  },
];

export function HowItWorks() {
  return (
    <section id="comment-ca-marche" className="px-4 py-24">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-16 text-center">
          <span className="nk-eyebrow">Comment ça marche</span>
          <h2 className="nk-h1 text-accent-gold mt-3">Trois étapes, pas une de plus</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <StepCard key={step.num} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({
  step,
  index,
}: {
  step: (typeof STEPS)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Zone de détection serrée : la carte doit être au centre du viewport
  // (40 % top + 40 % bottom = bande verticale centrale de 20 %).
  // Garantit qu'une seule carte est "active" en scroll mobile.
  const inView = useInView(ref, {
    margin: '-40% 0px -40% 0px',
    amount: 'some',
  });
  const [hovered, setHovered] = useState(false);
  const isActive = hovered || inView;

  const Icon = step.icon;

  return (
    <motion.article
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.08,
      }}
      className="bg-card border-border/40 relative isolate overflow-hidden rounded-xl border p-8"
    >
      {/* Image en fond — apparaît au hover (desktop) ou au scroll into view (mobile) */}
      <motion.div
        aria-hidden="true"
        animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1.05 : 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 -z-20"
      >
        <Image
          src={step.image}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </motion.div>

      {/* Voile soft (lisibilité) — synchro avec l'image */}
      <motion.div
        aria-hidden="true"
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,10,10,0) 40%, rgba(10,10,10,0.55) 100%)',
        }}
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-2 right-5 text-[92px] leading-none font-extrabold transition-colors duration-700"
        style={{
          color: 'rgba(229, 181, 71, 0.07)',
          letterSpacing: '-0.04em',
        }}
      >
        {step.num}
      </span>
      <div
        className="relative mb-5 inline-flex h-11 w-11 items-center justify-center rounded-[10px]"
        style={{ background: 'var(--color-accent-gold-wash)' }}
      >
        <Icon size={22} className="text-accent-gold" />
      </div>
      <h3 className="nk-h3 text-text-primary mb-2">{step.title}</h3>
      <p className="text-text-secondary text-[14.5px] leading-relaxed">{step.desc}</p>
    </motion.article>
  );
}
