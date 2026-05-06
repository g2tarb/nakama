import { sql } from 'drizzle-orm';
import {
  boolean,
  doublePrecision,
  index,
  integer,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

/* ──────────────── Enums ──────────────── */

export const roleEnum = pgEnum('user_role', ['sportif', 'pro']);

export const niveauEnum = pgEnum('niveau', ['debutant', 'intermediaire', 'avance']);

export const genreEnum = pgEnum('genre', ['homme', 'femme', 'autre']);

export const specialiteEnum = pgEnum('specialite', [
  'coach_sportif',
  'preparateur_physique',
  'preparateur_mental',
  'nutritionniste',
  'educateur_sportif',
]);

export const formuleEnum = pgEnum('formule', ['standard', 'premium', 'elite']);
export const formatEnum = pgEnum('format', ['presentiel', 'distanciel', 'hybride']);

export const statutSeanceEnum = pgEnum('statut_seance', [
  'en_attente',
  'confirmee',
  'annulee',
  'terminee',
]);

export const niveauAlerteEnum = pgEnum('niveau_alerte', ['rouge', 'jaune', 'vert']);

/* ──────────────── Profil sportif ──────────────── */

export const sportifProfiles = pgTable(
  'sportif_profiles',
  {
    id: uuid('id').primaryKey().notNull(), // = auth.users.id
    prenom: text('prenom').notNull(),
    nom: text('nom').notNull(),
    age: integer('age'),
    genre: genreEnum('genre'),
    photoUrl: text('photo_url'),
    niveau: niveauEnum('niveau'),
    objectifs: text('objectifs')
      .array()
      .default(sql`'{}'::text[]`),
    sports: text('sports')
      .array()
      .default(sql`'{}'::text[]`),
    contraintes: text('contraintes'),
    frequence: text('frequence'),
    ville: text('ville'),
    codePostal: text('code_postal'),
    lat: doublePrecision('lat'),
    lng: doublePrecision('lng'),
    rayonKm: integer('rayon_km').default(10),
    budgetMin: integer('budget_min'),
    budgetMax: integer('budget_max'),
    vibePedagogie: smallint('vibe_pedagogie'),
    vibeSuivi: smallint('vibe_suivi'),
    vibeData: smallint('vibe_data'),
    bio: text('bio'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('idx_sportif_codepostal').on(t.codePostal),
    index('idx_sportif_geo').on(t.lat, t.lng),
  ],
);

/* ──────────────── Profil pro ──────────────── */

export const proProfiles = pgTable(
  'pro_profiles',
  {
    id: uuid('id').primaryKey().notNull(),
    prenom: text('prenom').notNull(),
    nom: text('nom').notNull(),
    photoUrl: text('photo_url'),
    specialite: specialiteEnum('specialite').notNull(),
    sports: text('sports')
      .array()
      .default(sql`'{}'::text[]`),
    formats: text('formats')
      .array()
      .default(sql`'{}'::text[]`),
    bio: text('bio'),
    formations: text('formations')
      .array()
      .default(sql`'{}'::text[]`),
    anneesExperience: integer('annees_experience').default(0),
    ville: text('ville'),
    codePostal: text('code_postal'),
    lat: doublePrecision('lat'),
    lng: doublePrecision('lng'),
    rayonKm: integer('rayon_km').default(15),
    niveauEnseigne: text('niveau_enseigne')
      .array()
      .default(sql`'{}'::text[]`),
    formule: formuleEnum('formule').default('standard').notNull(),
    tarifMin: integer('tarif_min'),
    tarifMax: integer('tarif_max'),
    vibePedagogie: smallint('vibe_pedagogie'),
    vibeSuivi: smallint('vibe_suivi'),
    vibeData: smallint('vibe_data'),
    note: doublePrecision('note').default(0).notNull(),
    nbAvis: integer('nb_avis').default(0).notNull(),
    actif: boolean('actif').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('idx_pro_specialite').on(t.specialite),
    index('idx_pro_geo').on(t.lat, t.lng),
    index('idx_pro_actif').on(t.actif),
  ],
);

/* ──────────────── Cartes services ──────────────── */

export const cartesServices = pgTable(
  'cartes_services',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    proId: uuid('pro_id')
      .references(() => proProfiles.id, { onDelete: 'cascade' })
      .notNull(),
    nom: text('nom').notNull(),
    sport: text('sport').notNull(),
    description: text('description'),
    tarifHeure: integer('tarif_heure').notNull(),
    dureeMinutes: integer('duree_minutes').notNull(),
    format: formatEnum('format').default('presentiel').notNull(),
    tags: text('tags')
      .array()
      .default(sql`'{}'::text[]`),
    actif: boolean('actif').default(true).notNull(),
    nbReservations: integer('nb_reservations').default(0).notNull(),
    caGenere: integer('ca_genere').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('idx_carte_pro').on(t.proId)],
);

/* ──────────────── Séances ──────────────── */

export const seances = pgTable(
  'seances',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    proId: uuid('pro_id')
      .references(() => proProfiles.id)
      .notNull(),
    sportifId: uuid('sportif_id')
      .references(() => sportifProfiles.id)
      .notNull(),
    carteServiceId: uuid('carte_service_id').references(() => cartesServices.id),
    dateDebut: timestamp('date_debut', { withTimezone: true }).notNull(),
    dureeMinutes: integer('duree_minutes').notNull(),
    lieu: text('lieu'),
    tarif: integer('tarif').notNull(),
    statut: statutSeanceEnum('statut').default('en_attente').notNull(),
    ressentiClient: smallint('ressenti_client'),
    chargePercue: smallint('charge_percue'),
    compteRenduCoach: text('compte_rendu_coach'),
    rappelEnvoye: boolean('rappel_envoye').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('idx_seance_pro_date').on(t.proId, t.dateDebut),
    index('idx_seance_sportif_date').on(t.sportifId, t.dateDebut),
    index('idx_seance_statut').on(t.statut),
  ],
);

