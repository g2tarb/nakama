import type { Metadata } from 'next';

import { SportifLayoutShell } from './_layout-shell';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SportifLayout({ children }: { children: React.ReactNode }) {
  return <SportifLayoutShell>{children}</SportifLayoutShell>;
}
