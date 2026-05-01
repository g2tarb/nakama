'use client';

import { useState } from 'react';
import { Info, X } from 'lucide-react';

export function DemoBanner() {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <div className="bg-accent-gold/10 border-accent-gold/20 sticky top-0 z-[60] flex items-center justify-center gap-2 border-b px-4 py-2 text-xs backdrop-blur-sm">
      <Info size={14} className="text-accent-gold shrink-0" />
      <p className="text-text-secondary text-center">
        <strong className="text-accent-gold">Démo prototype</strong>. Aucune donnée
        n&apos;est conservée, pas de paiement réel.
      </p>
      <button
        onClick={() => setShow(false)}
        className="text-text-tertiary hover:text-text-primary ml-2 shrink-0"
        aria-label="Fermer la bannière démo"
      >
        <X size={14} />
      </button>
    </div>
  );
}
