import { Section, Text } from '@react-email/components';

import { EmailLayout, EMAIL_COLORS, PrimaryButton } from './_layout';

export function BookingCancelledEmail({
  destinataireRole,
  prenom,
  partenaireNom,
  date,
  heure,
  raison,
  searchUrl,
}: {
  destinataireRole: 'sportif' | 'pro';
  prenom: string;
  partenaireNom: string;
  date: string;
  heure: string;
  raison?: string;
  searchUrl: string;
}) {
  return (
    <EmailLayout preview={`Séance annulée — ${date} ${heure}`}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: EMAIL_COLORS.text,
          margin: '0 0 8px',
          letterSpacing: '-0.02em',
        }}
      >
        Séance annulée
      </Text>
      <Text style={{ color: EMAIL_COLORS.textSecondary, lineHeight: 1.5, margin: 0 }}>
        Salut {prenom}, ta séance avec {partenaireNom} le {date} à {heure} a été annulée.
        {raison ? ` Raison : « ${raison} »` : ''}
      </Text>
      <Section style={{ marginTop: 24 }}>
        <PrimaryButton href={searchUrl}>
          {destinataireRole === 'sportif' ? 'Trouver un autre Nakama' : 'Voir mon agenda'}
        </PrimaryButton>
      </Section>
    </EmailLayout>
  );
}
