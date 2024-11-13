import clientPromise from "@/lib/mongoConnect";
// import {UserInfo} from "@/models/UserInfo";
import bcrypt from "bcrypt";
import * as mongoose from "mongoose";
import {User} from '@/models/User';
import NextAuth, {getServerSession} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      id: 'credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const email = credentials?.email;
        const password = credentials?.password;

        try {
          await mongoose.connect(process.env.MONGO_URL);
          const user = await User.findOne({email});
          const passwordOk = user && bcrypt.compareSync(password, user.password);

          if (passwordOk) {
            return {
              id: user._id.toString(),
              email: user.email,
              // Add any other user data you want in the session
            };
          }
        } catch (error) {
          console.error('Auth error:', error);
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({session, token}) {
      if (token?.user) {
        session.user = token.user;
      }
      return session;
    },
  },
} as const;

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }

/*
Code Explanation:

1. File Purpose:
   This is a NextAuth.js configuration file that sets up authentication for the application.

2. Main Components:
   - Imports: Includes necessary dependencies for MongoDB, bcrypt, NextAuth, and authentication providers
   - authOptions: Main configuration object for NextAuth
   - Providers: Two authentication methods are configured:
     a) Google OAuth
     b) Email/Password (Credentials)

3. Authentication Flow:
   - For Google: Uses OAuth 2.0 with provided client credentials
   - For Credentials:
     * User submits email/password
     * System connects to MongoDB
     * Looks up user by email
     * Verifies password using bcrypt
     * Returns user object if authenticated

4. Data Storage:
   - Uses MongoDB adapter for session storage
   - Connects to MongoDB for user data
   - Securely handles passwords with bcrypt

5. API Routes:
   - Creates handler using NextAuth(authOptions)
   - Exports as both GET and POST methods
   - Available at /api/auth/* endpoints

6. Security Features:
   - JWT signing with secret key
   - Secure password comparison
   - OAuth integration
   - Session management
*/