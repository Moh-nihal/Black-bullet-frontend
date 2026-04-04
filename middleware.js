import { NextResponse } from 'next/server';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Admin shell: require session cookie (httpOnly, set by backend on login). Login stays public.
  if (pathname.startsWith('/admin')) {
    const isLogin = pathname === '/admin/login' || pathname.startsWith('/admin/login/');
    if (!isLogin) {
      const token = request.cookies.get('admin_token')?.value;
      if (!token) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/admin/login';
        loginUrl.search = '';
        return NextResponse.redirect(loginUrl);
      }
    }
    return NextResponse.next();
  }

  // Skip API routes, static files, and next internal builds
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|css|js|ico|woff|woff2|ttf|eot)$/) ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next();
  }

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Redirect if there is no locale
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
