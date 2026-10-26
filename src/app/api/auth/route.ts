import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { hashToken, isAuthenticated, getSessionCookieOptions } from '@/lib/auth';

const APP_PASSWORD = process.env.APP_PASSWORD || 'mela2026';

export async function GET() {
  const authed = await isAuthenticated();
  return NextResponse.json({
    authenticated: authed,
    requiresAuth: process.env.APP_DISABLE_AUTH !== 'true',
    defaultPasswordHint: process.env.APP_PASSWORD ? undefined : 'mela2026',
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, password } = body;

    if (action === 'logout') {
      const res = NextResponse.json({ success: true, message: 'Logged out' });
      res.cookies.delete('melascope_session');
      return res;
    }

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    if (password === APP_PASSWORD) {
      const res = NextResponse.json({ success: true });
      const cookieOpts = getSessionCookieOptions();
      res.cookies.set(cookieOpts.name, cookieOpts.value, {
        httpOnly: cookieOpts.httpOnly,
        secure: cookieOpts.secure,
        sameSite: cookieOpts.sameSite,
        path: cookieOpts.path,
        maxAge: cookieOpts.maxAge,
      });
      return res;
    }

    return NextResponse.json({ error: 'Incorrect workspace password' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
