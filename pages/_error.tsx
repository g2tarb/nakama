import type { NextPageContext } from 'next';

interface ErrorProps {
  statusCode?: number;
}

function Error({ statusCode }: ErrorProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: '#0A0A0A',
        color: '#E6E8EB',
        fontFamily: 'system-ui, sans-serif',
        textAlign: 'center',
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
        {statusCode ? `Erreur ${statusCode}` : 'Erreur'}
      </p>
      <h1
        style={{
          fontSize: '1.875rem',
          fontWeight: 700,
          marginBottom: '0.75rem',
        }}
      >
        Quelque chose s&apos;est mal passé
      </h1>
      <p style={{ color: '#A0A0A0', maxWidth: '28rem' }}>
        {statusCode === 404
          ? "Cette page n'existe pas ou a été déplacée."
          : 'Une erreur inattendue est survenue. Réessaie dans quelques instants.'}
      </p>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
