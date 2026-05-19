import type { Seance } from '@/types';

const manualSeances: Seance[] = [
  // ===== Séances futures =====
  {
    id: 'seance-001',
    proId: 'pro-001',
    sportifId: 'sportif-001',
    carteServiceId: 'cs-001',
    date: '2026-04-21T15:00:00',
    dureeMinutes: 60,
    lieu: 'Salle Fitness Park, Paris 11e',
    tarif: 50,
    statut: 'confirmee',
  },
  {
    id: 'seance-002',
    proId: 'pro-001',
    sportifId: 'sportif-001',
    carteServiceId: 'cs-001',
    date: '2026-04-24T10:00:00',
    dureeMinutes: 60,
    lieu: 'Salle Fitness Park, Paris 11e',
    tarif: 50,
    statut: 'confirmee',
  },
  {
    id: 'seance-003',
    proId: 'pro-003',
    sportifId: 'sportif-002',
    carteServiceId: 'cs-005',
    date: '2026-04-22T11:00:00',
    dureeMinutes: 60,
    lieu: 'Studio Zen, Paris 5e',
    tarif: 45,
    statut: 'en_attente',
  },
  {
    id: 'seance-028',
    proId: 'pro-005',
    sportifId: 'sportif-001',
    carteServiceId: 'cs-007',
    date: '2026-04-23T18:00:00',
    dureeMinutes: 60,
    lieu: 'Domicile, Paris 16e',
    tarif: 70,
    statut: 'confirmee',
  },
  {
    id: 'seance-029',
    proId: 'pro-002',
    sportifId: 'sportif-003',
    carteServiceId: 'cs-003',
    date: '2026-04-22T09:00:00',
    dureeMinutes: 90,
    lieu: 'CrossFit Boulogne',
    tarif: 75,
    statut: 'confirmee',
  },
  {
    id: 'seance-030',
    proId: 'pro-004',
    sportifId: 'sportif-007',
    carteServiceId: 'cs-006',
    date: '2026-04-25T17:00:00',
    dureeMinutes: 60,
    lieu: 'Boxing Club, Saint-Denis',
    tarif: 40,
    statut: 'confirmee',
  },
  {
    id: 'seance-031',
    proId: 'pro-003',
    sportifId: 'sportif-008',
    carteServiceId: 'cs-005',
    date: '2026-04-23T09:00:00',
    dureeMinutes: 60,
    lieu: 'Studio Zen, Paris 5e',
    tarif: 45,
    statut: 'confirmee',
  },
  {
    id: 'seance-032',
    proId: 'pro-005',
    sportifId: 'sportif-004',
    carteServiceId: 'cs-008',
    date: '2026-04-26T07:30:00',
    dureeMinutes: 75,
    lieu: 'Parc Boulogne',
    tarif: 65,
    statut: 'en_attente',
  },
  {
    id: 'seance-033',
    proId: 'pro-001',
    sportifId: 'sportif-010',
    carteServiceId: 'cs-001',
    date: '2026-04-28T14:00:00',
    dureeMinutes: 60,
    lieu: 'Salle Fitness Park, Paris 11e',
    tarif: 50,
    statut: 'confirmee',
  },
  {
    id: 'seance-034',
    proId: 'pro-002',
    sportifId: 'sportif-009',
    carteServiceId: 'cs-004',
    date: '2026-04-27T08:00:00',
    dureeMinutes: 75,
    lieu: 'Stade Charléty, Paris 13e',
    tarif: 65,
    statut: 'confirmee',
  },

  // ===== Séances passées (terminées) =====
  {
    id: 'seance-004',
    proId: 'pro-002',
    sportifId: 'sportif-001',
    carteServiceId: 'cs-003',
    date: '2026-04-15T09:00:00',
    dureeMinutes: 90,
    lieu: 'CrossFit Boulogne',
    tarif: 75,
    statut: 'terminee',
    ressentiClient: 4,
    chargePercue: 8,
    compteRenduCoach:
      "Très bonne séance. Thomas a tenu l'intensité malgré les WODs complexes. Progression notable sur les clean & jerk.",
  },
  {
    id: 'seance-005',
    proId: 'pro-001',
    sportifId: 'sportif-001',
    carteServiceId: 'cs-001',
    date: '2026-04-12T15:00:00',
    dureeMinutes: 60,
    lieu: 'Salle Fitness Park, Paris 11e',
    tarif: 50,
    statut: 'terminee',
    ressentiClient: 3,
    chargePercue: 6,
    compteRenduCoach:
      'Séance de remise en route. Bilan initial effectué. Thomas a une bonne base cardio mais doit travailler la mobilité.',
  },
  {
    id: 'seance-006',
    proId: 'pro-005',
    sportifId: 'sportif-001',
    carteServiceId: 'cs-007',
    date: '2026-04-10T18:00:00',
    dureeMinutes: 60,
    lieu: 'Domicile, Paris 16e',
    tarif: 70,
    statut: 'terminee',
    ressentiClient: 3,
    chargePercue: 5,
    compteRenduCoach:
      "Première séance d'évaluation. Bilan composition corporelle et définition des objectifs.",
  },
  {
    id: 'seance-008',
    proId: 'pro-003',
    sportifId: 'sportif-002',
    carteServiceId: 'cs-005',
    date: '2026-04-08T10:00:00',
    dureeMinutes: 60,
    lieu: 'Studio Zen, Paris 5e',
    tarif: 45,
    statut: 'terminee',
    ressentiClient: 4,
    chargePercue: 3,
    compteRenduCoach:
      "Chloé progresse bien en Vinyasa. La respiration s'améliore nettement. On passe au niveau 2 la semaine prochaine.",
  },
  {
    id: 'seance-009',
    proId: 'pro-001',
    sportifId: 'sportif-005',
    carteServiceId: 'cs-001',
    date: '2026-04-14T10:00:00',
    dureeMinutes: 60,
    lieu: 'Salle Fitness Park, Paris 11e',
    tarif: 50,
    statut: 'terminee',
    ressentiClient: 3,
    chargePercue: 4,
    compteRenduCoach:
      'Première séance avec Antoine. Bilan OK. Attention à la hernie L4-L5. Programme adapté validé.',
  },
  {
    id: 'seance-010',
    proId: 'pro-002',
    sportifId: 'sportif-003',
    carteServiceId: 'cs-003',
    date: '2026-04-08T09:00:00',
    dureeMinutes: 90,
    lieu: 'CrossFit Boulogne',
    tarif: 75,
    statut: 'terminee',
    ressentiClient: 4,
    chargePercue: 9,
    compteRenduCoach:
      'Mehdi pousse fort. PR sur le deadlift à 180 kg. Récupération à surveiller.',
  },
  {
    id: 'seance-011',
    proId: 'pro-004',
    sportifId: 'sportif-007',
    carteServiceId: 'cs-006',
    date: '2026-04-11T17:00:00',
    dureeMinutes: 60,
    lieu: 'Boxing Club, Saint-Denis',
    tarif: 40,
    statut: 'terminee',
    ressentiClient: 4,
    chargePercue: 7,
    compteRenduCoach:
      'Lucas est naturel. Bonne coordination. On continue la technique jab-cross cette semaine.',
  },
  {
    id: 'seance-012',
    proId: 'pro-005',
    sportifId: 'sportif-006',
    carteServiceId: 'cs-009',
    date: '2026-04-09T08:00:00',
    dureeMinutes: 75,
    lieu: 'Salle Olympe, Paris 16e',
    tarif: 70,
    statut: 'terminee',
    ressentiClient: 3,
    chargePercue: 7,
    compteRenduCoach:
      'Fatou a un bon potentiel. Squat à 90 kg validé. Ajuster la nutrition pré-compétition.',
  },
  {
    id: 'seance-013',
    proId: 'pro-001',
    sportifId: 'sportif-001',
    carteServiceId: 'cs-001',
    date: '2026-04-05T15:00:00',
    dureeMinutes: 60,
    lieu: 'Salle Fitness Park, Paris 11e',
    tarif: 50,
    statut: 'terminee',
    ressentiClient: 3,
    chargePercue: 6,
    compteRenduCoach: 'Circuit training bien supporté. Thomas gagne en endurance.',
  },
  {
    id: 'seance-014',
    proId: 'pro-003',
    sportifId: 'sportif-016',
    carteServiceId: 'cs-005',
    date: '2026-04-07T09:00:00',
    dureeMinutes: 60,
    lieu: 'Studio Zen, Paris 5e',
    tarif: 45,
    statut: 'terminee',
    ressentiClient: 4,
    chargePercue: 2,
    compteRenduCoach:
      'Camille est très réceptive. Excellente séance de Yin yoga. Souplesse en nette amélioration.',
  },
  {
    id: 'seance-015',
    proId: 'pro-002',
    sportifId: 'sportif-009',
    carteServiceId: 'cs-004',
    date: '2026-04-06T08:00:00',
    dureeMinutes: 75,
    lieu: 'Stade Charléty, Paris 13e',
    tarif: 65,
    statut: 'terminee',
    ressentiClient: 3,
    chargePercue: 7,
    compteRenduCoach:
      'Séance fractionné 8×400m. Karim tient le pace sub-3h. Travail en côte la semaine prochaine.',
  },
  {
    id: 'seance-016',
    proId: 'pro-005',
    sportifId: 'sportif-011',
    carteServiceId: 'cs-009',
    date: '2026-04-13T10:00:00',
    dureeMinutes: 75,
    lieu: 'Salle Olympe, Paris 16e',
    tarif: 70,
    statut: 'terminee',
    ressentiClient: 3,
    chargePercue: 6,
    compteRenduCoach:
      'Yann progresse bien sur le bench press. +5 kg cette semaine. Ajuster le volume sur les jambes.',
  },
  {
    id: 'seance-017',
    proId: 'pro-001',
    sportifId: 'sportif-018',
    carteServiceId: 'cs-001',
    date: '2026-04-14T16:00:00',
    dureeMinutes: 60,
    lieu: 'Salle Fitness Park, Paris 11e',
    tarif: 50,
    statut: 'terminee',
    ressentiClient: 3,
    chargePercue: 5,
    compteRenduCoach:
      'Première séance avec Julie. Très motivée. Plan progressif sur 3 mois mis en place.',
  },
  {
    id: 'seance-018',
    proId: 'pro-004',
    sportifId: 'sportif-020',
    carteServiceId: 'cs-006',
    date: '2026-04-16T18:00:00',
    dureeMinutes: 60,
    lieu: 'Boxing Club, Saint-Denis',
    tarif: 40,
    statut: 'terminee',
    ressentiClient: 4,
    chargePercue: 6,
    compteRenduCoach:
      'Nadia accroche bien ! Bon cardio, bonne coordination. Elle va progresser vite.',
  },
  {
    id: 'seance-019',
    proId: 'pro-005',
    sportifId: 'sportif-015',
    carteServiceId: 'cs-009',
    date: '2026-04-11T07:00:00',
    dureeMinutes: 75,
    lieu: 'Salle Olympe, Paris 16e',
    tarif: 70,
    statut: 'terminee',
    ressentiClient: 4,
    chargePercue: 9,
    compteRenduCoach:
      'Hugo est une machine. 5×5 squat à 140 kg. Programme force pure en cours.',
  },
  {
    id: 'seance-020',
    proId: 'pro-003',
    sportifId: 'sportif-002',
    carteServiceId: 'cs-005',
    date: '2026-04-01T10:00:00',
    dureeMinutes: 60,
    lieu: 'Studio Zen, Paris 5e',
    tarif: 45,
    statut: 'terminee',
    ressentiClient: 3,
    chargePercue: 3,
    compteRenduCoach:
      'Chloé découvre le Yin. Très bon relâchement. Séance idéale pour son profil.',
  },

  // ===== Séances passées (mars) =====
  {
    id: 'seance-021',
    proId: 'pro-001',
    sportifId: 'sportif-001',
    carteServiceId: 'cs-001',
    date: '2026-03-29T10:00:00',
    dureeMinutes: 60,
    lieu: 'Salle Fitness Park, Paris 11e',
    tarif: 50,
    statut: 'terminee',
    ressentiClient: 2,
    chargePercue: 7,
    compteRenduCoach:
      'Séance difficile. Thomas revient de vacances, perte de rythme. Reprendre doucement.',
  },
  {
    id: 'seance-022',
    proId: 'pro-002',
    sportifId: 'sportif-003',
    carteServiceId: 'cs-003',
    date: '2026-03-25T09:00:00',
    dureeMinutes: 90,
    lieu: 'CrossFit Boulogne',
    tarif: 75,
    statut: 'terminee',
    ressentiClient: 4,
    chargePercue: 8,
    compteRenduCoach: 'Benchmark Fran en 4:12. Record personnel pour Mehdi !',
  },
  {
    id: 'seance-023',
    proId: 'pro-005',
    sportifId: 'sportif-001',
    carteServiceId: 'cs-007',
    date: '2026-03-27T18:00:00',
    dureeMinutes: 60,
    lieu: 'Domicile, Paris 16e',
    tarif: 70,
    statut: 'terminee',
    ressentiClient: 3,
    chargePercue: 5,
    compteRenduCoach:
      'Suivi nutrition. Thomas tient le déficit calorique. -1.2 kg cette quinzaine.',
  },
  {
    id: 'seance-024',
    proId: 'pro-001',
    sportifId: 'sportif-001',
    carteServiceId: 'cs-001',
    date: '2026-03-22T15:00:00',
    dureeMinutes: 60,
    lieu: 'Salle Fitness Park, Paris 11e',
    tarif: 50,
    statut: 'terminee',
    ressentiClient: 3,
    chargePercue: 6,
    compteRenduCoach: 'Bonne séance. Focus mobilité épaule. Am��lioration notable.',
  },
  {
    id: 'seance-025',
    proId: 'pro-003',
    sportifId: 'sportif-008',
    carteServiceId: 'cs-005',
    date: '2026-03-20T09:00:00',
    dureeMinutes: 60,
    lieu: 'Studio Zen, Paris 5e',
    tarif: 45,
    statut: 'terminee',
    ressentiClient: 4,
    chargePercue: 2,
    compteRenduCoach:
      'Sophie est très appliquée. La cheville tient bien. On peut intensifier les postures debout.',
  },
  {
    id: 'seance-026',
    proId: 'pro-002',
    sportifId: 'sportif-015',
    carteServiceId: 'cs-003',
    date: '2026-03-18T08:00:00',
    dureeMinutes: 90,
    lieu: 'CrossFit Boulogne',
    tarif: 75,
    statut: 'terminee',
    ressentiClient: 4,
    chargePercue: 9,
    compteRenduCoach:
      'Hugo enchaîne les PRs. Muscle-up maîtrisé. Ajuster le volume pour éviter la blessure.',
  },

  // ===== Annulée =====
  {
    id: 'seance-007',
    proId: 'pro-001',
    sportifId: 'sportif-001',
    carteServiceId: 'cs-001',
    date: '2026-03-29T15:00:00',
    dureeMinutes: 60,
    lieu: 'Salle Fitness Park, Paris 11e',
    tarif: 50,
    statut: 'annulee',
  },
  {
    id: 'seance-027',
    proId: 'pro-005',
    sportifId: 'sportif-004',
    carteServiceId: 'cs-008',
    date: '2026-04-02T07:30:00',
    dureeMinutes: 75,
    lieu: 'Parc Boulogne',
    tarif: 65,
    statut: 'annulee',
  },
];

