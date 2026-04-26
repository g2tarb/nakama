import Image from 'next/image';

import { cn } from '@/lib/utils';

interface AvatarStackProps {
  avatars: { id: string; src: string; alt: string }[];
  size?: number;
  max?: number;
  className?: string;
}

export function AvatarStack({
  avatars,
  size = 40,
  max = 3,
  className,
}: AvatarStackProps) {
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - visible.length;
  return (
    <div className={cn('flex -space-x-2', className)}>
      {visible.map((a) => (
        <div
          key={a.id}
          className="border-surface relative overflow-hidden rounded-full border-2"
          style={{ width: size, height: size }}
        >
          <Image
            src={a.src}
            alt={a.alt}
            fill
            sizes={`${size}px`}
            className="object-cover"
          />
        </div>
      ))}
      {overflow > 0 && (
        <div
          className="bg-surface text-text-secondary border-surface flex items-center justify-center rounded-full border-2 text-xs font-medium"
          style={{ width: size, height: size }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
