import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin")) {
    // NOTE: Replace with real session/auth check. For demo, allow only admin email via header.
    const email = req.headers.get("x-demo-email");
    if (email !== "admin@skillup.study") return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}
