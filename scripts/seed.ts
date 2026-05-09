/**
 * Seed Nakama
 * -----------
 * Insère/upsert les mocks (50 pros, sportifs, séances) directement en DB
 * via service_role, et géocode chaque profil via Mapbox pour le tri par
 * distance dans la recherche.
 *
 *   pnpm tsx scripts/seed.ts
 *
 * Idempotent : ré-exécutable, met à jour les rows existantes (lat/lng).
 *
 * ⚠️ Ce script crée des comptes auth.users factices via Supabase Admin API.
 *    Les emails sont déterministes : {role}-{slug}@nakama-demo.local
 *    Mots de passe : 'demo-password-2026' pour tous.
 */
import { config } from 'dotenv';
config({ path: '.env.local' });
config(); // fallback .env

import { eq, sql as drizzleSql } from 'drizzle-orm';
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from '../lib/db/schema';
import { pros as mockPros } from '../lib/mock-data/pros';
import { sportifs as mockSportifs } from '../lib/mock-data/sportifs';
import { seances as mockSeances } from '../lib/mock-data/seances';
import type { Pro, Sportif } from '../types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const DATABASE_URL = process.env.DATABASE_URL_DIRECT ?? process.env.DATABASE_URL!;
const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !DATABASE_URL) {
  console.error(
    'Manque NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / DATABASE_URL',
  );
  process.exit(1);
}
if (!MAPBOX_TOKEN) {
  console.warn('⚠️ MAPBOX_ACCESS_TOKEN manquant — le seed insère sans coords.');
}

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const sql = postgres(DATABASE_URL, { prepare: false, max: 5 });
const db = drizzle(sql, { schema });

const SEED_PASSWORD = 'demo-password-2026';

