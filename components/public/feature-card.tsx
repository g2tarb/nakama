'use client';

import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export function FeatureCard({ icon: Icon, title, description, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.08 }}
      className="group border-border bg-surface hover:bg-surface-elevated rounded-xl border p-6 transition-all hover:scale-[1.01]"
    >
      <div className="bg-accent-gold/10 mb-4 flex size-12 items-center justify-center rounded-lg">
        <Icon size={24} className="text-accent-gold" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-text-secondary text-sm">{description}</p>
    </motion.div>
  );
}
