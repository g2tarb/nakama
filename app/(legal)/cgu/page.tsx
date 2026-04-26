import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditions générales d’utilisation',
  description: 'CGU de la plateforme Nakama.',
};

export default function CguPage() {
  return (
    <>
      <h1 className="text-accent-gold mb-2 text-2xl font-bold">
        Conditions générales d&apos;utilisation
      </h1>
      <p className="text-text-tertiary mb-8 text-sm">
        Dernière mise à jour : 26 avril 2026
      </p>

      <section className="text-text-secondary space-y-4 text-sm leading-relaxed">
        <div className="border-warning/30 bg-warning/5 rounded-lg border p-4">
          <p className="text-warning text-xs font-semibold tracking-wider uppercase">
            Document à finaliser
          </p>
          <p className="text-text-secondary mt-2">
            Ce contenu est un placeholder. Les CGU définitives doivent être rédigées avec
            le service juridique avant ouverture aux utilisateurs réels et avant
            intégration paiement Stripe.
          </p>
        </div>

        <h2 className="text-text-primary mt-8 text-lg font-semibold">1. Objet</h2>
        <p>
          Les présentes CGU régissent l&apos;utilisation de la plateforme Nakama,
          marketplace mettant en relation sportifs amateurs et professionnels du coaching
          sportif.
        </p>

        <h2 className="text-text-primary mt-6 text-lg font-semibold">
          2. Inscription et compte
        </h2>
        <p>
          L&apos;inscription nécessite des informations exactes. Tout utilisateur est
          responsable de la confidentialité de ses identifiants.
        </p>

        <h2 className="text-text-primary mt-6 text-lg font-semibold">
          3. Réservation et paiement
        </h2>
        <p>
          Les réservations de séances sont confirmées après paiement. Une commission de
          3,5% + 0,50€ est prélevée par Nakama sur chaque transaction.
        </p>

        <h2 className="text-text-primary mt-6 text-lg font-semibold">4. Annulation</h2>
        <p>
          Annulation gratuite jusqu&apos;à 24h avant la séance. Au-delà, la séance est due
          intégralement.
        </p>

        <h2 className="text-text-primary mt-6 text-lg font-semibold">
          5. Responsabilités
        </h2>
        <p>
          Nakama est un intermédiaire technique. La qualité des prestations relève de la
          responsabilité des coachs professionnels référencés.
        </p>

        <h2 className="text-text-primary mt-6 text-lg font-semibold">
          6. Données personnelles
        </h2>
        <p>
          Voir la{' '}
          <a href="/confidentialite" className="text-accent-gold hover:underline">
            Politique de confidentialité
          </a>
          .
        </p>

        <h2 className="text-text-primary mt-6 text-lg font-semibold">
          7. Modification des CGU
        </h2>
        <p>
          Nakama se réserve le droit de modifier les présentes CGU à tout moment. Les
          utilisateurs seront informés par email.
        </p>

        <h2 className="text-text-primary mt-6 text-lg font-semibold">
          8. Loi applicable
        </h2>
        <p>
          Droit français. Tribunaux compétents : ceux du ressort du siège social de
          l&apos;éditeur.
        </p>
      </section>
    </>
  );
}
