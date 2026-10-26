import { NextRequest, NextResponse } from 'next/server';
import { getEvents } from '@/lib/db';
import { EventFilters } from '@/types';

function escapeCsvCell(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const filters: EventFilters = {
      searchQuery: searchParams.get('q') || undefined,
      locality: searchParams.get('locality') || undefined,
      eventType: searchParams.get('eventType') || undefined,
      venueContext: searchParams.get('venueContext') || undefined,
      minScore: searchParams.get('minScore') ? parseInt(searchParams.get('minScore')!, 10) : undefined,
      maxStallFee: searchParams.get('maxFee') ? parseInt(searchParams.get('maxFee')!, 10) : undefined,
      verifiedOnly: searchParams.get('verifiedOnly') === 'true',
      bookingLinkOnly: searchParams.get('bookingLinkOnly') === 'true',
      userStatus: searchParams.get('status') || undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'fit_score',
    };

    const events = await getEvents(filters);

    const headers = [
      'Event ID',
      'Title',
      'Event Type',
      'City',
      'Locality',
      'Venue Name',
      'Full Address',
      'Latitude',
      'Longitude',
      'Start Date (Asia/Kolkata)',
      'End Date (Asia/Kolkata)',
      'Opening Hours',
      'Organiser Name',
      'Organiser Phone',
      'Organiser Email',
      'Stall Fee Min (INR)',
      'Stall Fee Max (INR)',
      'Vendor Booking URL',
      'Booking URL Type',
      'Application Deadline',
      'Venue Context',
      'Verification Status',
      'AI Fit Score',
      'Confidence',
      'Recommendation',
      'User Status',
      'User Notes',
      'Last Verified At',
      'Source Count',
    ];

    const rows = events.map((e) => [
      escapeCsvCell(e.id),
      escapeCsvCell(e.title),
      escapeCsvCell(e.event_type),
      escapeCsvCell(e.city),
      escapeCsvCell(e.locality),
      escapeCsvCell(e.venue_name),
      escapeCsvCell(e.address),
      escapeCsvCell(e.latitude),
      escapeCsvCell(e.longitude),
      escapeCsvCell(e.start_at),
      escapeCsvCell(e.end_at),
      escapeCsvCell(e.opening_hours || ''),
      escapeCsvCell(e.organizer_name),
      escapeCsvCell(e.organizer_phone || ''),
      escapeCsvCell(e.organizer_email || ''),
      escapeCsvCell(e.stall_fee_min ?? ''),
      escapeCsvCell(e.stall_fee_max ?? ''),
      escapeCsvCell(e.vendor_booking_url || ''),
      escapeCsvCell(e.booking_url_type),
      escapeCsvCell(e.application_deadline || ''),
      escapeCsvCell(e.venue_context),
      escapeCsvCell(e.verification_status),
      escapeCsvCell(e.fit_score),
      escapeCsvCell(e.overall_confidence),
      escapeCsvCell(e.recommendation),
      escapeCsvCell(e.user_status),
      escapeCsvCell(e.user_notes || ''),
      escapeCsvCell(e.last_verified_at),
      escapeCsvCell(e.source_urls.length),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    const fileName = `melascope-ncr-opportunities-${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed generating CSV' }, { status: 500 });
  }
}
