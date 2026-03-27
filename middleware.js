import { NextResponse } from 'next/server';

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('admin_token');
    
    // Validate token exists (actual validation is done by the backend API)
    if (!token) {
      // Redirect unauthenticated users to the login page
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Allow access if logged in or navigating public pages
  return NextResponse.next();
}

// Ensure middleware runs only on intended routes
export const config = {
  matcher: ['/admin/:path*'],
};
