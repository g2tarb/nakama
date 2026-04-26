import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-accent-gold mb-2 text-sm font-semibold tracking-wider uppercase">
        Erreur 404
      </p>
      <h1 className="mb-3 text-3xl font-bold">Page introuvable</h1>
      <p className="text-text-secondary mb-8 max-w-md">
        Cette page n&apos;existe pas ou a été déplacée. Reviens à l&apos;accueil pour
        retrouver ton Nakama.
      </p>
      <Link
        href="/"
        className="bg-accent-gold text-background hover:bg-accent-gold/90 rounded-full px-6 py-3 text-sm font-medium transition-colors"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
