/**
 * Seed Nakama
 * -----------
 * Insère les mocks (50 pros, sportifs, séances) directement en DB via service_role.
 * À lancer une seule fois après les migrations :
 *
 *   pnpm tsx scripts/seed.ts
 *
 * ⚠️ Ce script crée des comptes auth.users factices via Supabase Admin API.
 *    Les emails sont déterministes : {role}-{slug}@nakama-demo.local
 *    Mots de passe : 'demo-password-2026' pour tous.
 */
import { config } from 'dotenv';
config({ path: '.env.local' });
config(); // fallback .env

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

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !DATABASE_URL) {
  console.error(
    'Manque NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / DATABASE_URL',
  );
  process.exit(1);
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

async function ensureAuthUser(email: string, prenom: string, nom: string) {
  // Cherche l'user existant
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
  console.log(`▸ Seeding ${mockPros.length} pros…`);
  const idMap = new Map<string, string>(); // mock id → real auth.users.id

  for (const p of mockPros as Pro[]) {
    const email = `pro-${slug(`${p.prenom}-${p.nom}`)}@nakama-demo.local`;
    const userId = await ensureAuthUser(email, p.prenom, p.nom);
    idMap.set(p.id, userId);

    await db
      .insert(schema.userRoles)
      .values({ userId, role: 'pro' })
      .onConflictDoNothing();

    await db
      .insert(schema.proProfiles)
      .values({
        id: userId,
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
      })
      .onConflictDoNothing();

    for (const c of p.cartesServices) {
      await db
        .insert(schema.cartesServices)
        .values({
          // id auto-généré par la DB (gen_random_uuid)
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

  return idMap;
}

async function seedSportifs() {
  console.log(`▸ Seeding ${mockSportifs.length} sportifs…`);
  const idMap = new Map<string, string>();

  for (const s of mockSportifs as Sportif[]) {
    const email = `sportif-${slug(`${s.prenom}-${s.nom}`)}@nakama-demo.local`;
    const userId = await ensureAuthUser(email, s.prenom, s.nom);
    idMap.set(s.id, userId);

    await db
      .insert(schema.userRoles)
      .values({ userId, role: 'sportif' })
      .onConflictDoNothing();

    await db
      .insert(schema.sportifProfiles)
      .values({
        id: userId,
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
        rayonKm: s.rayonKm,
        budgetMin: s.budgetMin,
        budgetMax: s.budgetMax,
        vibePedagogie: s.vibe.pedagogieDiscipline,
        vibeSuivi: s.vibe.suiviAutonomie,
        vibeData: s.vibe.dataRessenti,
        bio: s.bio ?? null,
      })
      .onConflictDoNothing();
  }

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
