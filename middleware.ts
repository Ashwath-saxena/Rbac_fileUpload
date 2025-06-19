// import { clerkMiddleware } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// // Removed invalid import of AuthObject

// // Define public routes
// const publicRoutes = [
//   "/",
//   "/auth/sign-in",
//   "/auth/sign-up",
//   "/api/uploadthing"
// ];

// // Define ignored routes
// const ignoredRoutes = [
//   "/api/uploadthing"
// ];

// export default clerkMiddleware(async (auth, req: NextRequest) => {
//   // Format current date/time in UTC
//   const now = new Date();
//   const formattedDate = now.toISOString()
//     .replace('T', ' ')
//     .replace(/\.\d+Z$/, '');

//   // Create headers
//   const headers = new Headers();
//   headers.set('X-Current-Time', formattedDate);
//   headers.set('X-User-Login', (await auth()).userId || 'anonymous');

//   // Check if the route is public
//   const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);
//   const isIgnoredRoute = ignoredRoutes.includes(req.nextUrl.pathname);

//   // If it's an ignored route, proceed without auth
//   if (isIgnoredRoute) {
//     return NextResponse.next({
//       headers: headers,
//     });
//   }

//   // Get authentication data
//   const authData = await auth();

//   // If user is not signed in and trying to access protected route
//   if (!authData.userId && !isPublicRoute) {
//     const signInUrl = new URL('/auth/sign-in', req.url);
//     signInUrl.searchParams.set('redirect_url', req.url);
//     return NextResponse.redirect(signInUrl);
//   }

//   // If signed in user tries to access auth pages
//   if (authData.userId && req.nextUrl.pathname.startsWith('/auth')) {
//     const dashboardUrl = new URL('/dashboard', req.url);
//     return NextResponse.redirect(dashboardUrl);
//   }

//   // Add headers to response
//   return NextResponse.next({
//     headers: headers,
//   });
// });

// export const config = {
//   matcher: [
//     // Skip all internal paths (_next, assets, api)
//     '/((?!_next|assets|api|.*\\..*).*)',
//     // Include all API routes
//     '/(api|trpc)(.*)'
//   ],
// };

import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public and ignored routes as before
const publicRoutes = ["/", "/auth/sign-in", "/auth/sign-up", "/api/uploadthing"];
const ignoredRoutes = ["/api/uploadthing"];

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const now = new Date();
  const formattedDate = now.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
  const headers = new Headers();
  headers.set('X-Current-Time', formattedDate);

  const authData = await auth();
  const userId = authData.userId;
  headers.set('X-User-Login', userId || 'anonymous');

  // Ignore certain routes for auth
  if (ignoredRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.next({ headers });
  }

  // Unauthenticated users on protected routes
  if (!userId && !publicRoutes.includes(req.nextUrl.pathname)) {
    const signInUrl = new URL('/auth/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect signed-in users away from auth pages
  if (userId && req.nextUrl.pathname.startsWith('/auth')) {
    const dashboardUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Optionally: Add Clerk role/claims from session (if you store them there)
  // Example: headers.set('X-User-Role', authData.sessionClaims?.role || '');

  return NextResponse.next({ headers });
});

export const config = {
  matcher: [
    '/((?!_next|assets|api|.*\\..*).*)',
    '/(api|trpc)(.*)'
  ],
};