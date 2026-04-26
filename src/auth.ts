import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, account, trigger }) {
      // İlk giriş: Google'dan kullanıcı bilgisi gelir
      if (user && account?.provider === "google") {
        try {
          const dbUser = await prisma.user.upsert({
            where: { email: user.email! },
            update: { name: user.name, image: user.image },
            create: {
              email: user.email!,
              name: user.name,
              image: user.image,
            },
            select: { id: true, role: true },
          });
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.roleCheckedAt = Date.now();
        } catch {
          token.id = user.id;
          token.role = "USER";
          token.roleCheckedAt = Date.now();
        }
      }

      // Role yenileme: token üzerindeki role bayatlamış olabilir
      // (ör. kullanıcı sonradan ADMIN yapıldı). 5 dakikada bir tazele.
      const FIVE_MIN = 5 * 60 * 1000;
      const last = (token.roleCheckedAt as number | undefined) ?? 0;
      const isStale = trigger === "update" || Date.now() - last > FIVE_MIN;
      if (token.id && isStale) {
        try {
          const fresh = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true },
          });
          if (fresh) token.role = fresh.role;
          token.roleCheckedAt = Date.now();
        } catch {
          // DB erişilemiyor: eski role'le devam et
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      (session.user as { role?: string }).role = (token.role as string) ?? "USER";
      return session;
    },
  },
});
