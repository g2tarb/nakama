'use client';

import { ArrowRightLeft, Check, Globe, Dumbbell, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { useMode } from '@/hooks/use-mode';
import type { Mode } from '@/stores/mode-store';

const MODES: { value: Mode; label: string; icon: typeof Globe }[] = [
  { value: 'public', label: 'Vue publique', icon: Globe },
  { value: 'sportif', label: 'Vue sportif', icon: Dumbbell },
  { value: 'pro', label: 'Vue pro', icon: Briefcase },
];

export function ModeSwitcher() {
  const { mode, switchMode } = useMode();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom)+0.5rem)] left-6 z-[100] lg:right-6 lg:bottom-6 lg:left-auto">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="border-border bg-surface-elevated shadow-elevated absolute bottom-14 left-0 mb-2 w-48 overflow-hidden rounded-xl border lg:right-0 lg:left-auto"
          >
            {MODES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => {
                  switchMode(value);
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors',
                  mode === value
                    ? 'bg-accent-gold/10 text-accent-gold'
                    : 'text-text-secondary hover:bg-surface hover:text-text-primary',
                )}
              >
                <Icon size={18} />
                <span className="flex-1 text-left">{label}</span>
                {mode === value && <Check size={16} className="text-accent-gold" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        className="border-border bg-surface-elevated shadow-elevated hover:bg-surface flex size-12 items-center justify-center rounded-full border transition-all hover:scale-105"
        aria-label="Changer d'espace"
      >
        <ArrowRightLeft size={20} className="text-text-secondary" />
      </button>
    </div>
  );
}
