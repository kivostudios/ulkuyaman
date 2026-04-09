export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/hesabim/:path*", "/siparisler/:path*", "/odeme/:path*"],
};
