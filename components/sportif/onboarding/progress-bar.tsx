'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

export function ProgressBar({ currentStep, totalSteps, onStepClick }: ProgressBarProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => (
        <button
          key={i}
          onClick={() => {
            if (i < currentStep) onStepClick(i);
          }}
          disabled={i > currentStep}
          className={cn(
            'size-2.5 rounded-full transition-all duration-200',
            i === currentStep && 'bg-accent-gold size-3',
            i < currentStep && 'bg-accent-gold/60 hover:bg-accent-gold cursor-pointer',
            i > currentStep && 'bg-border cursor-default',
          )}
          aria-label={`Étape ${i + 1}`}
        />
      ))}
    </div>
  );
}
