import type { Sport } from './pro';

export type Niveau = 'debutant' | 'intermediaire' | 'avance';
export type Genre = 'homme' | 'femme' | 'autre';
export type Objectif =
  | 'perte_poids'
  | 'prise_masse'
  | 'post_blessure'
  | 'preparation_competition'
  | 'bien_etre'
  | 'autre';

export interface VibeProfile {
  /** 1=pédagogie/écoute, 10=discipline/dépassement */
  pedagogieDiscipline: number;
  /** 1=suivi quotidien/réactif, 10=autonomie */
  suiviAutonomie: number;
  /** 1=approche data/mesures, 10=approche ressenti */
  dataRessenti: number;
}

export interface Sportif {
  id: string;
  prenom: string;
  nom: string;
  age: number;
  genre: Genre;
  photo: string;
  niveau: Niveau;
  objectifs: Objectif[];
  sports: Sport[];
  contraintes?: string;
  frequence: '1x' | '2-3x' | '4+';
  ville: string;
  codePostal: string;
  rayonKm: number;
  budgetMin: number;
  budgetMax: number;
  vibe: VibeProfile;
  bio?: string;
  clientDepuis?: string;
}
