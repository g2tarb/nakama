'use client';

import { cn } from '@/lib/utils';

interface PillButtonProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export function PillButton({ selected, onClick, children, className }: PillButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'rounded-full border px-4 py-2 text-sm font-medium transition-all',
        selected
          ? 'border-accent-gold bg-accent-gold text-background'
          : 'border-border text-text-primary hover:border-text-tertiary',
        className,
      )}
    >
      {children}
    </button>
  );
}
