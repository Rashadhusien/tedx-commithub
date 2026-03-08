import "next-auth";

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
}
