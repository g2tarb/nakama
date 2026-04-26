import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { ClientShell } from '@/components/common/client-shell';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Nakama — Le Doctolib du coaching sportif',
  description:
    'Trouve le coach sportif qui te correspond vraiment. Matching comportemental, réservation simple, progression suivie.',
  openGraph: {
    title: 'Nakama — Le Doctolib du coaching sportif',
    description:
      'Trouve le coach sportif qui te correspond vraiment. Matching comportemental, réservation simple, progression suivie.',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
        <ClientShell />
      </body>
    </html>
  );
}
