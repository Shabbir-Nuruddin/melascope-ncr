import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#059669',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: 8,
          border: '1px solid #10b981',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 3L3 13H29L16 3Z" fill="#ffffff" />
          <path d="M6 15V27M16 15V27M26 15V27" stroke="#ffffff" strokeWidth="2" />
          <path d="M4 27H28" stroke="#a7f3d0" strokeWidth="2.5" />
          <circle cx="16" cy="20" r="3.5" fill="#34d399" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
