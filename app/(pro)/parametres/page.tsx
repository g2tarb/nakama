'use client';

import {
  Bell,
  ChevronRight,
  CreditCard,
  Eye,
  HelpCircle,
  LogOut,
  Shield,
  User,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';

const MENU_ITEMS = [
  {
    icon: Eye,
    label: 'Mon profil public',
    description: 'Aperçu de ce que voient les sportifs',
  },
  {
    icon: CreditCard,
    label: 'Ma formule',
    description: 'Gérer mon abonnement',
    badge: 'Élite',
  },
  {
    icon: User,
    label: 'Moyens de paiement',
    description: 'Carte bancaire et relevés',
  },
  {
    icon: Bell,
    label: 'Notifications',
    description: 'Emails, push et rappels',
  },
  {
    icon: Shield,
    label: 'Confidentialité et données',
    description: 'Gestion de vos données',
  },
  {
    icon: HelpCircle,
    label: 'Aide et support',
    description: 'FAQ et contact',
  },
];

export default function ParametresPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 lg:px-8">
      <h1 className="text-accent-gold mb-6 text-xl font-bold">Paramètres</h1>

      <div className="space-y-2">
        {MENU_ITEMS.map(({ icon: Icon, label, description, badge }) => (
          <button
            key={label}
            className="border-border bg-surface hover:bg-surface-elevated flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors"
          >
            <Icon size={20} className="text-text-secondary shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{label}</p>
                {badge && (
                  <Badge className="bg-accent-gold/10 text-accent-gold text-xs">
                    {badge}
                  </Badge>
                )}
              </div>
              <p className="text-text-tertiary text-xs">{description}</p>
            </div>
            <ChevronRight size={16} className="text-text-tertiary" />
          </button>
        ))}

        {/* Déconnexion */}
        <button className="border-danger/20 bg-danger/5 hover:bg-danger/10 flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors">
          <LogOut size={20} className="text-danger" />
          <span className="text-danger font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
