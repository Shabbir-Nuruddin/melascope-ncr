import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile, updateUserProfile } from '@/lib/db';

export async function GET() {
  try {
    const profile = await getUserProfile();
    return NextResponse.json({ profile });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed fetching profile' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = await updateUserProfile(body);
    return NextResponse.json({ profile: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed updating profile' }, { status: 500 });
  }
}
