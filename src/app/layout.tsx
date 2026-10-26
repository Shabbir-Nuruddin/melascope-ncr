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
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-amber-500/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
