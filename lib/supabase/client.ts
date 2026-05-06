'use client';

import { createBrowserClient } from '@supabase/ssr';

import { clientConfig } from '@/lib/env';
import type { Database } from './database.types';

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    clientConfig().NEXT_PUBLIC_SUPABASE_URL,
    clientConfig().NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
