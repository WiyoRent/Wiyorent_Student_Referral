import { NextResponse } from 'next/server';

export function middleware(request) {
  console.log('middleware at src');
  const url = request.nextUrl;
  const pathname = url.pathname;

  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
  if (!isAdminRoute) return NextResponse.next();

  const cookieHeader = request.headers.get('cookie') || '';
  const token = cookieHeader.split('token=')[1]?.split(';')[0];
  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const redirectUrl = new URL('/not-authorized', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  try {
    // Decode minimally to check role without importing server-only modules in middleware
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    if (payload?.role !== 'admin') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
      const redirectUrl = new URL('/not-authorized', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  } catch (_) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const redirectUrl = new URL('/not-authorized', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};


