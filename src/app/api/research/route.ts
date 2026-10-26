import { NextRequest, NextResponse } from 'next/server';
import { executeResearchRun } from '@/lib/research';
import { getResearchRuns } from '@/lib/db';

export async function GET() {
  try {
    const runs = await getResearchRuns();
    return NextResponse.json({ runs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed fetching research runs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.query || typeof body.query !== 'string') {
      return NextResponse.json({ error: 'Query string is required' }, { status: 400 });
    }

    const run = await executeResearchRun({
      query: body.query,
      dateHorizonDays: body.dateHorizonDays,
      locality: body.locality,
    });

    return NextResponse.json({ run }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed executing research run' }, { status: 500 });
  }
}
