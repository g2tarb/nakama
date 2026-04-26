import type { Metadata } from 'next';

import { ProLayoutShell } from './_layout-shell';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return <ProLayoutShell>{children}</ProLayoutShell>;
}
