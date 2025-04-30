import { UserRole } from "@prisma/client";
import { User } from "next-auth";

export type ExtendedUser = User & {
  role: UserRole;
  hasCompletedOnboarding?: boolean;
};

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    hasCompletedOnboarding: boolean;
  }
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser & {
      hasCompletedOnboarding: boolean;
    };
  }
}
