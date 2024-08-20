import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connecttoDB } from "../../../../../mongoose";
import User from "../../../../../modals/User";
import { compare } from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",

      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          throw new Error("Invalid email or password");
        }
        await connecttoDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isMatch = await compare(credentials.password, user.password);
        console.log("isMatch", isMatch);

        if (!isMatch) {
          throw new Error("Invaid password");
        }

        return user;
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session }) {
      const mongodbUser = await User.findOne({ email: session.user.email });
      console.log("mongodbUser", mongodbUser);

      // Check if the user was found in the database
      if (!mongodbUser) {
        // If no user is found, log a warning and return the session as-is
        console.warn("User not found in the database:", session.user.email);
        return session;
      }

      console.log("Before merge - session.user:", session.user);
      session.user.id = mongodbUser._id.toString();
      session.user = { ...session.user, ...mongodbUser._doc };
      console.log("After merge - session.user:", session.user);
      return session;
    },
  },
});

export { handler as GET, handler as POST };
