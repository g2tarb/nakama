import { z } from 'zod';

const NIVEAU = z.enum(['debutant', 'intermediaire', 'avance']);
const GENRE = z.enum(['homme', 'femme', 'autre']);
const OBJECTIF = z.enum([
  'perte_poids',
  'prise_masse',
  'post_blessure',
  'preparation_competition',
  'bien_etre',
  'autre',
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
const FREQUENCE = z.enum(['1x', '2-3x', '4+']);

export const vibeSchema = z.object({
  pedagogieDiscipline: z.number().int().min(1).max(10),
  suiviAutonomie: z.number().int().min(1).max(10),
  dataRessenti: z.number().int().min(1).max(10),
});

export const onboardingSportifSchema = z.object({
  prenom: z.string().min(2, 'Prénom trop court').max(40),
  age: z.number().int().min(14, 'Âge minimum 14 ans').max(99),
  genre: GENRE,
  objectifs: z.array(OBJECTIF).min(1, 'Choisis au moins un objectif'),
  sports: z.array(SPORT).min(1, 'Choisis au moins un sport'),
  niveau: NIVEAU,
  contraintes: z.string().max(280).optional(),
  frequence: FREQUENCE,
  ville: z.string().min(2, 'Ville requise').max(60),
  codePostal: z.string().regex(/^\d{5}$/, 'Code postal invalide (5 chiffres)'),
  rayonKm: z.number().int().min(1).max(100),
  budgetMin: z.number().int().min(10).max(500),
  budgetMax: z.number().int().min(10).max(500),
  vibe: vibeSchema,
});

export type OnboardingSportifInput = z.infer<typeof onboardingSportifSchema>;
