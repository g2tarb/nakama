'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface StepWrapperProps {
  stepKey: number;
  direction: number;
  children: React.ReactNode;
}

export function StepWrapper({ stepKey, direction, children }: StepWrapperProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={stepKey}
        custom={direction}
        initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
