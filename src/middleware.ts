import { NextResponse, type NextRequest } from "next/server";
import { isAuthenticated } from "@/utils/auth";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname; // Get the current path

  // Protect admin routes
  if (path.startsWith("/admin")) {
    const authenticated = await isAuthenticated(); // Check if the user is authenticated

    // Redirect authenticated users away from the login page
    if (path.startsWith("/admin/login")) {
      if (authenticated) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }

    // Redirect unauthenticated users to the login page
    else if (!authenticated) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Allow the request to proceed if no conditions are met
  return NextResponse.next();
}

// Specify the paths the middleware should run on
export const config = {
  matcher: ["/admin/:path*"], // Match all paths under /admin
};
