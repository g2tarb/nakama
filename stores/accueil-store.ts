import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AccueilTab = 'suggestions' | 'proximite';

interface AccueilStore {
  tab: AccueilTab;
  setTab: (tab: AccueilTab) => void;
}

export const useAccueilStore = create<AccueilStore>()(
  persist(
    (set) => ({
      tab: 'suggestions',
      setTab: (tab) => set({ tab }),
    }),
    { name: 'nakama-accueil' },
  ),
);
