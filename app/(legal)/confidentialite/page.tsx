import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Politique de protection des données personnelles Nakama.',
};

export default function ConfidentialitePage() {
  return (
    <>
      <h1 className="text-accent-gold mb-2 text-2xl font-bold">
        Politique de confidentialité
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
            Ce contenu est un placeholder RGPD. La politique définitive doit être validée
            avec un DPO ou un avocat avant ouverture aux utilisateurs réels.
          </p>
        </div>

        <h2 className="text-text-primary mt-8 text-lg font-semibold">
          1. Responsable de traitement
        </h2>
        <p>
          Nakama, éditeur du site (cf. mentions légales), est responsable de traitement
          des données collectées via la plateforme.
        </p>

        <h2 className="text-text-primary mt-6 text-lg font-semibold">
          2. Données collectées
        </h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>Identité : prénom, nom, âge, genre, photo</li>
          <li>Coordonnées : email, téléphone, adresse</li>
          <li>Données sportives : niveau, objectifs, fréquence, contraintes</li>
          <li>Données de paiement : via Stripe (PCI-DSS)</li>
          <li>Données de navigation : cookies techniques essentiels</li>
        </ul>

        <h2 className="text-text-primary mt-6 text-lg font-semibold">3. Finalités</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>Fourniture du service de mise en relation et réservation</li>
          <li>Gestion des paiements et facturation</li>
          <li>Amélioration de l&apos;algorithme de matching</li>
          <li>Communication transactionnelle (confirmations, rappels)</li>
        </ul>

        <h2 className="text-text-primary mt-6 text-lg font-semibold">4. Bases légales</h2>
        <p>
          Exécution du contrat (réservations), consentement (communications marketing),
          intérêt légitime (sécurité, prévention fraude).
        </p>

        <h2 className="text-text-primary mt-6 text-lg font-semibold">5. Conservation</h2>
        <p>
          Compte actif : durée d&apos;utilisation. Compte clôturé : 3 ans à des fins
          comptables et de prospection. Données de paiement : 13 mois (Stripe).
        </p>

        <h2 className="text-text-primary mt-6 text-lg font-semibold">6. Destinataires</h2>
        <p>
          Sous-traitants techniques : Vercel (hébergement), Stripe (paiement), Resend ou
          Postmark (email transactionnel, à venir).
        </p>

        <h2 className="text-text-primary mt-6 text-lg font-semibold">7. Vos droits</h2>
        <p>
          Accès, rectification, effacement, portabilité, opposition, limitation. Pour
          exercer vos droits :{' '}
          <a href="mailto:dpo@nakama.tech" className="text-accent-gold hover:underline">
            dpo@nakama.tech
          </a>
          . Vous pouvez également déposer une réclamation auprès de la CNIL (cnil.fr).
        </p>

        <h2 className="text-text-primary mt-6 text-lg font-semibold">8. Cookies</h2>
        <p>
          Le site utilise uniquement des cookies techniques essentiels au fonctionnement
          (session, préférences). Aucun cookie de tracking publicitaire.
        </p>
      </section>
    </>
  );
}
