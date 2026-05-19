import type { Sport, Specialite, Formule, StatutSeance } from '@/types';

export const SPORTS_DISPONIBLES: { value: Sport; label: string }[] = [
  { value: 'fitness', label: 'Fitness' },
  { value: 'running', label: 'Running' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'musculation', label: 'Musculation' },
  { value: 'crossfit', label: 'CrossFit' },
  { value: 'natation', label: 'Natation' },
  { value: 'boxe', label: 'Boxe' },
  { value: 'football', label: 'Football' },
  { value: 'tennis', label: 'Tennis' },
  { value: 'autre', label: 'Autre' },
];

export const SPECIALITES: { value: Specialite; label: string }[] = [
  { value: 'coach_sportif', label: 'Coach sportif' },
  { value: 'preparateur_physique', label: 'Préparateur physique' },
  { value: 'preparateur_mental', label: 'Préparateur mental' },
  { value: 'nutritionniste', label: 'Nutritionniste' },
  { value: 'educateur_sportif', label: 'Éducateur sportif' },
];

export const FORMULES: {
  value: Formule;
  label: string;
  prix: number;
  features: string[];
}[] = [
  {
    value: 'standard',
    label: 'Standard',
    prix: 29,
    features: [
      '1 carte de service',
      'Profil visible',
      'Messagerie clients',
      'Agenda basique',
    ],
  },
  {
    value: 'premium',
    label: 'Premium',
    prix: 59,
    features: [
      '3 cartes de service',
      'Profil mis en avant',
      'Messagerie clients',
      'Agenda avancé',
      'Fiche Athlète Unifiée',
      'Statistiques revenus',
    ],
  },
  {
    value: 'elite',
    label: 'Élite',
    prix: 99,
    features: [
      'Cartes de service illimitées',
      'Profil prioritaire',
      'Messagerie clients',
      'Agenda avancé',
      'Fiche Athlète Unifiée',
      'Analytics complets',
      'Badge Élite visible',
      'Support prioritaire',
    ],
  },
];

export const OBJECTIFS = [
  { value: 'perte_poids', label: 'Perte de poids' },
  { value: 'prise_masse', label: 'Prise de masse' },
  { value: 'post_blessure', label: 'Post-blessure' },
  { value: 'preparation_competition', label: 'Préparation compétition' },
  { value: 'bien_etre', label: 'Bien-être' },
  { value: 'autre', label: 'Autre' },
] as const;

export const NIVEAUX = [
  { value: 'debutant', label: 'Débutant' },
  { value: 'intermediaire', label: 'Intermédiaire' },
  { value: 'avance', label: 'Avancé' },
] as const;

export const FREQUENCES = [
  { value: '1x', label: '1 fois / semaine' },
  { value: '2-3x', label: '2-3 fois / semaine' },
  { value: '4+', label: '4+ fois / semaine' },
] as const;

export const MAX_SCORE = 100;

export const RESSENTI_EMOJIS: Record<1 | 2 | 3 | 4, string> = {
  1: '😫',
  2: '😐',
  3: '😊',
  4: '🔥',
};

export const STATUT_BADGE: Record<StatutSeance, { label: string; className: string }> = {
  confirmee: { label: 'Confirmé', className: 'bg-accent-gold/15 text-accent-gold' },
  en_attente: { label: 'En attente', className: 'bg-warning/15 text-warning' },
  annulee: { label: 'Annulé', className: 'bg-muted text-text-tertiary' },
  terminee: { label: 'Terminé', className: 'bg-success/15 text-success' },
};

export function getStatutBadgeProps(statut: StatutSeance): {
  label: string;
  className: string;
} {
  return STATUT_BADGE[statut];
}
