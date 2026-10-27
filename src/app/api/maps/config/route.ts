import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const key =
    process.env.GOOGLE_MAPS_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ||
    '';

  const isConfigured = Boolean(key && key.length > 5 && !key.includes('YOUR_'));

  return NextResponse.json({
    configured: isConfigured,
    apiKey: isConfigured ? key : null,
  });
}
