import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';

import { clientConfig } from '@/lib/env';

const COLORS = {
  bg: '#1E2A3A',
  card: '#2A3749',
  border: '#3A4A5E',
  text: '#F5F5F5',
  textSecondary: '#BDC5D1',
  textMuted: '#8A95A8',
  gold: '#C9B27A',
  goldMuted: '#8A7F5F',
};

export function EmailLayout({
  preview,
  children,
}: {
  preview: string;
  children: React.ReactNode;
}) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: COLORS.bg,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          margin: 0,
          padding: '32px 16px',
          color: COLORS.text,
        }}
      >
        <Container
          style={{
            maxWidth: 560,
            margin: '0 auto',
            backgroundColor: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 14,
            padding: 32,
          }}
        >
          <Section style={{ marginBottom: 24 }}>
            <Img
              src={`${clientConfig().NEXT_PUBLIC_APP_URL}/logos/nakama-symbol.svg`}
              alt="Nakama"
              width={28}
              height={28}
              style={{ display: 'inline-block', verticalAlign: 'middle' }}
            />
            <Text
              style={{
                display: 'inline-block',
                marginLeft: 10,
                color: COLORS.gold,
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: '0.04em',
                verticalAlign: 'middle',
              }}
            >
              NAKAMA
            </Text>
          </Section>

          {children}

          <Hr style={{ borderColor: COLORS.border, margin: '32px 0 16px' }} />
          <Text
            style={{
              fontSize: 11,
              color: COLORS.textMuted,
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            © 2026 Nakama. Tu reçois ce mail car tu as un compte sur Nakama.
            <br />
            <a
              href={`${clientConfig().NEXT_PUBLIC_APP_URL}/parametres`}
              style={{ color: COLORS.goldMuted, textDecoration: 'underline' }}
            >
              Gérer mes préférences
            </a>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export const EMAIL_COLORS = COLORS;

export function PrimaryButton({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      style={{
        display: 'inline-block',
        background: COLORS.gold,
        color: COLORS.bg,
        padding: '12px 22px',
        borderRadius: 10,
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: 14,
      }}
    >
      {children}
    </a>
  );
}
