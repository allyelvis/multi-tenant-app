import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { decryptData } from "./lib/encryption"

export async function middleware(request: NextRequest) {
  // Skip auth for public routes
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api/public") ||
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/register" ||
    request.nextUrl.pathname === "/"
  ) {
    return NextResponse.next()
  }

  // Check for session
  const session = request.cookies.get("session")?.value

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    // Verify session
    const sessionData = JSON.parse(decryptData(session))

    if (!sessionData.user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // For dashboard routes, ensure tenant is selected
    if (
      request.nextUrl.pathname.startsWith("/dashboard") &&
      !sessionData.tenant &&
      request.nextUrl.pathname !== "/dashboard/tenants"
    ) {
      return NextResponse.redirect(new URL("/dashboard/tenants", request.url))
    }

    // For API routes, set tenant context
    if (request.nextUrl.pathname.startsWith("/api/")) {
      const response = NextResponse.next()

      if (sessionData.tenant) {
        response.headers.set("x-tenant-id", sessionData.tenant.id)
      }

      return response
    }

    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

