import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Auth protection is now handled client-side via AuthContext.
  // This middleware only handles basic route protection by checking
  // for the presence of an access token cookie/header if needed.
  // For now, we let all routes through since auth is JWT-based on the client.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sign-in|assets).*)"],
};
