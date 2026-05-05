import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { CrossCtaPro } from '@/components/public/cross-cta-pro';
import { FeatureMockup } from '@/components/public/feature-mockup';
import { HowItWorks } from '@/components/public/features-section';
import { Hero } from '@/components/public/hero';
import { Testimonials } from '@/components/public/testimonials';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logos/nakama-symbol.svg"
              alt=""
              width={26}
              height={26}
              priority
            />
            <span className="text-accent-gold text-[17px] font-bold tracking-[0.04em]">
              NAKAMA
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <a
              href="#comment-ca-marche"
              className="text-text-secondary hover:text-text-primary rounded-md px-3 py-2 text-sm transition-colors"
            >
              Comment ça marche
            </a>
            <a
              href="#pros"
              className="text-text-secondary hover:text-text-primary rounded-md px-3 py-2 text-sm transition-colors"
            >
              Pour les coachs
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

      <Hero />
      <HowItWorks />
      <FeatureMockup />
      <Testimonials />
      <CrossCtaPro />

      <footer className="border-border border-t px-4 py-8">
        <div className="text-text-tertiary mx-auto flex max-w-[1080px] flex-col items-center justify-between gap-4 text-sm md:flex-row">
          <span>&copy; 2026 Nakama. Tous droits réservés.</span>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/cgu" className="hover:text-text-secondary">
              CGU
            </Link>
            <Link href="/confidentialite" className="hover:text-text-secondary">
              Confidentialité
            </Link>
            <Link href="/mentions-legales" className="hover:text-text-secondary">
              Mentions légales
            </Link>
            <a href="mailto:contact@nakama.tech" className="hover:text-text-secondary">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
