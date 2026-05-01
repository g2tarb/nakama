import { ImageResponse } from 'next/og';

export const alt = 'Nakama, le Doctolib du coaching sportif';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 30% 30%, #1A2230 0%, #0B0F14 70%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '80px 96px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#C9B27A',
          marginBottom: 24,
        }}
      >
        NAKAMA
      </div>
      <div
        style={{
          fontSize: 84,
          fontWeight: 800,
          color: '#E6E8EB',
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          maxWidth: 900,
        }}
      >
        Le Doctolib du coaching sportif
      </div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 400,
          color: '#9AA3AD',
          marginTop: 32,
          maxWidth: 880,
          lineHeight: 1.3,
        }}
      >
        Matching comportemental, réservation simple, progression suivie.
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          right: 96,
          fontSize: 20,
          color: '#6B7480',
          fontWeight: 500,
        }}
      >
        nakama.tech
      </div>
    </div>,
    { ...size },
  );
}
