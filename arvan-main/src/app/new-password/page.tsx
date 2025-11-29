"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/axiosClient";

const ResetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const NewPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [hasValidToken, setHasValidToken] = useState(false);

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing token");
      router.push("/forgot-password");
    } else {
      setHasValidToken(true);
    }
  }, [token, router]);

  const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
    if (!hasValidToken || !token) {
      toast.error("Invalid or missing token - cannot update password");
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiClient.post("/api/customers/reset-password", {
        password: values.password,
        token,
      });

      if (response.status === 200) {
        toast.success("Password updated successfully. Please sign in.");
        router.push("/signin");
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (error: any) {
      console.error(error);
      const message =
        error?.response?.data?.message || "Failed to reset password";
      toast.error(message);
      if (message === "Invalid token") {
        router.push("/forgot-password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return null; // Or loading spinner till redirect
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 rounded-md shadow-md mt-10 text-white">
      <h2 className="text-center text-2xl font-bold mb-6">
        Reset Your Password
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="New Password"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm New Password"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-lime-400 text-black font-bold rounded-md p-3 hover:bg-lime-500 transition"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewPasswordPage;
