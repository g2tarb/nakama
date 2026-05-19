import { describe, it, expect } from 'vitest';

import { computeMatchScore, rankPros } from '@/lib/matching';
import type { Pro, Sportif } from '@/types';

// Fixtures deterministes : code postal identique pour eviter Math.random
// dans le calcul de distance (meme departement = pas de random).

function makeSportif(overrides: Partial<Sportif> = {}): Sportif {
  return {
    id: 'sportif-test',
    prenom: 'Test',
    nom: 'User',
    age: 30,
    genre: 'homme',
    photo: '',
    niveau: 'intermediaire',
    objectifs: ['perte_poids', 'bien_etre'],
    sports: ['fitness', 'musculation'],
    frequence: '2-3x',
    ville: 'Paris 11e',
    codePostal: '75011',
    rayonKm: 10,
    budgetMin: 30,
    budgetMax: 80,
    vibe: {
      pedagogieDiscipline: 5,
      suiviAutonomie: 5,
      dataRessenti: 5,
    },
    ...overrides,
  };
}

function makePro(overrides: Partial<Pro> = {}): Pro {
  return {
    id: 'pro-test',
    prenom: 'Pro',
    nom: 'Test',
    photo: '',
    specialite: 'coach_sportif',
    sports: ['fitness', 'musculation'],
    bio: '',
    anneesExperience: 5,
    formations: [],
    ville: 'Paris 11e',
    codePostal: '75011',
    rayonKm: 10,
    formats: ['presentiel'],
    formule: 'premium',
    note: 4.5,
    nbAvis: 10,
    avis: [],
    cartesServices: [
      {
        id: 'cs-test',
        nom: 'Service test',
        sport: 'fitness',
        description: '',
        tarifHeure: 60,
        dureeMinutes: 60,
        tags: ['perte_poids', 'cardio', 'nutrition', 'bien_etre', 'souplesse'],
        format: 'presentiel',
        actif: true,
        nbReservations: 0,
        caGenere: 0,
      },
    ],
    niveauEnseigne: ['intermediaire'],
    tarifMin: 60,
    tarifMax: 80,
    vibe: {
      pedagogieDiscipline: 5,
      suiviAutonomie: 5,
      dataRessenti: 5,
    },
    ...overrides,
  };
}

