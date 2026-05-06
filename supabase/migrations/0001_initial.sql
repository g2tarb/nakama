-- ============================================================================
-- NAKAMA — Migration 0001 · Initial schema
-- ============================================================================
-- Tables, enums, index. Pas de RLS ici (voir 0002_rls.sql).
-- À exécuter dans : Supabase Dashboard > SQL Editor > New query
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enums
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('sportif', 'pro');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE niveau AS ENUM ('debutant','intermediaire','avance');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE genre AS ENUM ('homme','femme','autre');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE specialite AS ENUM (
    'coach_sportif','preparateur_physique','preparateur_mental',
    'nutritionniste','educateur_sportif'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE formule AS ENUM ('standard','premium','elite');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE format AS ENUM ('presentiel','distanciel','hybride');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE statut_seance AS ENUM ('en_attente','confirmee','annulee','terminee');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE niveau_alerte AS ENUM ('rouge','jaune','vert');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================================
-- user_roles : sportif | pro
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- sportif_profiles
-- ============================================================================
CREATE TABLE IF NOT EXISTS sportif_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,
  age INTEGER,
  genre genre,
  photo_url TEXT,
  niveau niveau,
  objectifs TEXT[] NOT NULL DEFAULT '{}',
  sports TEXT[] NOT NULL DEFAULT '{}',
  contraintes TEXT,
  frequence TEXT,
  ville TEXT,
  code_postal TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  rayon_km INTEGER DEFAULT 10,
  budget_min INTEGER,
  budget_max INTEGER,
  vibe_pedagogie SMALLINT,
  vibe_suivi SMALLINT,
  vibe_data SMALLINT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sportif_codepostal ON sportif_profiles(code_postal);
CREATE INDEX IF NOT EXISTS idx_sportif_geo ON sportif_profiles(lat, lng);

-- ============================================================================
-- pro_profiles
-- ============================================================================
CREATE TABLE IF NOT EXISTS pro_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,
  photo_url TEXT,
  specialite specialite NOT NULL,
  sports TEXT[] NOT NULL DEFAULT '{}',
  formats TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT,
  formations TEXT[] NOT NULL DEFAULT '{}',
  annees_experience INTEGER NOT NULL DEFAULT 0,
  ville TEXT,
  code_postal TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  rayon_km INTEGER DEFAULT 15,
  niveau_enseigne TEXT[] NOT NULL DEFAULT '{}',
  formule formule NOT NULL DEFAULT 'standard',
  tarif_min INTEGER,
  tarif_max INTEGER,
  vibe_pedagogie SMALLINT,
  vibe_suivi SMALLINT,
  vibe_data SMALLINT,
  note DOUBLE PRECISION NOT NULL DEFAULT 0,
  nb_avis INTEGER NOT NULL DEFAULT 0,
  actif BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pro_specialite ON pro_profiles(specialite);
CREATE INDEX IF NOT EXISTS idx_pro_geo ON pro_profiles(lat, lng);
CREATE INDEX IF NOT EXISTS idx_pro_actif ON pro_profiles(actif);

-- ============================================================================
-- cartes_services
-- ============================================================================
CREATE TABLE IF NOT EXISTS cartes_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id UUID NOT NULL REFERENCES pro_profiles(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  sport TEXT NOT NULL,
  description TEXT,
  tarif_heure INTEGER NOT NULL,
  duree_minutes INTEGER NOT NULL,
  format format NOT NULL DEFAULT 'presentiel',
  tags TEXT[] NOT NULL DEFAULT '{}',
  actif BOOLEAN NOT NULL DEFAULT true,
  nb_reservations INTEGER NOT NULL DEFAULT 0,
  ca_genere INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_carte_pro ON cartes_services(pro_id);

-- ============================================================================
-- seances
-- ============================================================================
CREATE TABLE IF NOT EXISTS seances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id UUID NOT NULL REFERENCES pro_profiles(id),
  sportif_id UUID NOT NULL REFERENCES sportif_profiles(id),
  carte_service_id UUID REFERENCES cartes_services(id),
  date_debut TIMESTAMPTZ NOT NULL,
  duree_minutes INTEGER NOT NULL,
  lieu TEXT,
  tarif INTEGER NOT NULL,
  statut statut_seance NOT NULL DEFAULT 'en_attente',
  ressenti_client SMALLINT,
  charge_percue SMALLINT,
  compte_rendu_coach TEXT,
  rappel_envoye BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_seance_pro_date ON seances(pro_id, date_debut);
CREATE INDEX IF NOT EXISTS idx_seance_sportif_date ON seances(sportif_id, date_debut);
CREATE INDEX IF NOT EXISTS idx_seance_statut ON seances(statut);

-- ============================================================================
-- conversations
-- ============================================================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id UUID NOT NULL REFERENCES pro_profiles(id) ON DELETE CASCADE,
  sportif_id UUID NOT NULL REFERENCES sportif_profiles(id) ON DELETE CASCADE,
  dernier_message TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uniq_conv_pair UNIQUE (pro_id, sportif_id)
);
CREATE INDEX IF NOT EXISTS idx_conv_pro ON conversations(pro_id);
CREATE INDEX IF NOT EXISTS idx_conv_sportif ON conversations(sportif_id);

-- ============================================================================
-- messages
-- ============================================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  author_id UUID NOT NULL,
  contenu TEXT NOT NULL,
  lu BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_msg_conversation_date ON messages(conversation_id, created_at);

-- ============================================================================
-- avis
-- ============================================================================
CREATE TABLE IF NOT EXISTS avis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id UUID NOT NULL REFERENCES pro_profiles(id) ON DELETE CASCADE,
  sportif_id UUID NOT NULL REFERENCES sportif_profiles(id) ON DELETE CASCADE,
  seance_id UUID NOT NULL REFERENCES seances(id) ON DELETE CASCADE,
  note SMALLINT NOT NULL CHECK (note BETWEEN 1 AND 5),
  commentaire TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uniq_avis_seance UNIQUE (seance_id)
);
CREATE INDEX IF NOT EXISTS idx_avis_pro ON avis(pro_id);

