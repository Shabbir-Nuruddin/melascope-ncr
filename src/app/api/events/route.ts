import { NextRequest, NextResponse } from 'next/server';
import { getEvents, createEvent } from '@/lib/db';
import { EventFilters } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const filters: EventFilters = {
      searchQuery: searchParams.get('q') || undefined,
      locality: searchParams.get('locality') || undefined,
      eventType: searchParams.get('eventType') || undefined,
      venueContext: searchParams.get('venueContext') || undefined,
      dateHorizonDays: searchParams.get('horizon') ? parseInt(searchParams.get('horizon')!, 10) : undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      minScore: searchParams.get('minScore') ? parseInt(searchParams.get('minScore')!, 10) : undefined,
      maxStallFee: searchParams.get('maxFee') ? parseInt(searchParams.get('maxFee')!, 10) : undefined,
      verifiedOnly: searchParams.get('verifiedOnly') === 'true',
      bookingLinkOnly: searchParams.get('bookingLinkOnly') === 'true',
      userStatus: searchParams.get('status') || undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'fit_score',
    };

    const events = await getEvents(filters);
    return NextResponse.json({
      events,
      count: events.length,
      filters,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed fetching events' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.venue_name) {
      return NextResponse.json(
        { error: 'Title and venue name are required' },
        { status: 400 }
      );
    }

    const created = await createEvent(body);
    return NextResponse.json({ event: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed creating event' }, { status: 500 });
  }
}
