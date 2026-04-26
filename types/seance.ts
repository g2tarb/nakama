export type StatutSeance = 'confirmee' | 'en_attente' | 'annulee' | 'terminee';

export interface Seance {
  id: string;
  proId: string;
  sportifId: string;
  carteServiceId: string;
  date: string;
  dureeMinutes: number;
  lieu: string;
  tarif: number;
  statut: StatutSeance;
  ressentiClient?: 1 | 2 | 3 | 4;
  chargePercue?: number;
  compteRenduCoach?: string;
}