-- ============================================================================
-- health_notes (drapeaux santé sur le sportif)
-- ============================================================================
CREATE TABLE IF NOT EXISTS health_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sportif_id UUID NOT NULL REFERENCES sportif_profiles(id) ON DELETE CASCADE,
  niveau niveau_alerte NOT NULL,
  titre TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_health_sportif ON health_notes(sportif_id);

-- ============================================================================
-- coach_notes (notes privées du pro sur l'athlète)
-- ============================================================================
CREATE TABLE IF NOT EXISTS coach_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_id UUID NOT NULL REFERENCES pro_profiles(id) ON DELETE CASCADE,
  sportif_id UUID NOT NULL REFERENCES sportif_profiles(id) ON DELETE CASCADE,
  contenu TEXT NOT NULL,
  prive BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_coach_notes_pro_sportif ON coach_notes(pro_id, sportif_id);

-- ============================================================================
-- Triggers updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sportif_updated ON sportif_profiles;
CREATE TRIGGER trg_sportif_updated
  BEFORE UPDATE ON sportif_profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_pro_updated ON pro_profiles;
CREATE TRIGGER trg_pro_updated
  BEFORE UPDATE ON pro_profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- Trigger : recalcul note + nb_avis du pro à chaque INSERT/DELETE avis
-- ============================================================================
CREATE OR REPLACE FUNCTION recalc_pro_note()
RETURNS TRIGGER AS $$
DECLARE
  target_pro UUID;
BEGIN
  target_pro := COALESCE(NEW.pro_id, OLD.pro_id);
  UPDATE pro_profiles
    SET note = COALESCE((SELECT AVG(note)::DOUBLE PRECISION FROM avis WHERE pro_id = target_pro), 0),
        nb_avis = (SELECT COUNT(*) FROM avis WHERE pro_id = target_pro)
    WHERE id = target_pro;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_avis_recalc ON avis;
CREATE TRIGGER trg_avis_recalc
  AFTER INSERT OR DELETE ON avis
  FOR EACH ROW EXECUTE FUNCTION recalc_pro_note();
