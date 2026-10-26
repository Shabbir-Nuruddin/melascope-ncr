import { NextRequest, NextResponse } from 'next/server';
import { getResearchRuns } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const runs = await getResearchRuns();
    const run = runs.find((r) => r.id === params.id);

    if (!run) {
      return NextResponse.json({ error: 'Research run not found' }, { status: 404 });
    }

    return NextResponse.json({ run });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
