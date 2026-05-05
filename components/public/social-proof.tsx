import { CalendarX, CheckCircle2, Lock, Star } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Item = {
  icon: LucideIcon;
  label: string;
  warn?: boolean;
};

const ITEMS: Item[] = [
  { icon: CheckCircle2, label: '+ 50 disciplines' },
  { icon: Star, label: '4.9/5 satisfaction', warn: true },
  { icon: Lock, label: 'Paiement sécurisé' },
  { icon: CalendarX, label: 'Annulation 24 h' },
];

export function SocialProof() {
  return (
    <section className="border-border border-t border-b">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 md:grid-cols-4">
        {ITEMS.map(({ icon: Icon, label, warn }, i) => (
          <div
            key={label}
            className={
              'text-text-secondary flex items-center justify-center gap-2.5 px-4 py-6 text-sm' +
              (i > 0 ? ' md:border-border md:border-l' : '') +
              (i === 1 || i === 3 ? ' border-border border-l md:border-l' : '')
            }
          >
            <Icon size={18} className={warn ? 'text-warning' : 'text-accent-gold'} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
