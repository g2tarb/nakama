import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'full' | 'symbol';
  className?: string;
}

export function Logo({ variant = 'full', className }: LogoProps) {
  if (variant === 'symbol') {
    return (
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('text-accent-gold', className)}
        aria-hidden
      >
        <path
          d="M6 6 L16 22 L26 6 L26 26 L20 26 L20 18 L16 24 L12 18 L12 26 L6 26 Z"
          fill="currentColor"
        />
      </svg>
    );
  }
  return (
    <span
      className={cn(
        'text-accent-gold font-heading text-xl font-bold tracking-tight',
        className,
      )}
    >
      NAKAMA
    </span>
  );
}
