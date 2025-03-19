import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      turftapPoints: number;
      role : 'admin' | 'user';
    } & DefaultSession["user"];
  }
}
