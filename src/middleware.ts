import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Proteksi Sesi Admin
  const adminSession = request.cookies.get('admin_session');
  const isLoginPage = path === '/admin/login';

  if (path.startsWith('/admin') && !isLoginPage && !adminSession) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (isLoginPage && adminSession) {
    return NextResponse.redirect(new URL('/admin/kader', request.url));
  }

  // 2. Proteksi Sesi Portal Anggota
  const anggotaSession = request.cookies.get('anggota_session');
  const isAnggotaLoginPage = path === '/anggota/login';

  if (path.startsWith('/anggota/dashboard') && !anggotaSession) {
    return NextResponse.redirect(new URL('/anggota/login', request.url));
  }

  if (isAnggotaLoginPage && anggotaSession) {
    return NextResponse.redirect(new URL('/anggota/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/anggota/dashboard/:path*', '/anggota/login'],
};