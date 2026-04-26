import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#0B0F14',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 110,
        fontWeight: 800,
        color: '#C9B27A',
        fontFamily: 'system-ui, sans-serif',
        letterSpacing: '-0.03em',
      }}
    >
      N
    </div>,
    { ...size },
  );
}
