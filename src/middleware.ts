import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authenticated = request.cookies.get("authenticated");

  // Allow access to the root path without redirection
  if (request.nextUrl.pathname === "/") {
    return NextResponse.next();
  }

  if (!authenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|favicon.svg).*)"]
};
