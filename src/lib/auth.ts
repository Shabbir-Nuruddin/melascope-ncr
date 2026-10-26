import { cookies } from 'next/headers';

const AUTH_COOKIE_NAME = 'melascope_session';
const DEFAULT_PASSCODE = process.env.APP_PASSWORD || 'mela2026';

export async function isAuthenticated(): Promise<boolean> {
  // If no APP_PASSWORD is set or in open dev mode, allow access
  if (process.env.APP_DISABLE_AUTH === 'true') {
    return true;
  }

  const cookieStore = cookies();
  const sessionToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!sessionToken) return false;

  return sessionToken === hashToken(DEFAULT_PASSCODE);
}

export function hashToken(password: string): string {
  // Simple deterministic session token for single user workspace
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `session_${Math.abs(hash)}_${password.length}`;
}

export function getSessionCookieOptions() {
  return {
    name: AUTH_COOKIE_NAME,
    value: hashToken(DEFAULT_PASSCODE),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  };
}
