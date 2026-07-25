import { NextResponse } from 'next/server';

const RESERVED = new Set([
  'dashboard',
  'pricing',
  'bio',
  'api',
  'unlock',
  'auth',
  'login',
  'r',
]);

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split('/').filter(Boolean);

  // Only single-segment paths can be short links: /testing
  if (segments.length !== 1) {
    return NextResponse.next();
  }

  const slug = segments[0].toLowerCase();
  if (RESERVED.has(slug) || slug.includes('.')) {
    return NextResponse.next();
  }

  const api = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001').replace(/\/$/, '');
  return NextResponse.redirect(`${api}/r/${encodeURIComponent(slug)}`, 302);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\..*).*)',
  ],
};
