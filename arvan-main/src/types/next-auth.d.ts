// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      image?: string;
      email: string;
      mobile_no: string;
      role: "ADMIN" | "USER";
    };
  }
}
