import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/app/lib/db";
import { User } from "@/app/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      await connectDB();

      let dbUser = await User.findOne({ email: user.email });

      if (!dbUser) {
        dbUser = await User.create({
          name: user.name,
          email: user.email,
          googleId: user.id,
          profileImage: user.image,
          turftapPoints: 0,
        });
      }

      return true;
    },
    async session({ session }) {
      await connectDB();
      const dbUser = await User.findOne({ email: session.user.email });

      if (dbUser) {
        session.user.id = dbUser._id.toString();
        session.user.turftapPoints = dbUser.turftapPoints;
      }

      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
