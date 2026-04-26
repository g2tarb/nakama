import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales du site Nakama.',
};

export default function MentionsLegalesPage() {
  return (
    <>
      <h1 className="text-accent-gold mb-2 text-2xl font-bold">Mentions légales</h1>
      <p className="text-text-tertiary mb-8 text-sm">
        Dernière mise à jour : 26 avril 2026
      </p>

      <section className="text-text-secondary space-y-4 text-sm leading-relaxed">
        <div className="border-warning/30 bg-warning/5 rounded-lg border p-4">
          <p className="text-warning text-xs font-semibold tracking-wider uppercase">
            Document à finaliser
          </p>
          <p className="text-text-secondary mt-2">
            Ce contenu est un placeholder. Les mentions légales définitives doivent être
            rédigées avec le service juridique avant ouverture aux utilisateurs réels.
          </p>
        </div>

        <h2 className="text-text-primary mt-8 text-lg font-semibold">Éditeur</h2>
        <p>
          Nakama — Société à compléter
          <br />
          Adresse : à compléter
          <br />
          SIRET : à compléter
          <br />
          Capital social : à compléter
          <br />
          Directeur de publication : Haykel Jelidi
        </p>

        <h2 className="text-text-primary mt-6 text-lg font-semibold">Contact</h2>
        <p>
          Email :{' '}
          <a
            href="mailto:contact@nakama.tech"
            className="text-accent-gold hover:underline"
          >
            contact@nakama.tech
          </a>
        </p>

        <h2 className="text-text-primary mt-6 text-lg font-semibold">Hébergement</h2>
        <p>
          Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA —{' '}
          <a
            href="https://vercel.com"
            className="text-accent-gold hover:underline"
            target="_blank"
            rel="noopener"
          >
            vercel.com
          </a>
        </p>

        <h2 className="text-text-primary mt-6 text-lg font-semibold">
          Propriété intellectuelle
        </h2>
        <p>
          L&apos;ensemble des contenus, marques, logos et éléments graphiques du site sont
          la propriété exclusive de Nakama, sauf mention contraire. Toute reproduction
          sans autorisation écrite préalable est interdite.
        </p>
      </section>
    </>
  );
}
