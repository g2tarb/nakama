'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface VibeSliderProps {
  labelLeft: string;
  labelRight: string;
  value: number;
  onChange: (value: number) => void;
}

export function VibeSlider({ labelLeft, labelRight, value, onChange }: VibeSliderProps) {
  const fillPercent = ((value - 1) / 9) * 100;

  return (
    <div className="bg-card border-border/40 flex flex-col gap-3 rounded-xl border p-5">
      <div className="flex items-center justify-between text-[12px] font-medium">
        <span className="text-text-secondary">{labelLeft}</span>
        <span className="text-text-secondary">{labelRight}</span>
      </div>

      <div className="relative flex h-6 items-center">
        <div className="absolute inset-x-0 h-1 rounded-full bg-[color:var(--color-border)]" />
        <div
          className="bg-accent-muted absolute h-1 rounded-full transition-[width] duration-150"
          style={{ width: `${fillPercent}%` }}
        />
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={`${labelLeft} – ${labelRight}`}
          className="vibe-slider relative z-10 w-full bg-transparent"
        />
      </div>

      <div className="flex items-baseline justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={value}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="text-accent-gold text-[26px] leading-none font-bold tabular-nums"
          >
            {value}
          </motion.span>
        </AnimatePresence>
        <span className="text-text-tertiary ml-1 text-[12px]">/10</span>
      </div>
    </div>
  );
}
