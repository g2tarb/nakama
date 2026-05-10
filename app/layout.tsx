import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { ClientShell } from '@/components/common/client-shell';
import { DemoBanner } from '@/components/common/demo-banner';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const TITLE = 'Nakama, le Doctolib du coaching sportif';
const DESCRIPTION =
  'Trouve le coach sportif qui te correspond vraiment. Matching comportemental, réservation simple, progression suivie.';

export const dynamic = 'force-dynamic';

export const viewport: Viewport = {
  themeColor: '#1E2A3A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: TITLE,
    template: '%s · Nakama',
  },
  description: DESCRIPTION,
  applicationName: 'Nakama',
  keywords: [
    'coaching sportif',
    'coach sport',
    'préparateur physique',
    'matching coach',
    'réservation séance sport',
    'doctolib sport',
  ],
  authors: [{ name: 'Nakama' }],
  creator: 'Nakama',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Nakama',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    locale: 'fr_FR',
    url: APP_URL,
    siteName: 'Nakama',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${APP_URL}/#organization`,
      name: 'Nakama',
      url: APP_URL,
      logo: `${APP_URL}/icon`,
      description: DESCRIPTION,
      sameAs: [],
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Nakama',
      operatingSystem: 'Web',
      applicationCategory: 'HealthApplication',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      description: DESCRIPTION,
      url: APP_URL,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <DemoBanner />
        {children}
        <ClientShell />
      </body>
    </html>
  );
}
