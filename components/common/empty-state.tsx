import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="bg-surface mb-4 flex size-14 items-center justify-center rounded-full">
          <Icon size={24} className="text-text-tertiary" />
        </div>
      )}
      <p className="text-text-secondary text-lg font-semibold">{title}</p>
      {description && <p className="text-text-tertiary mt-1 text-sm">{description}</p>}
    </div>
  );
}
