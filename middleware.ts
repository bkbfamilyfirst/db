import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard, /signin)
  const { pathname } = request.nextUrl;

  // Define public routes that don't require authentication
  const publicRoutes = ['/signin'];
  
  // Check if the current route is public
  const isPublicRoute = publicRoutes.includes(pathname);

  // Get the access token from localStorage (this won't work in middleware)
  // Instead, we'll rely on the client-side auth context for protection
  
  // Allow public routes to proceed
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For all other routes, let the client-side auth context handle protection
  return NextResponse.next();
}

export const config = {
  // Match all routes except static files and api routes
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets|placeholder).*)',
  ],
};
