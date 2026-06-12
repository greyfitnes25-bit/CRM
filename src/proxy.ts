import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const isAuth = !!req.auth;
  const isAuthPage =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/register");

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (!isAuth) {
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }
    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/messages/:path*",
    "/leads/:path*",
    "/customers/:path*",
    "/products/:path*",
    "/quotes/:path*",
    "/sales/:path*",
    "/installations/:path*",
    "/team-map/:path*",
    "/warranties/:path*",
    "/returns/:path*",
    "/meta-ads/:path*",
    "/web-forms/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};
