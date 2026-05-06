/**
 * Stub des types Supabase Database.
 *
 * À régénérer après chaque migration via :
 *   pnpm supabase gen types typescript --project-id <ref> > lib/supabase/database.types.ts
 *
 * Pour l'instant on utilise un type permissif. Drizzle reste la source de vérité
 * côté DB (lib/db/schema.ts) ; ce fichier sert uniquement aux clients Supabase
 * (auth, realtime, storage).
 */
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
