import type { Pro } from '@/types';
import { prosCoachs } from './coachs';
import { prosPrepPhysique } from './prep-physique';
import { prosPrepMental } from './prep-mental';
import { prosNutritionnistes } from './nutritionnistes';
import { prosEducateurs } from './educateurs';

// Concatène toutes les spécialités puis trie par id pour restituer l'ordre d'origine (pro-001 → pro-050).
export const pros: Pro[] = [
  ...prosCoachs,
  ...prosPrepPhysique,
  ...prosPrepMental,
  ...prosNutritionnistes,
  ...prosEducateurs,
].sort((a, b) => a.id.localeCompare(b.id));

export {
  prosCoachs,
  prosPrepPhysique,
  prosPrepMental,
  prosNutritionnistes,
  prosEducateurs,
};
