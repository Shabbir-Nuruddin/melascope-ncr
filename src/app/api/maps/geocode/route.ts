import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
  }

  const key =
    process.env.GOOGLE_MAPS_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ||
    '';

  if (!key) {
    return NextResponse.json(
      { error: 'Google Maps API key is not configured on the server' },
      { status: 500 }
    );
  }

  try {
    const encoded = encodeURIComponent(`${address}, Delhi NCR, India`);
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${key}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (data.status === 'OK' && data.results?.[0]) {
      const loc = data.results[0].geometry.location;
      return NextResponse.json({
        latitude: loc.lat,
        longitude: loc.lng,
        formatted_address: data.results[0].formatted_address,
        confidence: data.results[0].geometry.location_type === 'ROOFTOP' ? 'exact' : 'approximate',
      });
    }

    return NextResponse.json(
      { error: data.error_message || 'Geocoding query returned no results', status: data.status },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Geocoding service failure' }, { status: 500 });
  }
}
