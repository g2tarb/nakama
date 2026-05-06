import { Section, Text } from '@react-email/components';

import { EmailLayout, EMAIL_COLORS, PrimaryButton } from './_layout';

export function VerifyEmail({
  prenom,
  verifyUrl,
}: {
  prenom: string;
  verifyUrl: string;
}) {
  return (
    <EmailLayout preview={`Bienvenue ${prenom}, confirme ton email Nakama`}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: EMAIL_COLORS.text,
          margin: '0 0 8px',
          letterSpacing: '-0.02em',
        }}
      >
        Bienvenue {prenom} 👋
      </Text>
      <Text style={{ color: EMAIL_COLORS.textSecondary, lineHeight: 1.5, margin: 0 }}>
        Confirme ton email pour activer ton compte Nakama et trouver le pro qui te
        correspond vraiment.
      </Text>
      <Section style={{ marginTop: 24 }}>
        <PrimaryButton href={verifyUrl}>Confirmer mon email</PrimaryButton>
      </Section>
      <Text
        style={{
          color: EMAIL_COLORS.textMuted,
          fontSize: 12,
          marginTop: 24,
          lineHeight: 1.5,
        }}
      >
        Si le bouton ne fonctionne pas, copie ce lien dans ton navigateur :<br />
        <span style={{ color: EMAIL_COLORS.goldMuted, wordBreak: 'break-all' }}>
          {verifyUrl}
        </span>
      </Text>
    </EmailLayout>
  );
}
