'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface VibeSliderProps {
  labelLeft: string;
  labelRight: string;
  value: number;
  onChange: (value: number) => void;
}

export function VibeSlider({ labelLeft, labelRight, value, onChange }: VibeSliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-secondary">{labelLeft}</span>
        <span className="text-text-secondary">{labelRight}</span>
      </div>

      {/* Custom slider */}
      <div className="relative">
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="vibe-slider w-full"
        />
        {/* Track dots */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-[2px]">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className={`size-1.5 rounded-full transition-colors ${
                i + 1 <= value ? 'bg-accent-gold/40' : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Valeur affichée */}
      <div className="flex justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={value}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="text-accent-gold text-2xl font-bold"
          >
            {value}
          </motion.span>
        </AnimatePresence>
        <span className="text-text-tertiary ml-1 self-end text-sm">/10</span>
      </div>
    </div>
  );
}
