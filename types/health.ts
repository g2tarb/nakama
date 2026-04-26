export type NiveauAlerte = 'rouge' | 'jaune' | 'vert';

export interface HealthNote {
  id: string;
  niveau: NiveauAlerte;
  titre: string;
  description: string;
  dateAjout: string;
}

export interface ProgressionPoint {
  date: string;
  valeur: number;
  metrique: 'poids' | 'charge_max' | 'perf_km';
}

export interface NoteCoach {
  id: string;
  date: string;
  contenu: string;
  prive: boolean;
}
