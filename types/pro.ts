import type { Niveau, VibeProfile } from './sportif';

export type Specialite =
  | 'coach_sportif'
  | 'preparateur_physique'
  | 'preparateur_mental'
  | 'nutritionniste'
  | 'educateur_sportif';

export type Sport =
  | 'fitness'
  | 'running'
  | 'yoga'
  | 'musculation'
  | 'crossfit'
  | 'natation'
  | 'boxe'
  | 'football'
  | 'tennis'
  | 'autre';

export type Format = 'presentiel' | 'distanciel' | 'hybride';
export type Formule = 'standard' | 'premium' | 'elite';

export interface CarteService {
  id: string;
  nom: string;
  sport: Sport;
  description: string;
  tarifHeure: number;
  dureeMinutes: number;
  tags: string[];
  format: Format;
  actif: boolean;
  nbReservations: number;
  caGenere: number;
}

export interface Avis {
  id: string;
  auteur: string;
  note: number;
  date: string;
  commentaire: string;
}

export interface Pro {
  id: string;
  prenom: string;
  nom: string;
  photo: string;
  specialite: Specialite;
  sports: Sport[];
  bio: string;
  anneesExperience: number;
  formations: string[];
  ville: string;
  codePostal: string;
  rayonKm: number;
  formats: Format[];
  formule: Formule;
  note: number;
  nbAvis: number;
  avis: Avis[];
  cartesServices: CarteService[];
  niveauEnseigne: Niveau[];
  tarifMin: number;
  tarifMax: number;
  vibe: VibeProfile;
  favorite?: boolean;
}
