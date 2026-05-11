import { Hr, Section, Text } from '@react-email/components';

import { EmailLayout, EMAIL_COLORS, PrimaryButton } from './_layout';

export function BookingConfirmedEmail({
  destinataireRole,
  prenom,
  partenaireNom,
  date,
  heure,
  lieu,
  detailUrl,
}: {
  destinataireRole: 'sportif' | 'pro';
  prenom: string;
  partenaireNom: string;
  date: string; // ex. "Mer. 15 mai"
  heure: string; // ex. "12:30 – 13:30"
  lieu?: string;
  detailUrl: string;
}) {
  const titre =
    destinataireRole === 'sportif'
      ? `Ta séance est confirmée 🎯`
      : `Nouvelle séance confirmée`;
  const intro =
    destinataireRole === 'sportif'
      ? `Salut ${prenom}, ton coach a confirmé ta séance.`
      : `Salut ${prenom}, tu as une nouvelle séance avec ${partenaireNom}.`;

  return (
    <EmailLayout preview={`Séance confirmée — ${date} ${heure}`}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: EMAIL_COLORS.text,
          margin: '0 0 8px',
          letterSpacing: '-0.02em',
        }}
      >
        {titre}
      </Text>
      <Text style={{ color: EMAIL_COLORS.textSecondary, lineHeight: 1.5, margin: 0 }}>
        {intro}
      </Text>

      <Section
        style={{
          marginTop: 24,
          padding: 18,
          backgroundColor: '#0A0A0A',
          borderRadius: 12,
          border: `1px solid ${EMAIL_COLORS.border}`,
        }}
      >
        <Text
          style={{
            color: EMAIL_COLORS.goldMuted,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          {date}
        </Text>
        <Text
          style={{
            color: EMAIL_COLORS.text,
            fontSize: 22,
            fontWeight: 700,
            margin: '4px 0 6px',
          }}
        >
          {heure}
        </Text>
        <Text
          style={{
            color: EMAIL_COLORS.textSecondary,
            fontSize: 14,
            margin: 0,
          }}
        >
          Avec {partenaireNom}
          {lieu ? ` · ${lieu}` : ''}
        </Text>
      </Section>

      <Section style={{ marginTop: 24 }}>
        <PrimaryButton href={detailUrl}>Voir le détail</PrimaryButton>
      </Section>

      <Hr style={{ borderColor: EMAIL_COLORS.border, margin: '24px 0 12px' }} />
      <Text
        style={{
          color: EMAIL_COLORS.textMuted,
          fontSize: 12,
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        Annulation gratuite jusqu’à 24 h avant.
      </Text>
    </EmailLayout>
  );
}
