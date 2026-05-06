import 'server-only';

import { sendEmail } from './resend';
import { VerifyEmail } from './templates/verify-email';
import { ResetPasswordEmail } from './templates/reset-password';
import { BookingConfirmedEmail } from './templates/booking-confirmed';
import { BookingReminderEmail } from './templates/booking-reminder';
import { BookingCancelledEmail } from './templates/booking-cancelled';
import { ReviewRequestEmail } from './templates/review-request';

export async function sendVerifyEmail(
  to: string,
  args: { prenom: string; verifyUrl: string },
) {
  return sendEmail({
    to,
    subject: 'Confirme ton email Nakama',
    react: <VerifyEmail {...args} />,
  });
}

export async function sendResetPassword(
  to: string,
  args: { prenom: string; resetUrl: string },
) {
  return sendEmail({
    to,
    subject: 'Réinitialiser ton mot de passe',
    react: <ResetPasswordEmail {...args} />,
  });
}

export async function sendBookingConfirmed(
  to: string,
  args: Parameters<typeof BookingConfirmedEmail>[0],
) {
  return sendEmail({
    to,
    subject: `Séance confirmée — ${args.date} ${args.heure}`,
    react: <BookingConfirmedEmail {...args} />,
  });
}

export async function sendBookingReminder(
  to: string,
  args: Parameters<typeof BookingReminderEmail>[0],
) {
  return sendEmail({
    to,
    subject: `Rappel : séance demain à ${args.heure}`,
    react: <BookingReminderEmail {...args} />,
  });
}

export async function sendBookingCancelled(
  to: string,
  args: Parameters<typeof BookingCancelledEmail>[0],
) {
  return sendEmail({
    to,
    subject: `Séance annulée — ${args.date} ${args.heure}`,
    react: <BookingCancelledEmail {...args} />,
  });
}

export async function sendReviewRequest(
  to: string,
  args: Parameters<typeof ReviewRequestEmail>[0],
) {
  return sendEmail({
    to,
    subject: `Ton avis sur ${args.proNom} ?`,
    react: <ReviewRequestEmail {...args} />,
  });
}
