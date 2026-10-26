import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MelaScope NCR — Delhi NCR Event & Venue Intelligence',
  description: 'Private, product-agnostic intelligence workspace discovering melas, flea markets, exhibitions, and stall-selling opportunities across Delhi NCR.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="bg-[#f4f8f5] text-[#0f291e] antialiased selection:bg-[#059669]/20 selection:text-[#047857]">
        {children}
      </body>
    </html>
  );
}
