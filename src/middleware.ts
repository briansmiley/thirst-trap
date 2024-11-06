import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authenticated = request.cookies.get('authenticated')
  const isRootPath = request.nextUrl.pathname === '/'
  const authCookieToken = process.env.AUTH_COOKIE_TOKEN

  // Check both existence and value of the cookie, matching auth.ts logic
  const isValidAuth = authenticated?.value === authCookieToken

  if (!isValidAuth && !isRootPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - Root path (/)
     * - API routes (/api/*)
     * - Static files (_next/static/*)
     * - Public files (public/*)
     */
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
  ],
}
