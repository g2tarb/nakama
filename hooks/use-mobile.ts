'use client';

import { useEffect, useState } from 'react';

/**
 * Retourne `null` tant que la détection client n'a pas eu lieu (SSR + premier render),
 * puis `true`/`false`. Permet aux consommateurs de distinguer "pas encore connu"
 * de "détecté comme desktop", et donc de différer la décision au mount.
 */
export function useMobile(breakpoint = 768): boolean | null {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [breakpoint]);

  return isMobile;
}
