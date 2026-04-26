import type { HealthNote, NoteCoach, ProgressionPoint } from '@/types';

export const healthNotes: Record<string, HealthNote[]> = {
  'sportif-001': [
    {
      id: 'hn-001',
      niveau: 'rouge',
      titre: 'Ancienne entorse genou gauche (2023)',
      description:
        "Éviter les sauts et les réceptions unilatérales. Reprendre progressivement les exercices d'impact.",
      dateAjout: '2026-03-01',
    },
    {
      id: 'hn-002',
      niveau: 'jaune',
      titre: 'Tendinite épaule droite légère',
      description:
        'Surveiller les mouvements au-dessus de la tête. Échauffement coiffe des rotateurs obligatoire.',
      dateAjout: '2026-03-15',
    },
    {
      id: 'hn-003',
      niveau: 'vert',
      titre: 'Aucune allergie connue',
      description: 'RAS côté allergies et traitements médicamenteux.',
      dateAjout: '2026-02-15',
    },
  ],
  'sportif-002': [
    {
      id: 'hn-004',
      niveau: 'jaune',
      titre: 'Asthme léger',
      description:
        'Prévoir des pauses respiration lors des exercices cardio intenses. Ventoline à disposition.',
      dateAjout: '2026-03-05',
    },
    {
      id: 'hn-005',
      niveau: 'vert',
      titre: 'Post-partum (18 mois)',
      description:
        'Attention au périnée sur les exercices à impact. Privilégier le travail de gainage profond.',
      dateAjout: '2026-03-01',
    },
  ],
};

export const progressionData: Record<string, ProgressionPoint[]> = {
  'sportif-001': [
    { date: '2026-02-15', valeur: 83, metrique: 'poids' },
    { date: '2026-02-28', valeur: 82.2, metrique: 'poids' },
    { date: '2026-03-10', valeur: 81.5, metrique: 'poids' },
    { date: '2026-03-22', valeur: 80.8, metrique: 'poids' },
    { date: '2026-04-05', valeur: 80.1, metrique: 'poids' },
    { date: '2026-04-15', valeur: 79.4, metrique: 'poids' },
    { date: '2026-02-15', valeur: 60, metrique: 'charge_max' },
    { date: '2026-02-28', valeur: 65, metrique: 'charge_max' },
    { date: '2026-03-10', valeur: 70, metrique: 'charge_max' },
    { date: '2026-03-22', valeur: 72.5, metrique: 'charge_max' },
    { date: '2026-04-05', valeur: 75, metrique: 'charge_max' },
    { date: '2026-04-15', valeur: 80, metrique: 'charge_max' },
  ],
};

export const coachNotes: Record<string, NoteCoach[]> = {
  'sportif-001': [
    {
      id: 'cn-001',
      date: '2026-04-15T10:30:00',
      contenu:
        'Thomas est très motivé depuis la reprise. Bonne progression sur le squat, passer de 60 à 80 kg en 2 mois. Attention au genou gauche sur les descentes profondes.',
      prive: true,
    },
    {
      id: 'cn-002',
      date: '2026-04-08T14:00:00',
      contenu:
        "Séance difficile aujourd'hui, Thomas semblait fatigué. A mentionné des nuits courtes cette semaine. Adapter l'intensité la semaine prochaine.",
      prive: true,
    },
    {
      id: 'cn-003',
      date: '2026-03-25T11:00:00',
      contenu:
        'Première séance après 2 semaines de pause. Le cardio a régressé mais la force est stable. Reprendre progressivement le HIIT.',
      prive: true,
    },
    {
      id: 'cn-004',
      date: '2026-03-10T09:30:00',
      contenu:
        'Objectif perte de poids en bonne voie : -2.5 kg depuis le début. Thomas suit le plan nutritionnel. Augmenter les charges la semaine prochaine.',
      prive: true,
    },
  ],
};
