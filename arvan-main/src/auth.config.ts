/* eslint-disable @typescript-eslint/no-explicit-any */
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/types/types";
import prisma from "@/lib/prisma-client";
import { CredentialsSignin } from "next-auth";
import { NextAuthConfig } from "next-auth";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";



function verifyToken(token: string) {
  try {
    const verified = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    console.log('Token verification result:', verified);
    return verified;
  } catch (err) {
    console.error('Token verification failed:', err);
    return null;
  }
}

export default {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        mobileNumber: { label: "Mobile Number", type: "text" },
        password: { label: "Password", type: "password", optional: true },
        token: { label: "OTP Token", type: "text", optional: true },      },
      authorize: async (credentials: any) => {
        console.log('Authorize called with credentials:', credentials);
        const { mobileNumber, password, token } = credentials;

        // ✅ OTP-based login
        if (token) {
          console.log('Attempting OTP-based login with token:', token);
          const decoded: any = verifyToken(token);
          console.log('Decoded token:', decoded);

          if (!decoded || !decoded.mobile_no || decoded.type !== "login") {
            console.error('Invalid token detected:', { decoded });
            throw new CredentialsSignin({ cause: "Invalid or expired OTP token" });
          }

          const user = await prisma.user.findUnique({
            where: { mobile_no: decoded.mobile_no },
          });
          console.log('User found from OTP:', user);

          if (!user) {
            console.error('User not found for mobile:', decoded.mobile_no);
            throw new CredentialsSignin({ cause: "User not found" });
          }

          return user;
        }

        // ✅ Password-based login
        console.log('Attempting password-based login for:', mobileNumber);
        const { data, success } = LoginSchema.safeParse({
          mobileNumber,
          password,
        });
        console.log('Schema validation result:', { success, data });

        if (!success) {
          console.error('Schema validation failed');
          throw new CredentialsSignin({ cause: "Required fields missing" });
        }

        const user = await prisma.user.findUnique({
          where: { mobile_no: data.mobileNumber },
        });
        console.log('User found from password login:', user);

        if (!user) {
          console.error('User not found for mobile:', data.mobileNumber);
          throw new CredentialsSignin({
            cause: "Invalid credentials or user not found",
          });
        }

        if (!user.password) {
          console.error('User has no password set:', data.mobileNumber);
          throw new CredentialsSignin({
            cause: "User signed up with social media or OTP",
          });
        }

        const isPasswordValid = await bcryptjs.compare(data.password, user.password);
        console.log('Password validation result:', isPasswordValid);

        if (!isPasswordValid) {
          console.error('Invalid password for user:', data.mobileNumber);
          throw new CredentialsSignin({
            cause: "Invalid credentials or user not found",
          });
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      console.log('JWT Callback:', { token, user });
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.picture = user.image;
        token.mobile_no = user.mobile_no;
        // Override role to ADMIN if mobile_no is in ADMIN_NUMBERS env var
        const adminNumbersEnv: string | undefined = process.env.ADMIN_NUMBERS;
        const adminNumbers = adminNumbersEnv ? adminNumbersEnv.split(',').map(s => s.trim()) : [];
        if (adminNumbers.includes(user.mobile_no)) {
          token.role = "ADMIN";
        } else {
          token.role = user.role;
        }
      }
      console.log('Updated token:', token);
      return token;
    },

    async session({ session, token }: any) {
      console.log('Session Callback:', { session, token });
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.mobile_no = token.mobile_no;
        session.user.role = token.role as "admin" | "user";
      }
      console.log('Updated session:', session);
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;