import type { Sportif, Pro, MatchScore, Niveau, Objectif } from '@/types';
import { MAX_SCORE } from './constants';

/**
 * Calcule le score de compatibilité entre un sportif et un pro.
 * Scoring sur 100 pts : Logistique (45) + Performance (20) + Psychologie (35)
 */
export function computeMatchScore(sportif: Sportif, pro: Pro): MatchScore {
  // --- Pilier Logistique (45 pts) ---

  // Sport compatible : 20 si au moins un sport en commun
  const sportCompatible = sportif.sports.some((s) => pro.sports.includes(s)) ? 20 : 0;

  // Budget : 15 si tarifMin du pro <= budgetMax du sportif
  let budgetCompatible = 0;
  if (pro.tarifMin <= sportif.budgetMax) {
    budgetCompatible = 15;
  } else {
    const ecartPct = (pro.tarifMin - sportif.budgetMax) / sportif.budgetMax;
    budgetCompatible = Math.max(0, 15 - Math.round(ecartPct * 15));
  }

  // Distance : mockée à partir des codes postaux
  const distanceKm = computeMockDistance(sportif.codePostal, pro.codePostal);
  const distance = distanceKm < 5 ? 10 : distanceKm < 10 ? 7 : distanceKm < 20 ? 4 : 0;

  const logistique = sportCompatible + budgetCompatible + distance;

  // --- Pilier Performance (20 pts) ---

  // Tags communs : 3 pts par tag, plafonné à 15
  const sportifTags = extractTagsFromObjectifs(sportif.objectifs);
  const proTags = pro.cartesServices.flatMap((c) => c.tags);
  const tagsCommuns = Math.min(
    15,
    sportifTags.filter((t) => proTags.includes(t)).length * 3,
  );

  // Cohérence niveau : 5 si identique, 3 si voisin, 0 si éloigné
  const niveauCoherence = computeNiveauCoherence(sportif.niveau, pro.niveauEnseigne);

  const performance = tagsCommuns + niveauCoherence;

  // --- Pilier Psychologie (35 pts) ---

  const pedagogieDiscipline = Math.max(
    0,
    15 - Math.abs(sportif.vibe.pedagogieDiscipline - pro.vibe.pedagogieDiscipline),
  );
  const suiviAutonomie = Math.max(
    0,
    10 - Math.abs(sportif.vibe.suiviAutonomie - pro.vibe.suiviAutonomie),
  );
  const dataRessenti = Math.max(
    0,
    10 - Math.abs(sportif.vibe.dataRessenti - pro.vibe.dataRessenti),
  );

  const psychologie = pedagogieDiscipline + suiviAutonomie + dataRessenti;

  const scoreTotal = Math.min(MAX_SCORE, logistique + performance + psychologie);

  return {
    proId: pro.id,
    scoreTotal,
    logistique,
    performance,
    psychologie,
    details: {
      sportCompatible,
      budgetCompatible,
      distance,
      tagsCommuns,
      niveauCoherence,
      pedagogieDiscipline,
      suiviAutonomie,
      dataRessenti,
    },
  };
}

/**
 * Trie les pros par score de compatibilité décroissant.
 */
export function rankPros(sportif: Sportif, pros: Pro[]): MatchScore[] {
  return pros
    .map((pro) => computeMatchScore(sportif, pro))
    .sort((a, b) => b.scoreTotal - a.scoreTotal);
}

// --- Fonctions utilitaires internes ---

function computeMockDistance(cp1: string, cp2: string): number {
  // Distance simplifiée basée sur les 2 premiers chiffres du code postal
  const d1 = parseInt(cp1.slice(0, 2), 10);
  const d2 = parseInt(cp2.slice(0, 2), 10);

  if (d1 === d2) {
    // Même département : variation à partir des 3 derniers chiffres
    const s1 = parseInt(cp1.slice(2), 10);
    const s2 = parseInt(cp2.slice(2), 10);
    return Math.abs(s1 - s2) * 0.02;
  }

  // Départements différents en IDF
  return Math.abs(d1 - d2) * 5 + Math.random() * 3;
}

function extractTagsFromObjectifs(objectifs: Objectif[]): string[] {
  const mapping: Record<Objectif, string[]> = {
    perte_poids: ['perte_poids', 'cardio', 'nutrition'],
    prise_masse: ['prise_masse', 'musculation', 'nutrition'],
    post_blessure: ['reeducation', 'mobilite', 'renforcement'],
    preparation_competition: ['competition', 'performance', 'intensif'],
    bien_etre: ['bien_etre', 'souplesse', 'relaxation'],
    autre: [],
  };
  return objectifs.flatMap((o) => mapping[o]);
}

function computeNiveauCoherence(sportifNiveau: Niveau, proNiveaux: Niveau[]): number {
  if (proNiveaux.includes(sportifNiveau)) return 5;

  const niveauIndex: Record<Niveau, number> = {
    debutant: 0,
    intermediaire: 1,
    avance: 2,
  };

  const sportifIdx = niveauIndex[sportifNiveau];
  const minDistance = Math.min(
    ...proNiveaux.map((n) => Math.abs(niveauIndex[n] - sportifIdx)),
  );

  return minDistance === 1 ? 3 : 0;
}
