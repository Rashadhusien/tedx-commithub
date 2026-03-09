import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      committeeId: string | null;
      points: number;
      name: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    role: string;
    committeeId: string | null;
    points: number;
    name: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    name: string;
    committeeId: string | null;
    points: number;
  }
}
