import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, account }) {
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
        } catch {
          // DB hatası login'i engellesin
          token.id = user.id;
          token.role = "USER";
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
