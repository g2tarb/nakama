import type { MetadataRoute } from 'next';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/accueil',
          '/recherche',
          '/pros/',
          '/rdv',
          '/profil',
          '/messages',
          '/messages/',
          '/reservation/',
          '/dashboard',
          '/clients',
          '/clients/',
          '/agenda',
          '/cartes-services',
          '/revenus',
          '/parametres',
        ],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