describe('computeMatchScore', () => {
  it('retourne un score eleve sur match parfait (sport + budget + distance 0 + tags + niveau + vibe identiques)', () => {
    const result = computeMatchScore(makeSportif(), makePro());
    // Logistique max = 45 (sport 20 + budget 15 + distance 10)
    // Performance max = 20 (5 tags * 3 = 15 cap + niveau 5)
    // Psychologie max = 35 (15 + 10 + 10)
    expect(result.scoreTotal).toBeGreaterThanOrEqual(95);
    expect(result.scoreTotal).toBeLessThanOrEqual(100);
  });

  it('retourne un score eleve (>=80) sur bon match avec vibe legerement decalee', () => {
    const result = computeMatchScore(
      makeSportif({
        vibe: { pedagogieDiscipline: 5, suiviAutonomie: 5, dataRessenti: 5 },
      }),
      makePro({ vibe: { pedagogieDiscipline: 7, suiviAutonomie: 7, dataRessenti: 7 } }),
    );
    expect(result.scoreTotal).toBeGreaterThanOrEqual(80);
  });

  it('penalise fortement sur mismatch sport (aucun sport commun)', () => {
    const result = computeMatchScore(
      makeSportif({ sports: ['yoga'] }),
      makePro({ sports: ['boxe'] }),
    );
    expect(result.details.sportCompatible).toBe(0);
    // sport mismatch coute 20 pts sur logistique → max 80 si tout le reste matche
    expect(result.scoreTotal).toBeLessThanOrEqual(80);
  });

  it('gere un sportif sans objectifs sans crash (tagsCommuns = 0)', () => {
    const result = computeMatchScore(makeSportif({ objectifs: [] }), makePro());
    expect(result.details.tagsCommuns).toBe(0);
    expect(Number.isFinite(result.scoreTotal)).toBe(true);
  });

  it('gere un pro sans cartesServices sans crash', () => {
    const result = computeMatchScore(makeSportif(), makePro({ cartesServices: [] }));
    expect(result.details.tagsCommuns).toBe(0);
    expect(Number.isFinite(result.scoreTotal)).toBe(true);
  });

  it('breakdown logistique + performance + psychologie = scoreTotal (sans depassement plafond)', () => {
    const result = computeMatchScore(makeSportif(), makePro());
    const sum = result.logistique + result.performance + result.psychologie;
    // scoreTotal peut etre clamp a 100 si la somme depasse
    expect(result.scoreTotal).toBe(Math.min(100, sum));
  });

  it('budget hors range (pro tarif > budgetMax) reduit le score budget', () => {
    const lowBudget = makeSportif({ budgetMax: 40 });
    const expensivePro = makePro({ tarifMin: 80 }); // ecart = 100%
    const result = computeMatchScore(lowBudget, expensivePro);
    expect(result.details.budgetCompatible).toBeLessThan(15);
  });

  it('budget largement hors range donne 0 sur budgetCompatible', () => {
    const lowBudget = makeSportif({ budgetMax: 20 });
    const expensivePro = makePro({ tarifMin: 200 }); // ecart = 900%
    const result = computeMatchScore(lowBudget, expensivePro);
    expect(result.details.budgetCompatible).toBe(0);
  });

  it('distance penalise quand cp differents (departement different = +5km par cran)', () => {
    // Meme dep CP=75011 vs 75011 = distance 0km = 10pts
    const samedep = computeMatchScore(
      makeSportif({ codePostal: '75011' }),
      makePro({ codePostal: '75011' }),
    );
    expect(samedep.details.distance).toBe(10);

    // CP eloignes : pour eviter Math.random, on prend cas extreme
    // 75xxx vs 13xxx => 62*5 = 310km => distance = 0
    const farAway = computeMatchScore(
      makeSportif({ codePostal: '75011' }),
      makePro({ codePostal: '13001' }),
    );
    expect(farAway.details.distance).toBe(0);
  });

  it('coherence niveau : meme niveau = 5pts, niveau voisin = 3pts, eloigne = 0', () => {
    const same = computeMatchScore(
      makeSportif({ niveau: 'intermediaire' }),
      makePro({ niveauEnseigne: ['intermediaire'] }),
    );
    expect(same.details.niveauCoherence).toBe(5);

    const voisin = computeMatchScore(
      makeSportif({ niveau: 'debutant' }),
      makePro({ niveauEnseigne: ['intermediaire'] }),
    );
    expect(voisin.details.niveauCoherence).toBe(3);

    const eloigne = computeMatchScore(
      makeSportif({ niveau: 'debutant' }),
      makePro({ niveauEnseigne: ['avance'] }),
    );
    expect(eloigne.details.niveauCoherence).toBe(0);
  });

  it('vibe : ecart vibe genere une penalite proportionnelle (0 si max gap)', () => {
    const totalGap = computeMatchScore(
      makeSportif({
        vibe: { pedagogieDiscipline: 1, suiviAutonomie: 1, dataRessenti: 1 },
      }),
      makePro({
        vibe: { pedagogieDiscipline: 10, suiviAutonomie: 10, dataRessenti: 10 },
      }),
    );
    expect(totalGap.details.pedagogieDiscipline).toBe(6); // 15 - 9 = 6
    expect(totalGap.details.suiviAutonomie).toBe(1); // 10 - 9 = 1
    expect(totalGap.details.dataRessenti).toBe(1); // 10 - 9 = 1
  });

  it('tags communs plafonnes a 15 (max performance contribution from tags)', () => {
    const sportifMaxTags = makeSportif({
      objectifs: [
        'perte_poids',
        'prise_masse',
        'post_blessure',
        'preparation_competition',
        'bien_etre',
      ],
    });
    const proManyTags = makePro({
      cartesServices: [
        {
          ...makePro().cartesServices[0]!,
          tags: [
            'perte_poids',
            'cardio',
            'nutrition',
            'prise_masse',
            'musculation',
            'reeducation',
            'mobilite',
            'renforcement',
            'competition',
            'performance',
            'intensif',
            'bien_etre',
            'souplesse',
            'relaxation',
          ],
        },
      ],
    });
    const result = computeMatchScore(sportifMaxTags, proManyTags);
    expect(result.details.tagsCommuns).toBe(15);
  });
});

describe('rankPros', () => {
  it('retourne les pros tries par scoreTotal decroissant', () => {
    const sportif = makeSportif();
    const proBon = makePro({ id: 'pro-bon' });
    const proMoyen = makePro({
      id: 'pro-moyen',
      sports: ['yoga'], // perd 20 pts (sport mismatch)
    });
    const proMauvais = makePro({
      id: 'pro-mauvais',
      sports: ['boxe'], // sport mismatch
      vibe: { pedagogieDiscipline: 10, suiviAutonomie: 10, dataRessenti: 10 }, // gros gap
    });
    const ranking = rankPros(sportif, [proMoyen, proMauvais, proBon]);
    expect(ranking.map((r) => r.proId)).toEqual(['pro-bon', 'pro-moyen', 'pro-mauvais']);
  });

  it('retourne un array vide si aucun pro fourni', () => {
    const ranking = rankPros(makeSportif(), []);
    expect(ranking).toEqual([]);
  });
});
