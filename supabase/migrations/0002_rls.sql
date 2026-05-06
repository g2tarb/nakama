-- ============================================================================
-- NAKAMA — Migration 0002 · Row Level Security
-- ============================================================================
-- À exécuter APRÈS 0001_initial.sql.
--
-- Règles :
--  - sportif_profiles : chacun lit/écrit le sien. Lecture publique limitée.
--  - pro_profiles     : lecture publique (recherche), écriture = soi-même.
--  - cartes_services  : lecture publique des actives, écriture = pro proprio.
--  - seances          : lecture/écriture limitée aux 2 parties.
--  - conversations    : pareil — sportif + pro participants.
--  - messages         : pareil — via conversation.
--  - avis             : lecture publique, écriture = sportif auteur (sa séance terminée).
--  - health_notes     : sportif voit les siennes + pro voit celles de ses athlètes.
--  - coach_notes      : pro voit les siennes (privées). Sportif voit publiques (prive=false).
--  - user_roles       : lecture du sien uniquement.
-- ============================================================================

ALTER TABLE user_roles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE sportif_profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE pro_profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE cartes_services   ENABLE ROW LEVEL SECURITY;
ALTER TABLE seances           ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages          ENABLE ROW LEVEL SECURITY;
ALTER TABLE avis              ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_notes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_notes       ENABLE ROW LEVEL SECURITY;

-- =====================================
-- user_roles
-- =====================================
DROP POLICY IF EXISTS user_roles_self_select ON user_roles;
CREATE POLICY user_roles_self_select ON user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS user_roles_self_insert ON user_roles;
CREATE POLICY user_roles_self_insert ON user_roles
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- =====================================
-- sportif_profiles
-- =====================================
DROP POLICY IF EXISTS sportif_self_select ON sportif_profiles;
CREATE POLICY sportif_self_select ON sportif_profiles
  FOR SELECT TO authenticated USING (id = auth.uid());

DROP POLICY IF EXISTS sportif_self_insert ON sportif_profiles;
CREATE POLICY sportif_self_insert ON sportif_profiles
  FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS sportif_self_update ON sportif_profiles;
CREATE POLICY sportif_self_update ON sportif_profiles
  FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- Le pro qui a une séance avec ce sportif peut lire son profil (fiche athlète)
DROP POLICY IF EXISTS sportif_visible_to_coach ON sportif_profiles;
CREATE POLICY sportif_visible_to_coach ON sportif_profiles
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM seances s WHERE s.sportif_id = sportif_profiles.id AND s.pro_id = auth.uid())
  );

-- =====================================
-- pro_profiles : LECTURE PUBLIQUE (recherche)
-- =====================================
DROP POLICY IF EXISTS pro_public_select ON pro_profiles;
CREATE POLICY pro_public_select ON pro_profiles
  FOR SELECT TO anon, authenticated USING (actif = true);

DROP POLICY IF EXISTS pro_self_full_select ON pro_profiles;
CREATE POLICY pro_self_full_select ON pro_profiles
  FOR SELECT TO authenticated USING (id = auth.uid());

DROP POLICY IF EXISTS pro_self_insert ON pro_profiles;
CREATE POLICY pro_self_insert ON pro_profiles
  FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS pro_self_update ON pro_profiles;
CREATE POLICY pro_self_update ON pro_profiles
  FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- =====================================
-- cartes_services
-- =====================================
DROP POLICY IF EXISTS carte_public_select ON cartes_services;
CREATE POLICY carte_public_select ON cartes_services
  FOR SELECT TO anon, authenticated USING (actif = true);

DROP POLICY IF EXISTS carte_owner_all ON cartes_services;
CREATE POLICY carte_owner_all ON cartes_services
  FOR ALL TO authenticated USING (pro_id = auth.uid()) WITH CHECK (pro_id = auth.uid());