// Generateur programmatique pour pros[4] (Julie MARTIN, pro-005) : planning dense
// sur 4 semaines (S-1, S, S+1, S+2) autour de la date "aujourd'hui" du MVP.
// Deterministe : meme entree => meme sortie. Reproductible.

const PRO_VEDETTE_ID = 'pro-005';
const REF_TODAY = new Date(2026, 4, 19); // 19 mai 2026

const CS_CATALOG: Record<
  string,
  { sport: string; tarif: number; duree: number; lieu: string }
> = {
  'cs-007': {
    sport: 'fitness',
    tarif: 70,
    duree: 60,
    lieu: 'Salle Fitness Park, Paris 16e',
  },
  'cs-008': {
    sport: 'running',
    tarif: 65,
    duree: 75,
    lieu: 'Bois de Boulogne, Paris 16e',
  },
  'cs-009': {
    sport: 'musculation',
    tarif: 70,
    duree: 75,
    lieu: 'Studio Nakama, Paris 16e',
  },
  'cs-012': {
    sport: 'musculation',
    tarif: 60,
    duree: 75,
    lieu: 'Studio Nakama, Paris 16e',
  },
  'cs-013': {
    sport: 'crossfit',
    tarif: 55,
    duree: 60,
    lieu: 'CrossFit Box 16, Paris 16e',
  },
};
const CS_IDS = Object.keys(CS_CATALOG);

