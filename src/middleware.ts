import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isApiAuthRoute = pathname.startsWith("/api/auth");
  const isStaticAsset =
    /^\/(space|social|icons|images|branding|_next)\//.test(pathname) ||
    /\.(png|jpg|jpeg|gif|svg|webp|avif|ico|woff|woff2)$/.test(pathname);

  if (isApiAuthRoute || isStaticAsset) {
    return NextResponse.next();
  }

  // NextAuth v5 (beta) uses "authjs." prefix, not "next-auth." prefix.
  // On Vercel/HTTPS the cookie is prefixed with __Secure-.
  const secureCookie = !!process.env.VERCEL || req.nextUrl.protocol === "https:";
  const cookieName = secureCookie
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName,
  });

  const isLoggedIn = !!token;

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", origin));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico).*)",
  ],
};
