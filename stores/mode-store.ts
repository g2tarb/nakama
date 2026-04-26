import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Mode = 'public' | 'sportif' | 'pro';

interface ModeStore {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

export const useModeStore = create<ModeStore>()(
  persist(
    (set) => ({
      mode: 'public',
      setMode: (mode) => set({ mode }),
    }),
    { name: 'nakama-mode' },
  ),
);
