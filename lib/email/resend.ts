import 'server-only';

import { Resend } from 'resend';

import { serverConfig } from '@/lib/env';

let cached: Resend | null = null;

export function getResend() {
  if (cached) return cached;
  cached = new Resend(serverConfig().RESEND_API_KEY);
  return cached;
}

export type SendInput = {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
  /** ex. for replyTo, tags, etc. */
  replyTo?: string;
};

export async function sendEmail({ to, subject, react, replyTo }: SendInput) {
  const resend = getResend();
  const { RESEND_FROM_EMAIL } = serverConfig();
  const { data, error } = await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to,
    subject,
    react,
    ...(replyTo ? { replyTo } : {}),
  });
  if (error) {
    console.error('[email] send error', error);
    return { ok: false as const, error: error.message };
  }
  return { ok: true as const, id: data?.id ?? null };
}
