import { Section, Text } from '@react-email/components';

import { EmailLayout, EMAIL_COLORS, PrimaryButton } from './_layout';

export function BookingReminderEmail({
  prenom,
  partenaireNom,
  heure,
  lieu,
  detailUrl,
}: {
  prenom: string;
  partenaireNom: string;
  heure: string;
  lieu?: string;
  detailUrl: string;
}) {
  return (
    <EmailLayout preview={`Demain ${heure} avec ${partenaireNom}`}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: EMAIL_COLORS.text,
          margin: '0 0 8px',
          letterSpacing: '-0.02em',
        }}
      >
        Rappel : séance demain
      </Text>
      <Text style={{ color: EMAIL_COLORS.textSecondary, lineHeight: 1.5, margin: 0 }}>
        Salut {prenom}, juste un mot pour ta séance demain à {heure} avec {partenaireNom}
        {lieu ? `, ${lieu}` : ''}.
      </Text>
      <Section style={{ marginTop: 24 }}>
        <PrimaryButton href={detailUrl}>Voir la séance</PrimaryButton>
      </Section>
      <Text
        style={{
          color: EMAIL_COLORS.textMuted,
          fontSize: 12,
          marginTop: 24,
          lineHeight: 1.5,
        }}
      >
        Tu peux encore annuler gratuitement jusqu’à 24 h avant.
      </Text>
    </EmailLayout>
  );
}
