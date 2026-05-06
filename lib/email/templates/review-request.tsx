import { Section, Text } from '@react-email/components';

import { EmailLayout, EMAIL_COLORS, PrimaryButton } from './_layout';

export function ReviewRequestEmail({
  prenom,
  proNom,
  reviewUrl,
}: {
  prenom: string;
  proNom: string;
  reviewUrl: string;
}) {
  return (
    <EmailLayout preview={`Comment s’est passée ta séance avec ${proNom} ?`}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: EMAIL_COLORS.text,
          margin: '0 0 8px',
          letterSpacing: '-0.02em',
        }}
      >
        Donne ton avis
      </Text>
      <Text style={{ color: EMAIL_COLORS.textSecondary, lineHeight: 1.5, margin: 0 }}>
        Salut {prenom}, ta séance avec {proNom} est terminée. Une note et quelques mots
        aident les prochains sportifs à trouver le bon coach.
      </Text>
      <Section style={{ marginTop: 24 }}>
        <PrimaryButton href={reviewUrl}>Laisser un avis</PrimaryButton>
      </Section>
      <Text
        style={{
          color: EMAIL_COLORS.textMuted,
          fontSize: 12,
          marginTop: 24,
          lineHeight: 1.5,
        }}
      >
        Ça prend 30 secondes — promis.
      </Text>
    </EmailLayout>
  );
}