const SPORTIF_POOL = [
  'sportif-001',
  'sportif-002',
  'sportif-003',
  'sportif-004',
  'sportif-005',
  'sportif-006',
  'sportif-007',
  'sportif-008',
  'sportif-009',
  'sportif-010',
];

// Cathegories horaires (matin tot, matin, midi, apres-midi, soir)
const TIME_BUCKETS: string[][] = [
  ['06:30', '07:00', '07:30'],
  ['09:00', '10:00', '11:00'],
  ['12:00', '12:30', '13:00'],
  ['14:00', '15:00', '16:00'],
  ['18:00', '19:00', '19:30', '20:00', '20:30'],
];

function startOfWeekMonday(d: Date): Date {
  const out = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dow = out.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const delta = (dow + 6) % 7; // 0 si lundi, 6 si dimanche
  out.setDate(out.getDate() - delta);
  return out;
}

function isoLocal(date: Date, time: string): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}T${time}:00`;
}

function countForDay(dow: number, seed: number): number {
  // dow: 0=Sun..6=Sat
  if (dow === 0) return 1 + (seed % 2); // dimanche 1-2
  if (dow === 6) return 2 + (seed % 2); // samedi 2-3
  return 4 + (seed % 3); // lun-ven 4-6
}

function pickTimes(count: number, daySeed: number): string[] {
  // Distribue les seances dans des plages distinctes pour eviter les chevauchements
  const picks: string[] = [];
  const order = [0, 4, 1, 3, 2]; // matin tot, soir, matin, apres-midi, midi (priorite)
  for (let i = 0; i < count; i++) {
    const bucket = TIME_BUCKETS[order[i % order.length]!]!;
    const slot = bucket[(daySeed + i * 3) % bucket.length]!;
    picks.push(slot);
  }
  return picks.sort(); // tri pour rendu chrono
}

function generateProVedetteSeances(): Seance[] {
  const out: Seance[] = [];
  const monday = startOfWeekMonday(REF_TODAY);
  const startMonday = new Date(monday);
  startMonday.setDate(monday.getDate() - 7); // S-1

  let counter = 0;

  for (let week = 0; week < 4; week++) {
    for (let dow = 0; dow < 7; dow++) {
      const day = new Date(startMonday);
      day.setDate(startMonday.getDate() + week * 7 + dow);

      const realDow = day.getDay(); // 0=Sun..6=Sat
      const daySeed = week * 7 + dow + 17;
      const nb = countForDay(realDow, daySeed);
      const times = pickTimes(nb, daySeed);

      for (let i = 0; i < nb; i++) {
        const time = times[i]!;
        const cs = CS_IDS[(counter * 3) % CS_IDS.length]!;
        const csData = CS_CATALOG[cs]!;
        const sportifId = SPORTIF_POOL[(counter * 7) % SPORTIF_POOL.length]!;

        // Statut : passe = terminee (rare annulee), aujourd'hui = confirmee mostly,
        // futur = confirmee majoritairement, parfois en_attente, rare annulee
        const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
        const todayStart = new Date(
          REF_TODAY.getFullYear(),
          REF_TODAY.getMonth(),
          REF_TODAY.getDate(),
        );

        let statut: Seance['statut'];
        if (dayStart < todayStart) {
          statut = counter % 13 === 0 ? 'annulee' : 'terminee';
        } else if (dayStart.getTime() === todayStart.getTime()) {
          statut = counter % 9 === 0 ? 'en_attente' : 'confirmee';
        } else {
          statut =
            counter % 17 === 0
              ? 'annulee'
              : counter % 6 === 0
                ? 'en_attente'
                : 'confirmee';
        }

        out.push({
          id: `seance-gen-${String(counter).padStart(3, '0')}`,
          proId: PRO_VEDETTE_ID,
          sportifId,
          carteServiceId: cs,
          date: isoLocal(day, time),
          dureeMinutes: csData.duree,
          lieu: csData.lieu,
          tarif: csData.tarif,
          statut,
        });

        counter++;
      }
    }
  }

  return out;
}

export const seances: Seance[] = [...manualSeances, ...generateProVedetteSeances()];
