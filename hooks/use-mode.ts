'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { type Mode, useModeStore } from '@/stores/mode-store';

const MODE_ROUTES: Record<Mode, string> = {
  public: '/',
  sportif: '/accueil',
  pro: '/dashboard',
};

export function useMode() {
  const { mode, setMode } = useModeStore();
  const router = useRouter();

  const switchMode = useCallback(
    (newMode: Mode) => {
      setMode(newMode);
      router.push(MODE_ROUTES[newMode]);
    },
    [setMode, router],
  );

  return { mode, switchMode };
}
