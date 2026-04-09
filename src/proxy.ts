import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedPaths = ["/hesabim", "/siparisler", "/odeme"];
const adminPaths = ["/admin"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  // Admin koruması
  if (adminPaths.some((p) => pathname.startsWith(p))) {
    if (!token) {
      return NextResponse.redirect(new URL("/giris", request.url));
    }
    // Role kontrolü API'de yapılır (DB gerektirdiği için burada değil)
    return NextResponse.next();
  }

  // Kullanıcı koruması
  if (protectedPaths.some((p) => pathname.startsWith(p))) {
    if (!token) {
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
