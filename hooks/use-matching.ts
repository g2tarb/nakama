'use client';

import { useMemo } from 'react';

import { rankPros } from '@/lib/matching';
import { pros } from '@/lib/mock-data';
import { useUserStore } from '@/stores/user-store';

export function useMatchedPros(limit?: number) {
  const sportif = useUserStore((s) => s.sportif);

  return useMemo(() => {
    if (!sportif) return [];
    const ranked = rankPros(sportif, pros);
    return limit ? ranked.slice(0, limit) : ranked;
  }, [sportif, limit]);
}
