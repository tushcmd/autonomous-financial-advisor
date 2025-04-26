import { NextResponse } from "next/server";
import { auth } from "./auth";
import { getToken } from "next-auth/jwt";

export default auth(async (req) => {
  const token = await getToken({ req });
  const session = token ? { user: token } : null;

  // Debugging log to verify token data
  console.log("Token data:", token);

  // Get the pathname from the request
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  // Public routes that don't require redirection
  const isPublicRoute =
    pathname === "/" ||
    pathname === "/login" ||
    pathname.startsWith("/api/") ||
    pathname.includes("_next") ||
    pathname.includes("favicon");

  // Check if this is the onboarding route
  const isOnboardingRoute = pathname === "/onboarding";

  // If user is authenticated
  if (session) {
    console.log("Middleware session data:", session);
    const hasCompletedOnboarding = session.user?.hasCompletedOnboarding;

    // Ensure proper redirection to onboarding
    if (
      hasCompletedOnboarding === false &&
      !isOnboardingRoute &&
      !pathname.startsWith("/api/")
    ) {
      return NextResponse.redirect(new URL("/onboarding", nextUrl));
    }

    // User is authenticated and has completed onboarding
    if (
      (pathname === "/login" || isOnboardingRoute) &&
      hasCompletedOnboarding
    ) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  } else {
    // User is not authenticated
    // If trying to access protected routes, redirect to login
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
});

export const config = {
  // Matcher for all routes except static files, images, and other assets
  matcher: ["/((?!_next/static|_next/image|images|favicon.ico).*)"],
};
