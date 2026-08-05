import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@/lib/supabase/middleware';

/**
 * OUROZ route protection proxy.
 * Preserves the existing auth and redirect behavior while using the supported
 * Next.js proxy convention.
 */

const PROTECTED_PREFIXES = ['/account', '/checkout', '/supplier', '/admin', '/business', '/wholesale', '/trade'];
const PUBLIC_EXCEPTIONS = [
  '/supplier/register',
  '/wholesale/apply',
  '/wholesale/catalog',
  '/wholesale/quality-report',
  '/business/apply',
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (!isProtected) return NextResponse.next();

  if (
    PUBLIC_EXCEPTIONS.includes(pathname) ||
    pathname === '/supplier/atlas-souk' ||
    pathname === '/supplier/danat-al-jazeera'
  ) {
    return NextResponse.next();
  }

  const response = NextResponse.next({ request });
  const supabase = createMiddlewareClient(request, response);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('return', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    '/account/:path*',
    '/checkout/:path*',
    '/supplier/:path*',
    '/admin/:path*',
    '/business/:path*',
    '/wholesale/:path*',
    '/trade/:path*',
  ],
};