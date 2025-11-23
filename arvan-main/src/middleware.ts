/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import authConfig from "./auth.config";
import NextAuth from "next-auth";

const publicRoutes = ["/", "/contact", "/product", "/about", "/shop","/privacy-policy"];
const authRoutes = [
  "/signin",
  "/signup",
  "/otp",
  "/new-password",
  "/forgot-password",
];

const { auth } = NextAuth(authConfig);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = (await auth()) as any;

  if(publicRoutes.includes(pathname) || pathname.startsWith("/product") || pathname.startsWith("/api/product") ){
    return NextResponse.next();
  }

  if (pathname.startsWith("/backend")) {
    const isProd = process.env.NODE_ENV === "production";
    const cookieName = isProd
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";
    const api_url = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!api_url) {
      return NextResponse.next();
    }

    const forwardedPath = pathname.replace("/backend", "");
    const url = new URL(api_url + forwardedPath + req.nextUrl.search);

    const token = req.cookies.get(cookieName)?.value;

    const requestHeaders = new Headers(req.headers);
    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }

    return NextResponse.rewrite(url, {
      headers: requestHeaders,
    });
  }

  /** 🔹 Handle Admin Routes */
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
    if (session.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  /** 🔹 Handle Auth Routes */
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (session) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  /** 🔹 Redirect Unauthenticated Users from Non-Public & Non-Auth Routes */
  if (
    !publicRoutes.includes(pathname) &&
    !authRoutes.some((route) => pathname.startsWith(route)) &&
    !session &&
    !pathname.startsWith("/product")
  ) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}

// Ensure middleware runs on relevant routes
export const config = {
  matcher: [
    "/((?!_next|api/auth|.*\\.(?:png|jpg|jpeg|svg|js|css|woff2?|ico|json|webmanifest)).*)",
    "/backend/(.*)",
    "/admin/(.*)",
    "/signin",
    "/signup",
    "/otp",
    "/new-password",
    "/forgot-password",
  ],
};