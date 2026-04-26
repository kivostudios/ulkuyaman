import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Edge Runtime uyumlu — Prisma adapter YOK
export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/giris",
    error: "/giris",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected =
        nextUrl.pathname.startsWith("/hesabim") ||
        nextUrl.pathname.startsWith("/siparisler") ||
        nextUrl.pathname.startsWith("/odeme") ||
        nextUrl.pathname.startsWith("/admin");
      if (isProtected && !isLoggedIn) {
        const loginUrl = new URL("/giris", nextUrl);
        loginUrl.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search);
        return Response.redirect(loginUrl);
      }
      return true;
    },
  },
};
