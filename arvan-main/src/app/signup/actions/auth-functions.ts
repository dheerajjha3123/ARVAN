/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { signOut } from "@/auth";

import { SignUpSchema } from "@/types/types";
import { z } from "zod";
import prisma from "@/lib/prisma-client";
import bcryptjs from "bcryptjs";
import { apiClient } from "@/lib/axiosClient";





export async function handleSignOut() {
  await signOut();
}

export async function handleSignup(data: z.infer<typeof SignUpSchema>) {
    try {
  
      const existingUser = await prisma.user.findUnique({
        where: { mobile_no: data.mobileNumber },
      });
  
      if (existingUser) {
        return { error: "User already exists" };
      }
  
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(data.password, salt);
  
      const response = await prisma.user.create({
        data: {
            name: data.name,
          mobile_no: data.mobileNumber,
          password: hashedPassword,
        },
      });
  
      const otpResponse = await apiClient.post("/api/customers/otp", { mobile_no: response.mobile_no, type: "verify" });
     
      
      
      return {  jwt: otpResponse.data.jwt };
    } catch (error: any) {
      console.error(error);
      return { error: error.message || "Something went wrong" };
    }
  }
