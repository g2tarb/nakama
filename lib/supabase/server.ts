import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

import { clientConfig } from '@/lib/env';
import type { Database } from './database.types';

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    clientConfig().NEXT_PUBLIC_SUPABASE_URL,
    clientConfig().NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Component — `set` est interdit hors action/route handler.
            // Ignoré : la session sera rafraîchie via le middleware.
          }
        },
      },
    },
  );
}
