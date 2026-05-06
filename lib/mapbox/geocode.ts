import 'server-only';

import { serverConfig } from '@/lib/env';

export type GeocodeResult = {
  lat: number;
  lng: number;
  ville: string;
  codePostal: string;
  pays: string;
};

const BASE = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

/**
 * Géocodage forward via Mapbox Places.
 * @param query  ex. "75011 Paris" ou "Boulogne-Billancourt"
 */
export async function geocode(query: string): Promise<GeocodeResult | null> {
  const { MAPBOX_ACCESS_TOKEN } = serverConfig();
  const url = `${BASE}/${encodeURIComponent(query)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&country=fr&limit=1&types=postcode,place,locality`;
  const res = await fetch(url, {
    next: { revalidate: 60 * 60 * 24 * 30 }, // cache 30 jours
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { features?: MapboxFeature[] };
  const feat = data.features?.[0];
  if (!feat) return null;

  const [lng, lat] = feat.center;
  const ville = feat.context?.find((c) => c.id.startsWith('place'))?.text ?? feat.text;
  const codePostal =
    feat.context?.find((c) => c.id.startsWith('postcode'))?.text ??
    (feat.id.startsWith('postcode') ? feat.text : '');

  return {
    lat,
    lng,
    ville,
    codePostal,
    pays: 'FR',
  };
}

type MapboxFeature = {
  id: string;
  text: string;
  center: [number, number];
  context?: Array<{ id: string; text: string }>;
};

/** Helper : géocode codePostal puis retourne lat/lng uniquement. */
export async function geocodeToCoords(
  codePostal: string | null | undefined,
  ville?: string | null,
): Promise<{ lat: number; lng: number } | null> {
  if (!codePostal && !ville) return null;
  const q = [codePostal, ville].filter(Boolean).join(' ');
  const r = await geocode(q);
  return r ? { lat: r.lat, lng: r.lng } : null;
}