/* ──────────────── Conversations ──────────────── */

export const conversations = pgTable(
  'conversations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    proId: uuid('pro_id')
      .references(() => proProfiles.id, { onDelete: 'cascade' })
      .notNull(),
    sportifId: uuid('sportif_id')
      .references(() => sportifProfiles.id, { onDelete: 'cascade' })
      .notNull(),
    dernierMessage: timestamp('dernier_message', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    unique('uniq_conv_pair').on(t.proId, t.sportifId),
    index('idx_conv_pro').on(t.proId),
    index('idx_conv_sportif').on(t.sportifId),
  ],
);

/* ──────────────── Messages ──────────────── */

export const messages = pgTable(
  'messages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    conversationId: uuid('conversation_id')
      .references(() => conversations.id, { onDelete: 'cascade' })
      .notNull(),
    authorId: uuid('author_id').notNull(), // auth.users.id (pro ou sportif)
    contenu: text('contenu').notNull(),
    lu: boolean('lu').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index('idx_msg_conversation_date').on(t.conversationId, t.createdAt)],
);

/* ──────────────── Avis ──────────────── */

export const avis = pgTable(
  'avis',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    proId: uuid('pro_id')
      .references(() => proProfiles.id, { onDelete: 'cascade' })
      .notNull(),
    sportifId: uuid('sportif_id')
      .references(() => sportifProfiles.id, { onDelete: 'cascade' })
      .notNull(),
    seanceId: uuid('seance_id')
      .references(() => seances.id, { onDelete: 'cascade' })
      .notNull(),
    note: smallint('note').notNull(),
    commentaire: text('commentaire'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex('uniq_avis_seance').on(t.seanceId),
    index('idx_avis_pro').on(t.proId),
  ],
);

/* ──────────────── Notes santé / coach ──────────────── */

export const healthNotes = pgTable('health_notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  sportifId: uuid('sportif_id')
    .references(() => sportifProfiles.id, { onDelete: 'cascade' })
    .notNull(),
  niveau: niveauAlerteEnum('niveau').notNull(),
  titre: text('titre').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const coachNotes = pgTable('coach_notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  proId: uuid('pro_id')
    .references(() => proProfiles.id, { onDelete: 'cascade' })
    .notNull(),
  sportifId: uuid('sportif_id')
    .references(() => sportifProfiles.id, { onDelete: 'cascade' })
    .notNull(),
  contenu: text('contenu').notNull(),
  prive: boolean('prive').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

/* ──────────────── User role lookup ──────────────── */
// Table de jointure simple pour savoir si un user est sportif ou pro.
// Alternative : checker l'existence dans sportif_profiles vs pro_profiles.
export const userRoles = pgTable('user_roles', {
  userId: uuid('user_id').primaryKey().notNull(),
  role: roleEnum('role').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

/* ──────────────── Types inférés ──────────────── */

export type SportifProfile = typeof sportifProfiles.$inferSelect;
export type SportifProfileInsert = typeof sportifProfiles.$inferInsert;
export type ProProfile = typeof proProfiles.$inferSelect;
export type ProProfileInsert = typeof proProfiles.$inferInsert;
export type CarteService = typeof cartesServices.$inferSelect;
export type CarteServiceInsert = typeof cartesServices.$inferInsert;
export type Seance = typeof seances.$inferSelect;
export type SeanceInsert = typeof seances.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Avis = typeof avis.$inferSelect;
export type UserRole = typeof userRoles.$inferSelect;