-- =====================================
-- seances
-- =====================================
DROP POLICY IF EXISTS seance_party_select ON seances;
CREATE POLICY seance_party_select ON seances
  FOR SELECT TO authenticated USING (pro_id = auth.uid() OR sportif_id = auth.uid());

DROP POLICY IF EXISTS seance_sportif_insert ON seances;
CREATE POLICY seance_sportif_insert ON seances
  FOR INSERT TO authenticated WITH CHECK (sportif_id = auth.uid());

DROP POLICY IF EXISTS seance_party_update ON seances;
CREATE POLICY seance_party_update ON seances
  FOR UPDATE TO authenticated
    USING (pro_id = auth.uid() OR sportif_id = auth.uid())
    WITH CHECK (pro_id = auth.uid() OR sportif_id = auth.uid());

-- =====================================
-- conversations
-- =====================================
DROP POLICY IF EXISTS conv_party_select ON conversations;
CREATE POLICY conv_party_select ON conversations
  FOR SELECT TO authenticated USING (pro_id = auth.uid() OR sportif_id = auth.uid());

DROP POLICY IF EXISTS conv_party_insert ON conversations;
CREATE POLICY conv_party_insert ON conversations
  FOR INSERT TO authenticated WITH CHECK (pro_id = auth.uid() OR sportif_id = auth.uid());

DROP POLICY IF EXISTS conv_party_update ON conversations;
CREATE POLICY conv_party_update ON conversations
  FOR UPDATE TO authenticated
    USING (pro_id = auth.uid() OR sportif_id = auth.uid())
    WITH CHECK (pro_id = auth.uid() OR sportif_id = auth.uid());

-- =====================================
-- messages
-- =====================================
DROP POLICY IF EXISTS msg_party_select ON messages;
CREATE POLICY msg_party_select ON messages
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
        AND (c.pro_id = auth.uid() OR c.sportif_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS msg_author_insert ON messages;
CREATE POLICY msg_author_insert ON messages
  FOR INSERT TO authenticated WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
        AND (c.pro_id = auth.uid() OR c.sportif_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS msg_party_update ON messages;
CREATE POLICY msg_party_update ON messages
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
        AND (c.pro_id = auth.uid() OR c.sportif_id = auth.uid())
    )
  );

-- =====================================
-- avis
-- =====================================
DROP POLICY IF EXISTS avis_public_select ON avis;
CREATE POLICY avis_public_select ON avis
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS avis_sportif_insert ON avis;
CREATE POLICY avis_sportif_insert ON avis
  FOR INSERT TO authenticated WITH CHECK (
    sportif_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM seances s
      WHERE s.id = avis.seance_id
        AND s.sportif_id = auth.uid()
        AND s.statut = 'terminee'
    )
  );

-- =====================================
-- health_notes
-- =====================================
DROP POLICY IF EXISTS health_self_all ON health_notes;
CREATE POLICY health_self_all ON health_notes
  FOR ALL TO authenticated
    USING (sportif_id = auth.uid())
    WITH CHECK (sportif_id = auth.uid());

DROP POLICY IF EXISTS health_visible_to_coach ON health_notes;
CREATE POLICY health_visible_to_coach ON health_notes
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM seances s
      WHERE s.sportif_id = health_notes.sportif_id AND s.pro_id = auth.uid()
    )
  );

-- =====================================
-- coach_notes
-- =====================================
DROP POLICY IF EXISTS coach_notes_owner_all ON coach_notes;
CREATE POLICY coach_notes_owner_all ON coach_notes
  FOR ALL TO authenticated
    USING (pro_id = auth.uid())
    WITH CHECK (pro_id = auth.uid());

DROP POLICY IF EXISTS coach_notes_public_to_sportif ON coach_notes;
CREATE POLICY coach_notes_public_to_sportif ON coach_notes
  FOR SELECT TO authenticated USING (
    sportif_id = auth.uid() AND prive = false
  );
