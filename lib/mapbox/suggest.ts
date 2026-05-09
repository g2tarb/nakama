'use server';

import { serverConfig } from '@/lib/env';

export type PlaceSuggestion = {
  id: string;
  name: string;
  fullName: string;
};

type MapboxSuggestion = {
  mapbox_id: string;
  name: string;
  place_formatted?: string;
  full_address?: string;
  feature_type?: string;
};

/**
 * Mapbox Search Box API — suggestions de lieux pour autocomplete.
 * Filtré FR + types pertinents (ville, quartier, code postal).
 *
 * Note : on génère un session_token aléatoire à chaque appel.
 * Pour optimiser le pricing Mapbox sur de gros volumes, regrouper
 * les suggest+retrieve d'une même session sous un même token.
 */
export async function suggestPlaces(query: string): Promise<PlaceSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const { MAPBOX_ACCESS_TOKEN } = serverConfig();
  const sessionToken =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const url = new URL('https://api.mapbox.com/search/searchbox/v1/suggest');
  url.searchParams.set('q', trimmed);
  url.searchParams.set('access_token', MAPBOX_ACCESS_TOKEN);
  url.searchParams.set('session_token', sessionToken);
  url.searchParams.set('country', 'fr');
  url.searchParams.set('language', 'fr');
  url.searchParams.set('types', 'place,locality,neighborhood,postcode,district');
  url.searchParams.set('limit', '8');

  try {
    const res = await fetch(url, {
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      console.error('[mapbox suggest] HTTP', res.status);
      return [];
    }
    const data = (await res.json()) as { suggestions?: MapboxSuggestion[] };
    return (data.suggestions ?? []).map((s) => ({
      id: s.mapbox_id,
      name: s.name,
      fullName: s.place_formatted ?? s.full_address ?? s.name,
    }));
  } catch (err) {
    console.error('[mapbox suggest] fetch error', err);
    return [];
  }
}
