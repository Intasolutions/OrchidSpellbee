import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

  if (isMaintenanceMode) {
    const { pathname } = request.nextUrl;

    // Check if the request path should be excluded from maintenance redirect
    // We allow static assets, images, API requests, /maintenance itself, and /admin (so admin controls are accessible)
    const shouldExclude =
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/maintenance") ||
      pathname.startsWith("/img") ||
      pathname.includes(".") || // matches static files with extensions (e.g. .png, .jpg)
      pathname === "/favicon.ico";

    if (!shouldExclude) {
      // Rewrite to the maintenance page internally so the URL in the browser bar stays clean
      return NextResponse.rewrite(new URL("/maintenance", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all paths except standard static assets and APIs
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
