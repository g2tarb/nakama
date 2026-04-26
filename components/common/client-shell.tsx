'use client';

import dynamic from 'next/dynamic';

const ModeSwitcher = dynamic(
  () => import('./mode-switcher').then((m) => m.ModeSwitcher),
  { ssr: false },
);

export function ClientShell() {
  return <ModeSwitcher />;
}
