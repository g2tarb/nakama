export interface MatchScore {
  proId: string;
  scoreTotal: number;
  logistique: number;
  performance: number;
  psychologie: number;
  details: {
    sportCompatible: number;
    budgetCompatible: number;
    distance: number;
    tagsCommuns: number;
    niveauCoherence: number;
    pedagogieDiscipline: number;
    suiviAutonomie: number;
    dataRessenti: number;
  };
}
