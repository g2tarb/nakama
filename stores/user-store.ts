import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Pro, Sportif } from '@/types';

interface UserStore {
  sportif: Sportif | null;
  pro: Pro | null;
  setSportif: (sportif: Sportif) => void;
  setPro: (pro: Pro) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      sportif: null,
      pro: null,
      setSportif: (sportif) => set({ sportif }),
      setPro: (pro) => set({ pro }),
      clearUser: () => set({ sportif: null, pro: null }),
    }),
    { name: 'nakama-user' },
  ),
);
