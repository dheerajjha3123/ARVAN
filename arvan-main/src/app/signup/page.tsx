"use client";

import AuthLayout from "@/components/AuthLayout";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SignUpSchema } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { handleSignup } from "./actions/auth-functions";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useState } from "react";
import styles from "@/components/Sections/PhoneInput.module.css";
// Define the form schema with Zod

const SignUp = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize react-hook-form with Zod resolver
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Form submission handler
  async function onSubmit(values: z.infer<typeof SignUpSchema>) {
    try {
      setIsLoading(true);
      const promise = handleSignup(values);

      toast.promise(promise, {
        loading: "Signing up...", // Show while waiting
        success: (response) => {
          if (response?.error) {
            throw new Error(response.error); // Throw error to trigger rejection
          }
          return "Verify Mobile Number"; // Success message
        },
        error: (error) => error.message || "Something went wrong", // Show on error
      });
      const response = await promise;

      if (response.jwt) {
        router.push(`/otp/${response.jwt}`); // Redirect if signup is successful
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <AuthLayout>
      <>
        <div className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-1">
            Create Account
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl">Welcome to Arvan</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-transparent space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="rounded-xl border-2 border-lime-400 bg-gradient-to-r from-[#2e470fb4] via-[#3a5b0bc9] to-[#3a5b0b49]">
                      <Input
                        placeholder="Full Name"
                        className="w-full p-4 sm:p-5 text-white bg-transparent border-0 rounded-xl outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-sm ml-2" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormControl>
                    <div
                      className={`${styles.phoneContainer}rounded-xl border-2 border-lime-400 bg-gradient-to-r from-[#2e470fb4] via-[#3a5b0bc9] to-[#3a5b0b49]`}>
                      <PhoneInput
                        country={"in"}
                        value={field.value}
                        onChange={(phone) => onChange(phone)}
                        disabled={isLoading}
                        inputClass="!w-full !p-5 !px-10 !sm:p-5 !text-white !bg-transparent !border-0 !rounded-xl !outline-none !ring-0"
                        containerClass="!bg-transparent"
                        buttonClass="!bg-transparent !border-0"
                        dropdownClass="!bg-[#1a1a1a] !text-white text-black"
                        searchClass="!bg-[#1a1a1a] !text-white"
                        inputProps={{
                          required: true,
                          placeholder: "Mobile Number",
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-sm ml-2" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="rounded-xl border-2 border-lime-400 bg-gradient-to-r from-[#2e470fb4] via-[#3a5b0bc9] to-[#3a5b0b49]">
                      <Input
                        type="password"
                        placeholder="Password"
                        disabled={isLoading}
                        className="w-full p-4 sm:p-5 text-white bg-transparent border-0 rounded-xl outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-sm ml-2" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="rounded-xl border-2 border-lime-400 bg-gradient-to-r from-[#2e470fb4] via-[#3a5b0bc9] to-[#3a5b0b49]">
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        disabled={isLoading}
                        className="w-full p-4 sm:p-5 text-white bg-transparent border-0 rounded-xl outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-sm ml-2" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="relative w-full p-3 text-black font-bold text-lg sm:text-xl rounded-xl bg-lime-400 shadow-[0_4px_20px_rgba(255,255,255,0.6)] hover:bg-lime-500 mt-4">
              Sign Up
            </Button>
          </form>
        </Form>

        <div className="text-center mt-6 text-sm text-lime-400">
          Already have an account?{"  "}
          <Button
            variant="link"
            className="text-gray-400 font-bold p-0"
            onClick={() => router.push("/signin")}>
            Login
          </Button>
        </div>
      </>
    </AuthLayout>
  );
};

export default SignUp;
