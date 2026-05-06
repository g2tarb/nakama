import { Section, Text } from '@react-email/components';

import { EmailLayout, EMAIL_COLORS, PrimaryButton } from './_layout';

export function ResetPasswordEmail({
  prenom,
  resetUrl,
}: {
  prenom: string;
  resetUrl: string;
}) {
  return (
    <EmailLayout preview="Réinitialise ton mot de passe Nakama">
      <Text
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: EMAIL_COLORS.text,
          margin: '0 0 8px',
          letterSpacing: '-0.02em',
        }}
      >
        Réinitialiser le mot de passe
      </Text>
      <Text style={{ color: EMAIL_COLORS.textSecondary, lineHeight: 1.5, margin: 0 }}>
        Bonjour {prenom}, on a reçu une demande pour réinitialiser ton mot de passe.
      </Text>
      <Section style={{ marginTop: 24 }}>
        <PrimaryButton href={resetUrl}>Choisir un nouveau mot de passe</PrimaryButton>
      </Section>
      <Text
        style={{
          color: EMAIL_COLORS.textMuted,
          fontSize: 12,
          marginTop: 24,
          lineHeight: 1.5,
        }}
      >
        Le lien expire dans 1 h. Si tu n’es pas à l’origine de cette demande, tu peux
        ignorer ce mail — ton mot de passe reste inchangé.
      </Text>
    </EmailLayout>
  );
}
