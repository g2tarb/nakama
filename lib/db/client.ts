import 'server-only';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { serverConfig } from '@/lib/env';
import * as schema from './schema';

declare global {
  var __nakama_db__: ReturnType<typeof drizzle<typeof schema>> | undefined;

  var __nakama_pg__: ReturnType<typeof postgres> | undefined;
}

function getClient() {
  if (global.__nakama_db__) return global.__nakama_db__;
  const { DATABASE_URL } = serverConfig();
  const client = postgres(DATABASE_URL, {
    prepare: false, // Supabase pooler n'aime pas les prepared statements
    max: 10,
  });
  const db = drizzle(client, { schema });
  global.__nakama_pg__ = client;
  global.__nakama_db__ = db;
  return db;
}

export const db = new Proxy({} as ReturnType<typeof getClient>, {
  get(_target, prop) {
    const client = getClient();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop as string];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

export { schema };
