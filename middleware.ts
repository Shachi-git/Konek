import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: [
    '/startup/create/:path*',
    '/user/:path*',
    '/api/auth/:path*'
  ]
}

export async function middleware(request: NextRequest) {
  // Check for auth cookie names that Next Auth might use
  const hasAuthCookie = request.cookies.has('__Secure-next-auth.session-token') || 
                       request.cookies.has('next-auth.session-token')

  const isAuthRoute = request.nextUrl.pathname.startsWith('/api/auth')
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/startup/create') ||
                          request.nextUrl.pathname.startsWith('/user')

  // Allow auth routes to process normally
  if (isAuthRoute) {
    return NextResponse.next()
  }

  // Redirect to login if trying to access protected routes without auth
  if (isProtectedRoute && !hasAuthCookie) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}
