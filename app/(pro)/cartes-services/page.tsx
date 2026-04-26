'use client';

import { Plus, Pencil, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/stores/user-store';
import { pros } from '@/lib/mock-data';
import { formatPricePerHour } from '@/lib/formatters';

export default function CartesServicesPage() {
  const pro = useUserStore((s) => s.pro) ?? pros[4]!;

  const maxCartes = pro.formule === 'standard' ? 1 : pro.formule === 'premium' ? 3 : 99;
  const activeCount = pro.cartesServices.filter((c) => c.actif).length;

  return (
    <div className="px-4 py-6 lg:px-8">
      <h1 className="text-accent-gold text-xl font-bold">Cartes de service</h1>
      <p className="text-text-secondary mt-1 text-sm">
        {activeCount} carte{activeCount > 1 ? 's' : ''} active
        {activeCount > 1 ? 's' : ''} sur {maxCartes === 99 ? '∞' : maxCartes} autorisée
        {maxCartes > 1 ? 's' : ''} — formule{' '}
        <span className="capitalize">{pro.formule}</span>
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pro.cartesServices.map((carte) => (
          <div key={carte.id} className="border-border bg-surface rounded-xl border p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{carte.nom}</h3>
                <Badge variant="outline" className="mt-1 text-xs capitalize">
                  {carte.sport}
                </Badge>
              </div>
              <span className="text-accent-gold text-lg font-bold">
                {formatPricePerHour(carte.tarifHeure)}
              </span>
            </div>
            <p className="text-text-secondary mt-2 text-sm">{carte.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <Badge
                className={
                  carte.actif
                    ? 'bg-success/10 text-success'
                    : 'bg-muted text-text-tertiary'
                }
              >
                {carte.actif ? 'Actif' : 'Inactif'}
              </Badge>
              <div className="flex gap-2">
                <button className="text-text-tertiary hover:text-text-primary">
                  <Pencil size={16} />
                </button>
                <button className="text-text-tertiary hover:text-danger">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="text-text-tertiary mt-3 text-xs">
              {carte.nbReservations} réservations · {carte.caGenere}€ CA généré
            </p>
          </div>
        ))}

        {/* Carte + créer */}
        <button className="border-border text-text-tertiary hover:border-accent-gold/40 hover:text-text-secondary flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-5 transition-colors">
          <Plus size={24} />
          <span className="text-sm font-medium">Créer une nouvelle carte</span>
        </button>
      </div>
    </div>
  );
}
