import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CrossCtaPro() {
  return (
    <section
      id="pros"
      className="px-4 py-20"
      style={{ background: 'var(--color-bg-overlay)' }}
    >
      <div className="mx-auto max-w-[880px] text-center">
        <span className="nk-eyebrow">Tu accompagnes des sportifs ?</span>
        <h2 className="nk-h1 text-accent-gold mt-3 mb-4">Rejoins l’espace pro</h2>
        <p className="text-text-secondary mx-auto mb-8 max-w-[640px] text-base leading-relaxed">
          Profil mis en avant, agenda intégré, paiement sécurisé, fiche athlète unifiée. À
          partir de 29 € par mois.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/inscription/pro"
            className="bg-primary text-primary-foreground hover:bg-accent-gold-hover inline-flex items-center gap-2 rounded-[10px] border border-transparent px-6 py-3 text-[15px] font-semibold transition-all hover:-translate-y-px active:translate-y-px"
          >
            Créer mon profil pro
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/pro/abonnement"
            className="text-text-primary hover:bg-accent-gold-wash inline-flex items-center gap-2 rounded-[10px] border px-6 py-3 text-[15px] font-medium transition-colors"
            style={{ borderColor: 'var(--color-accent-muted)' }}
          >
            Voir les formules
          </Link>
        </div>
      </div>
    </section>
  );
}
