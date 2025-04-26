import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
// import { UserRole } from "@prisma/client";
import NextAuth from "next-auth";

import { prisma } from "@/lib/db";
import { getUserById } from "@/lib/user";
import { seedPortfolios } from "@/lib/seedPortfolios";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async session({ token, session }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;

          try {
            const portfolio = await prisma.portfolio.findFirst({
              where: { userId: token.sub },
              select: { id: true, hasCompletedOnboarding: true },
            });

            if (!portfolio) {
              await seedPortfolios(token.sub);
              session.user.hasCompletedOnboarding = false;
            } else {
              session.user.hasCompletedOnboarding =
                !!portfolio.hasCompletedOnboarding;
            }
          } catch (error) {
            console.error(
              "Failed to seed portfolios or check onboarding status:",
              error,
            );
            session.user.hasCompletedOnboarding = false;
          }
        }

        // Ensure the `hasCompletedOnboarding` property is correctly passed
        session.user.hasCompletedOnboarding =
          token.hasCompletedOnboarding === true;

        session.user.name = token.name;
        session.user.image = token.picture;
      }

      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const dbUser = await getUserById(token.sub);

      if (!dbUser) return token;

      const portfolio = await prisma.portfolio.findFirst({
        where: { userId: token.sub },
        select: { hasCompletedOnboarding: true },
      });

      token.name = dbUser.name;
      token.email = dbUser.email;
      token.picture = dbUser.image;
      token.role = dbUser.role;
      token.hasCompletedOnboarding = portfolio?.hasCompletedOnboarding || false;

      return token;
    },
  },
  ...authConfig,
});
