import 'server-only';

import type { ProProfile } from '@/lib/db/schema';
import type { Pro, Specialite, Sport, Format, Formule, Niveau } from '@/types';

/**
 * Convertit un row DB `pro_profiles` vers le type UI `Pro` utilisé par les
 * composants existants (ProCard, FicheProPage…).
 *
 * Les champs imbriqués (cartesServices, avis) ne sont pas fetchés ici — pour
 * la recherche on ne les affiche pas. Les pages qui en ont besoin (fiche pro)
 * font un fetch séparé via `getProWithCartes`.
 */
export function dbProToUiPro(row: ProProfile): Pro {
  return {
    id: row.id,
    prenom: row.prenom,
    nom: row.nom,
    photo:
      row.photoUrl ??
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop&q=80',
    specialite: row.specialite as Specialite,
    sports: (row.sports ?? []) as Sport[],
    bio: row.bio ?? '',
    anneesExperience: row.anneesExperience ?? 0,
    formations: row.formations ?? [],
    ville: row.ville ?? '',
    codePostal: row.codePostal ?? '',
    rayonKm: row.rayonKm ?? 10,
    formats: (row.formats ?? []) as Format[],
    formule: (row.formule ?? 'standard') as Formule,
    note: row.note ?? 0,
    nbAvis: row.nbAvis ?? 0,
    avis: [],
    cartesServices: [],
    niveauEnseigne: (row.niveauEnseigne ?? []) as Niveau[],
    tarifMin: row.tarifMin ?? 0,
    tarifMax: row.tarifMax ?? 0,
    vibe: {
      pedagogieDiscipline: row.vibePedagogie ?? 5,
      suiviAutonomie: row.vibeSuivi ?? 5,
      dataRessenti: row.vibeData ?? 5,
    },
  };
}
