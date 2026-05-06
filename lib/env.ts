import { z } from 'zod';

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  DATABASE_URL: z.string().url(),
  DATABASE_URL_DIRECT: z.string().url().optional(),
  MAPBOX_ACCESS_TOKEN: z.string().min(1),
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET_NAME: z.string().min(1).default('nakama-photos'),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().min(1),
  CRON_SECRET: z.string().min(1),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_R2_PUBLIC_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

type ClientEnv = z.infer<typeof clientSchema>;
type ServerEnv = z.infer<typeof serverSchema>;

let cachedClient: ClientEnv | null = null;
let cachedServer: ServerEnv | null = null;

/**
 * Variables publiques côté browser et server. Lazy : ne crash qu'à la première
 * lecture. Permet à l'app de démarrer sans .env.local (les pages qui ne les
 * utilisent pas continuent de fonctionner).
 */
export function clientConfig(): ClientEnv {
  if (cachedClient) return cachedClient;
  cachedClient = clientSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_R2_PUBLIC_URL: process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });
  return cachedClient;
}

/** Variables sensibles, server-only. */
export function serverConfig(): ServerEnv {
  if (cachedServer) return cachedServer;
  if (typeof window !== 'undefined') {
    throw new Error('serverConfig() ne doit pas être appelé côté client.');
  }
  cachedServer = serverSchema.parse(process.env);
  return cachedServer;
}
