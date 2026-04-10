import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/hesabim", "/siparisler", "/odeme"];
const adminPaths = ["/admin"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // PrismaAdapter database sessions kullandığı için JWT değil,
  // session cookie varlığını kontrol ediyoruz.
  // (Gerçek doğrulama server-side auth() ile yapılır)
  const sessionToken =
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("authjs.session-token")?.value;

  const isLoggedIn = !!sessionToken;

  // Admin koruması
  if (adminPaths.some((p) => pathname.startsWith(p))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/giris", request.url));
    }
    return NextResponse.next();
  }

  // Kullanıcı koruması
  if (protectedPaths.some((p) => pathname.startsWith(p))) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/giris", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/hesabim/:path*", "/siparisler/:path*", "/odeme/:path*", "/admin/:path*"],
};
