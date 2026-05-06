import 'server-only';

import { and, asc, desc, eq, or } from 'drizzle-orm';

import { db } from '@/lib/db/client';
import { conversations, messages } from '@/lib/db/schema';

export async function listConversationsForUser(userId: string) {
  return db
    .select()
    .from(conversations)
    .where(or(eq(conversations.proId, userId), eq(conversations.sportifId, userId)))
    .orderBy(desc(conversations.dernierMessage));
}

export async function getOrCreateConversation(proId: string, sportifId: string) {
  const [existing] = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.proId, proId), eq(conversations.sportifId, sportifId)))
    .limit(1);
  if (existing) return existing;

  const [created] = await db
    .insert(conversations)
    .values({ proId, sportifId })
    .returning();
  if (!created) throw new Error('Échec création conversation');
  return created;
}

export async function listMessages(conversationId: string, limit = 200) {
  return db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt))
    .limit(limit);
}

export async function sendMessage(input: {
  conversationId: string;
  authorId: string;
  contenu: string;
}) {
  const [msg] = await db
    .insert(messages)
    .values({
      conversationId: input.conversationId,
      authorId: input.authorId,
      contenu: input.contenu,
    })
    .returning();
  if (!msg) throw new Error('Échec envoi message');

  await db
    .update(conversations)
    .set({ dernierMessage: msg.createdAt })
    .where(eq(conversations.id, input.conversationId));

  return msg;
}

export async function markMessagesAsRead(conversationId: string, readerId: string) {
  await db
    .update(messages)
    .set({ lu: true })
    .where(
      and(
        eq(messages.conversationId, conversationId),
        eq(messages.lu, false),
        // ne marque que les messages NON envoyés par moi
      ),
    );
  return readerId;
}
