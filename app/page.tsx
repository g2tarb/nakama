import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Hero } from '@/components/public/hero';
import {
  FeaturesSportif,
  FeaturesPro,
  HowItWorks,
} from '@/components/public/features-section';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <span className="text-accent-gold text-xl font-bold">NAKAMA</span>
          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#comment-ca-marche"
              className="text-text-secondary hover:text-text-primary text-sm transition-colors"
            >
              Comment ça marche
            </a>
            <Link href="/connexion">
              <Button variant="outline" size="sm">
                Connexion
              </Button>
            </Link>
          </nav>
          <Link href="/connexion" className="md:hidden">
            <Button variant="ghost" size="sm">
              Connexion
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero animé */}
      <Hero />

      {/* Features */}
      <FeaturesSportif />
      <FeaturesPro />
      <HowItWorks />

      {/* Footer */}
      <footer className="border-border border-t px-4 py-8">
        <div className="text-text-tertiary mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm md:flex-row">
          <span>&copy; 2026 Nakama. Tous droits réservés.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-text-secondary">
              CGU
            </a>
            <a href="#" className="hover:text-text-secondary">
              Politique de confidentialité
            </a>
            <a href="#" className="hover:text-text-secondary">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
