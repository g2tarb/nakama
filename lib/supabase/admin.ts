import { createClient } from '@supabase/supabase-js';

import { clientConfig, serverConfig } from '@/lib/env';
import type { Database } from './database.types';

/**
 * Client Supabase avec service_role — bypass RLS.
 * À n'utiliser QUE côté serveur (seed scripts, cron, opérations admin).
 */
export function createSupabaseAdminClient() {
  const { SUPABASE_SERVICE_ROLE_KEY } = serverConfig();
  return createClient<Database>(
    clientConfig().NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
