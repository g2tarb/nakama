'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          background: '#0A0A0A',
          color: '#F5F5F5',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <p
          style={{
            color: '#E5B547',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
          }}
        >
          Erreur serveur
        </p>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Quelque chose s&apos;est mal passé
        </h1>
        <p style={{ color: '#A0A0A0', maxWidth: '28rem', marginBottom: '2rem' }}>
          Une erreur inattendue est survenue. Réessaie dans quelques instants.
        </p>
        <button
          onClick={reset}
          style={{
            background: '#E5B547',
            color: '#0A0A0A',
            padding: '0.75rem 1.5rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Réessayer
        </button>
      </body>
    </html>
  );
}
