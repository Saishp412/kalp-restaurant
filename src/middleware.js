import { NextResponse } from 'next/server';

export function middleware(request) {
  // Only apply to /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // Allow access to the login page itself and auth api
    if (request.nextUrl.pathname === '/admin/login' || request.nextUrl.pathname.startsWith('/api/auth/admin')) {
      return NextResponse.next();
    }

    // Check for auth cookie
    const token = request.cookies.get('admin_token');

    if (!token || token.value !== 'authenticated') {
      // Redirect to login page
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
