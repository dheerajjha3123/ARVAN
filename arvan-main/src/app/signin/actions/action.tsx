"use server"
import { CredentialsSignin } from "next-auth";
import { LoginSchema } from "@/types/types";
import { signIn } from "@/auth";
import z from "zod"
export async function loginFunction(data: z.infer<typeof LoginSchema>) {
  try {
    await signIn("credentials", {
      mobileNumber: data.mobileNumber,
      password: data.password,
      redirect: false, // Prevent automatic redirection
    });


    return "Login successful";
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return error.cause;
    } else {
      return "Login failed";
    }
  }
}
