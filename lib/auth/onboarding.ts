'use server';

import { z } from 'zod';

import { requireRole } from '@/lib/auth/session';
import { upsertSportifProfile } from '@/lib/queries/sportif';
import { updateProProfile } from '@/lib/queries/pros';
import { db } from '@/lib/db/client';
import { proProfiles } from '@/lib/db/schema';
import { geocodeToCoords } from '@/lib/mapbox/geocode';
import type { ActionResult } from '@/lib/auth/actions';

const sportifSchema = z.object({
  prenom: z.string().min(1),
  nom: z.string().optional().default('—'),
  age: z.number().int().min(14).max(99),
  genre: z.enum(['homme', 'femme', 'autre']),
  objectifs: z.array(z.string()),
  sports: z.array(z.string()),
  niveau: z.enum(['debutant', 'intermediaire', 'avance']),
  contraintes: z.string().optional(),
  frequence: z.enum(['1x', '2-3x', '4+']),
  ville: z.string().min(2),
  codePostal: z.string().regex(/^\d{5}$/),
  rayonKm: z.number().int().min(1).max(100),
  budgetMin: z.number().int().min(10),
  budgetMax: z.number().int().min(10),
  vibe: z.object({
    pedagogieDiscipline: z.number().int().min(1).max(10),
    suiviAutonomie: z.number().int().min(1).max(10),
    dataRessenti: z.number().int().min(1).max(10),
  }),
});

export async function completeSportifOnboarding(
  input: z.infer<typeof sportifSchema>,
): Promise<ActionResult> {
  let user;
  try {
    user = await requireRole('sportif');
  } catch {
    return { ok: false, error: 'Connecte-toi avant de finaliser ton profil.' };
  }

  const parsed = sportifSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Données invalides',
    };
  }

  const coords = await geocodeToCoords(parsed.data.codePostal, parsed.data.ville);

  await upsertSportifProfile({
    id: user.id,
    prenom: parsed.data.prenom,
    nom: parsed.data.nom,
    age: parsed.data.age,
    genre: parsed.data.genre,
    niveau: parsed.data.niveau,
    objectifs: parsed.data.objectifs,
    sports: parsed.data.sports,
    contraintes: parsed.data.contraintes ?? null,
    frequence: parsed.data.frequence,
    ville: parsed.data.ville,
    codePostal: parsed.data.codePostal,
    lat: coords?.lat ?? null,
    lng: coords?.lng ?? null,
    rayonKm: parsed.data.rayonKm,
    budgetMin: parsed.data.budgetMin,
    budgetMax: parsed.data.budgetMax,
    vibePedagogie: parsed.data.vibe.pedagogieDiscipline,
    vibeSuivi: parsed.data.vibe.suiviAutonomie,
    vibeData: parsed.data.vibe.dataRessenti,
  });

  return { ok: true };
}

const proSchema = z.object({
  prenom: z.string().min(1),
  nom: z.string().min(1),
  specialite: z.enum([
    'coach_sportif',
    'preparateur_physique',
    'preparateur_mental',
    'nutritionniste',
    'educateur_sportif',
  ]),
  sports: z.array(z.string()).min(1),
  formats: z.array(z.string()).min(1),
  bio: z.string().min(20),
  formations: z.array(z.string()).optional().default([]),
  anneesExperience: z.number().int().min(0).max(50),
  ville: z.string().min(2),
  codePostal: z.string().regex(/^\d{5}$/),
  rayonKm: z.number().int().min(1).max(100),
  niveauEnseigne: z.array(z.string()).min(1),
  formule: z.enum(['standard', 'premium', 'elite']).optional().default('standard'),
  tarifMin: z.number().int().min(10),
  tarifMax: z.number().int().min(10),
  vibe: z.object({
    pedagogieDiscipline: z.number().int().min(1).max(10),
    suiviAutonomie: z.number().int().min(1).max(10),
    dataRessenti: z.number().int().min(1).max(10),
  }),
});

export async function completeProOnboarding(
  input: z.infer<typeof proSchema>,
): Promise<ActionResult> {
  let user;
  try {
    user = await requireRole('pro');
  } catch {
    return { ok: false, error: 'Connecte-toi avant de finaliser ton profil.' };
  }

  const parsed = proSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Données invalides',
    };
  }

  const coords = await geocodeToCoords(parsed.data.codePostal, parsed.data.ville);

  // INSERT si pas encore de profil pro, sinon UPDATE
  await db
    .insert(proProfiles)
    .values({
      id: user.id,
      prenom: parsed.data.prenom,
      nom: parsed.data.nom,
      specialite: parsed.data.specialite,
      sports: parsed.data.sports,
      formats: parsed.data.formats,
      bio: parsed.data.bio,
      formations: parsed.data.formations,
      anneesExperience: parsed.data.anneesExperience,
      ville: parsed.data.ville,
      codePostal: parsed.data.codePostal,
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
      rayonKm: parsed.data.rayonKm,
      niveauEnseigne: parsed.data.niveauEnseigne,
      formule: parsed.data.formule,
      tarifMin: parsed.data.tarifMin,
      tarifMax: parsed.data.tarifMax,
      vibePedagogie: parsed.data.vibe.pedagogieDiscipline,
      vibeSuivi: parsed.data.vibe.suiviAutonomie,
      vibeData: parsed.data.vibe.dataRessenti,
    })
    .onConflictDoUpdate({
      target: proProfiles.id,
      set: {
        prenom: parsed.data.prenom,
        nom: parsed.data.nom,
        specialite: parsed.data.specialite,
        sports: parsed.data.sports,
        formats: parsed.data.formats,
        bio: parsed.data.bio,
        formations: parsed.data.formations,
        anneesExperience: parsed.data.anneesExperience,
        ville: parsed.data.ville,
        codePostal: parsed.data.codePostal,
        lat: coords?.lat ?? null,
        lng: coords?.lng ?? null,
        rayonKm: parsed.data.rayonKm,
        niveauEnseigne: parsed.data.niveauEnseigne,
        formule: parsed.data.formule,
        tarifMin: parsed.data.tarifMin,
        tarifMax: parsed.data.tarifMax,
        vibePedagogie: parsed.data.vibe.pedagogieDiscipline,
        vibeSuivi: parsed.data.vibe.suiviAutonomie,
        vibeData: parsed.data.vibe.dataRessenti,
      },
    });

  // Le silence le warning lint sur updateProProfile non utilisé
  void updateProProfile;

  return { ok: true };
}
