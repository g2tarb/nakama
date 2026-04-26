import { z } from 'zod';
import { vibeSchema } from './onboarding-sportif';

const SPECIALITE = z.enum([
  'coach_sportif',
  'preparateur_physique',
  'preparateur_mental',
  'nutritionniste',
  'educateur_sportif',
]);
const SPORT = z.enum([
  'fitness',
  'running',
  'yoga',
  'musculation',
  'crossfit',
  'natation',
  'boxe',
  'football',
  'tennis',
  'autre',
]);
const FORMAT = z.enum(['presentiel', 'distanciel', 'hybride']);
const FORMULE = z.enum(['standard', 'premium', 'elite']);

export const carteServiceCreateSchema = z.object({
  nom: z.string().min(3, 'Nom trop court').max(60),
  sport: SPORT,
  description: z.string().min(20, 'Décris en quelques mots').max(280),
  tarifHeure: z.number().int().min(10, 'Tarif minimum 10€').max(500),
  dureeMinutes: z.number().int().min(30).max(180),
  format: FORMAT,
});

export type CarteServiceCreateInput = z.infer<typeof carteServiceCreateSchema>;

export const onboardingProSchema = z.object({
  prenom: z.string().min(2).max(40),
  nom: z.string().min(2).max(40),
  bio: z.string().min(40, 'Décris-toi en quelques phrases').max(500),
  specialite: SPECIALITE,
  formations: z.array(z.string().min(2)).min(1, 'Au moins une formation'),
  anneesExperience: z.number().int().min(0).max(60),
  premiereCarte: carteServiceCreateSchema,
  ville: z.string().min(2).max(60),
  codePostal: z.string().regex(/^\d{5}$/, 'Code postal invalide (5 chiffres)'),
  rayonKm: z.number().int().min(1).max(100),
  formats: z.array(FORMAT).min(1, 'Choisis au moins un format'),
  formule: FORMULE,
  vibe: vibeSchema,
});

export type OnboardingProInput = z.infer<typeof onboardingProSchema>;
