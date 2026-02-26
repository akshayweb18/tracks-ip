import { NextResponse } from "next/server";

export function middleware(request) {
  const isAdmin = request.cookies.get("isAdmin");

  if (!isAdmin && request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};