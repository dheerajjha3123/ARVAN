import NextAuth from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma-client";
import authConfig from "./auth.config";


export const { handlers: { GET, POST }, signIn, signOut, auth } = NextAuth({
    session:{
        strategy:"jwt"
    },
    adapter: PrismaAdapter(prisma),  // Type assertion to bypass version mismatch
    ...authConfig
});