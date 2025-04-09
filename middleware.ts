import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { GUEST_COOKIE_NAME } from "@/lib/cookies"

export function middleware(request: NextRequest) {
  const guestId = request.cookies.get(GUEST_COOKIE_NAME)?.value

  // If no guest ID cookie exists, let the page handle it
  if (!guestId) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
