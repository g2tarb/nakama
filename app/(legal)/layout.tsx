import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  robots: { index: true, follow: true },
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-10 lg:px-8">
      <Link
        href="/"
        className="text-text-secondary hover:text-text-primary mb-8 inline-flex items-center gap-2 text-sm"
      >
        <ArrowLeft size={16} />
        Retour à l&apos;accueil
      </Link>
      <article className="prose prose-invert max-w-none">{children}</article>
    </div>
  );
}
