import { cn } from '@/lib/utils';

interface CompatibilityBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CompatibilityBadge({
  score,
  size = 'sm',
  className,
}: CompatibilityBadgeProps) {
  return (
    <span
      className={cn(
        'text-accent-gold inline-flex items-center font-bold',
        size === 'sm' &&
          'bg-accent-gold/20 rounded-md px-1.5 py-0.5 text-xs backdrop-blur-sm',
        size === 'md' &&
          'bg-accent-gold/20 rounded-lg px-2 py-1 text-sm backdrop-blur-sm',
        size === 'lg' && 'bg-accent-gold/15 rounded-xl px-3 py-1.5 text-base',
        className,
      )}
    >
      {score}%
    </span>
  );
}
