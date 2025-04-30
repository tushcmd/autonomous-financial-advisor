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
    signIn: "/", // Default sign-in page
    error: "/auth/error", // Redirect to a custom error page
  },
  callbacks: {
    async session({ token, session }) {
      if (!token?.sub || !session.user) return session;

      // Ensure token.sub exists before assigning
      const userId = token.sub;
      session.user.id = userId;
      session.user.role = token.role;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.image = token.picture;

      try {
        const portfolio = await prisma.portfolio.findFirst({
          where: { userId },
          select: { id: true, hasCompletedOnboarding: true },
        });

        if (!portfolio) {
          await seedPortfolios(userId);
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

      return session;
    },

    async jwt({ token }) {
      const userId = token.sub;
      if (!userId) return token;

      const dbUser = await getUserById(userId);
      if (!dbUser) return token;

      const portfolio = await prisma.portfolio.findFirst({
        where: { userId },
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