function slug(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/* ──────────────── Mapbox geocoding inline ──────────────── */

const geocodeCache = new Map<string, { lat: number; lng: number } | null>();

async function geocode(
  codePostal: string | null | undefined,
  ville: string | null | undefined,
): Promise<{ lat: number; lng: number } | null> {
  if (!MAPBOX_TOKEN) return null;
  if (!codePostal && !ville) return null;
  const q = [codePostal, ville].filter(Boolean).join(' ').trim();
  if (!q) return null;
  if (geocodeCache.has(q)) return geocodeCache.get(q) ?? null;

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?access_token=${MAPBOX_TOKEN}&country=fr&limit=1&types=postcode,place,locality,neighborhood`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      geocodeCache.set(q, null);
      return null;
    }
    const data = (await res.json()) as { features?: Array<{ center: [number, number] }> };
    const center = data.features?.[0]?.center;
    if (!center) {
      geocodeCache.set(q, null);
      return null;
    }
    const result = { lat: center[1], lng: center[0] };
    geocodeCache.set(q, result);
    return result;
  } catch {
    geocodeCache.set(q, null);
    return null;
  }
}

async function ensureAuthUser(email: string, prenom: string, nom: string) {
  const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const existing = list?.users.find((u) => u.email === email);
  if (existing) return existing.id;

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: SEED_PASSWORD,
    email_confirm: true,
    user_metadata: { prenom, nom },
  });
  if (error || !data.user)
    throw new Error(`Auth user create ${email}: ${error?.message}`);
  return data.user.id;
}

async function seedPros() {
  console.log(`▸ Seeding ${mockPros.length} pros (avec géocodage)…`);
  const idMap = new Map<string, string>();
  let geocoded = 0;

  for (const p of mockPros as Pro[]) {
    const email = `pro-${slug(`${p.prenom}-${p.nom}`)}@nakama-demo.local`;
    const userId = await ensureAuthUser(email, p.prenom, p.nom);
    idMap.set(p.id, userId);

    const coords = await geocode(p.codePostal, p.ville);
    if (coords) geocoded++;

    await db
      .insert(schema.userRoles)
      .values({ userId, role: 'pro' })
      .onConflictDoNothing();

    const baseValues = {
      prenom: p.prenom,
      nom: p.nom,
      photoUrl: p.photo,
      specialite: p.specialite,
      sports: p.sports,
      formats: p.formats,
      bio: p.bio,
      formations: p.formations,
      anneesExperience: p.anneesExperience,
      ville: p.ville,
      codePostal: p.codePostal,
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
      rayonKm: p.rayonKm,
      niveauEnseigne: p.niveauEnseigne,
      formule: p.formule,
      tarifMin: p.tarifMin,
      tarifMax: p.tarifMax,
      vibePedagogie: p.vibe.pedagogieDiscipline,
      vibeSuivi: p.vibe.suiviAutonomie,
      vibeData: p.vibe.dataRessenti,
      note: p.note,
      nbAvis: p.nbAvis,
      actif: true,
    };

    await db
      .insert(schema.proProfiles)
      .values({ id: userId, ...baseValues })
      .onConflictDoUpdate({
        target: schema.proProfiles.id,
        set: baseValues,
      });

    for (const c of p.cartesServices) {
      await db
        .insert(schema.cartesServices)
        .values({
          proId: userId,
          nom: c.nom,
          sport: c.sport,
          description: c.description,
          tarifHeure: c.tarifHeure,
          dureeMinutes: c.dureeMinutes,
          format: c.format,
          tags: c.tags,
          actif: c.actif,
          nbReservations: c.nbReservations,
          caGenere: c.caGenere,
        })
        .onConflictDoNothing();
    }
  }

  console.log(`  ✓ ${geocoded}/${mockPros.length} pros géocodés`);
  return idMap;
}

async function seedSportifs() {
  console.log(`▸ Seeding ${mockSportifs.length} sportifs (avec géocodage)…`);
  const idMap = new Map<string, string>();
  let geocoded = 0;

  for (const s of mockSportifs as Sportif[]) {
    const email = `sportif-${slug(`${s.prenom}-${s.nom}`)}@nakama-demo.local`;
    const userId = await ensureAuthUser(email, s.prenom, s.nom);
    idMap.set(s.id, userId);

    const coords = await geocode(s.codePostal, s.ville);
    if (coords) geocoded++;

    await db
      .insert(schema.userRoles)
      .values({ userId, role: 'sportif' })
      .onConflictDoNothing();

    const baseValues = {
      prenom: s.prenom,
      nom: s.nom,
      age: s.age,
      genre: s.genre,
      photoUrl: s.photo,
      niveau: s.niveau,
      objectifs: s.objectifs,
      sports: s.sports,
      contraintes: s.contraintes ?? null,
      frequence: s.frequence,
      ville: s.ville,
      codePostal: s.codePostal,
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
      rayonKm: s.rayonKm,
      budgetMin: s.budgetMin,
      budgetMax: s.budgetMax,
      vibePedagogie: s.vibe.pedagogieDiscipline,
      vibeSuivi: s.vibe.suiviAutonomie,
      vibeData: s.vibe.dataRessenti,
      bio: s.bio ?? null,
    };

    await db
      .insert(schema.sportifProfiles)
      .values({ id: userId, ...baseValues })
      .onConflictDoUpdate({
        target: schema.sportifProfiles.id,
        set: baseValues,
      });
  }

  console.log(`  ✓ ${geocoded}/${mockSportifs.length} sportifs géocodés`);
  return idMap;
}

async function seedSeances(
  proIdMap: Map<string, string>,
  sportifIdMap: Map<string, string>,
) {
  console.log(`▸ Seeding ${mockSeances.length} seances…`);
  for (const s of mockSeances) {
    const proId = proIdMap.get(s.proId);
    const sportifId = sportifIdMap.get(s.sportifId);
    if (!proId || !sportifId) continue;

    await db
      .insert(schema.seances)
      .values({
        proId,
        sportifId,
        dateDebut: new Date(s.date),
        dureeMinutes: s.dureeMinutes,
        lieu: s.lieu,
        tarif: s.tarif,
        statut: s.statut,
        ressentiClient: s.ressentiClient ?? null,
        chargePercue: s.chargePercue ?? null,
        compteRenduCoach: s.compteRenduCoach ?? null,
      })
      .onConflictDoNothing();
  }
  // Réfute les warnings TS sur les imports non utilisés (eq, drizzleSql) :
  // ces helpers Drizzle restent disponibles pour de futures migrations.
  void eq;
  void drizzleSql;
}

async function main() {
  try {
    const proIds = await seedPros();
    const sportifIds = await seedSportifs();
    await seedSeances(proIds, sportifIds);
    console.log('✅ Seed terminé.');
  } catch (e) {
    console.error('❌ Seed error:', e);
    process.exitCode = 1;
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main();
