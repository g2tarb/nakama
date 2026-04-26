'use client';

import { Search, Shield, TrendingUp, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

import { FeatureCard } from './feature-card';
import { SectionHeading } from './section-heading';

const FEATURES_SPORTIF = [
  {
    icon: Search,
    title: 'Matching personnalisé',
    description:
      'Notre algorithme analyse ta personnalité pour trouver le coach qui te correspond vraiment.',
  },
  {
    icon: Zap,
    title: 'Réservation simple',
    description:
      "Réserve ta séance en 3 clics. Choisis le créneau, confirme, c'est fait.",
  },
  {
    icon: TrendingUp,
    title: 'Progression suivie',
    description:
      'Suis tes progrès avec ton coach. Objectifs, mesures, résultats — tout au même endroit.',
  },
];

const FEATURES_PRO = [
  {
    icon: Users,
    title: 'Visibilité',
    description: 'Sois visible auprès de milliers de sportifs motivés dans ta zone.',
  },
  {
    icon: Shield,
    title: 'Gestion simplifiée',
    description:
      'Agenda, clients, fiches athlètes — tout ton CRM métier en un seul outil.',
  },
  {
    icon: TrendingUp,
    title: 'Revenus sécurisés',
    description:
      'Paiement sécurisé, suivi de CA, zéro impayé. Concentre-toi sur ton métier.',
  },
];

const STEPS = [
  {
    step: '1',
    title: 'Inscription en 5 min',
    description: 'Crée ton profil et définis ta personnalité sportive.',
  },
  {
    step: '2',
    title: 'Matching intelligent',
    description: 'Notre algorithme te propose les coachs les plus compatibles.',
  },
  {
    step: '3',
    title: 'Réserve et progresse',
    description: 'Choisis ton créneau et commence à atteindre tes objectifs.',
  },
];

export function FeaturesSportif() {
  return (
    <section className="border-border border-t px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading>Pour les sportifs</SectionHeading>
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES_SPORTIF.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturesPro() {
  return (
    <section className="border-border border-t px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading>Pour les professionnels</SectionHeading>
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES_PRO.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="comment-ca-marche" className="border-border border-t px-4 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <SectionHeading>Comment ça marche</SectionHeading>
        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map(({ step, title, description }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="border-accent-gold text-accent-gold flex size-14 items-center justify-center rounded-full border-2 text-xl font-bold">
                {step}
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-text-secondary text-sm">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
