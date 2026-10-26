import { NextRequest, NextResponse } from 'next/server';
import { getEventById, updateEvent } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await getEventById(params.id);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Refresh simulation: update verified timestamp and sources checked_at
    const now = new Date().toISOString();
    const updatedSources = event.source_urls.map((s) => ({
      ...s,
      last_verified_at: now,
    }));

    // If start_at has passed relative to now, mark expired
    const startMs = new Date(event.start_at).getTime();
    let verification = event.verification_status;
    if (startMs < Date.now()) {
      verification = 'expired';
    }

    const updated = await updateEvent(params.id, {
      last_verified_at: now,
      source_urls: updatedSources,
      verification_status: verification,
    });

    return NextResponse.json({
      message: 'Source verification refreshed successfully',
      event: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed refreshing event' }, { status: 500 });
  }
}
