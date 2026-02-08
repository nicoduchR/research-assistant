import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Protected routes that require authentication
const protectedRoutes = ['/dashboard', '/profile', '/settings', '/document'];

// Public routes that don't require authentication
const publicRoutes = ['/', '/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if route is public
  const isPublicRoute = publicRoutes.includes(pathname);

  // Get JWT token from httpOnly cookie
  const token = request.cookies.get('access_token')?.value;

  // If accessing protected route
  if (isProtectedRoute) {
    // No token - redirect to landing page
    if (!token) {
      const url = new URL('/', request.url);
      url.searchParams.set('error', 'Please sign in to access your workspace');
      return NextResponse.redirect(url);
    }

    try {
      // Verify JWT token
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not configured');
      }

      const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

      const { payload } = await jwtVerify(token, secretKey, {
        algorithms: ['HS256'],
      });

      // Validate payload structure
      if (!payload.sub || typeof payload.sub !== 'string') {
        throw new Error('Invalid JWT payload: missing or invalid sub');
      }
      if (!payload.email || typeof payload.email !== 'string') {
        throw new Error('Invalid JWT payload: missing or invalid email');
      }
      if (!payload.name || typeof payload.name !== 'string') {
        throw new Error('Invalid JWT payload: missing or invalid name');
      }

      // Pass user data to route via headers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.sub);
      requestHeaders.set('x-user-email', payload.email);
      requestHeaders.set('x-user-name', payload.name);

      // Continue to protected route with user data in headers
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      // JWT verification failed (invalid signature or expired)
      console.error('JWT verification failed:', error);

      // Set error message based on error type
      const url = new URL('/', request.url);
      const errorMessage =
        error instanceof Error && error.message.includes('exp')
          ? 'Your session has expired. Please sign in again.'
          : 'Invalid session. Please sign in again.';
      url.searchParams.set('error', errorMessage);

      // Clear invalid cookie and redirect
      const redirectResponse = NextResponse.redirect(url);
      redirectResponse.cookies.delete('access_token');

      return redirectResponse;
    }
  }

  // Allow access to public routes and non-protected routes
  return NextResponse.next();
}

// Configure matcher to apply middleware to specific routes
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
