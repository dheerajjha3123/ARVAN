/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AuthLayout from "@/components/AuthLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import styles from "@/components/Sections/PhoneInput.module.css";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginSchema } from "@/types/types";
import { loginFunction } from "./actions/action";
import toast from "react-hot-toast";
import { useSession, signIn } from "next-auth/react";
import { apiClient } from "@/lib/axiosClient";
import OTPInput from "@/components/OTPInput";

const Signin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<"password" | "otp">("password");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpJwt, setOtpJwt] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      mobileNumber: "",
      password: "",
    },
  });

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (session?.user) {
    router.push("/profile");
  }

  const startResendTimer = () => {
    setIsResendDisabled(true);
    setTimer(90);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled, timer]);

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;

  async function onSubmitPassword(values: z.infer<typeof LoginSchema>) {
    try {
      setIsLoading(true);
      const data: any = await loginFunction(values);
      if (data === "Login successful") {
        toast.success("Login successful");
        setTimeout(() => {
          router.refresh();
        }, 500);
        router.push("/");
      } else {
        toast.error(data);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  }

  const sendOtp = async () => {
    const mobile = form.getValues("mobileNumber");
    if (!mobile) {
      return toast.error("Enter a valid mobile number");
    }

    try {
      setIsLoading(true);
      const res = await apiClient.post("/api/customers/otp", {
        mobile_no: mobile,
        type: "verify",
      });

      if (res.status === 202) {
        toast.error(res.data.message);
        return;
      }

      if (res.data.jwt) {
        setOtpJwt(res.data.jwt);
      }

      toast.success("OTP sent via WhatsApp");
      setOtpSent(true);
      startResendTimer();
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otpJwt) {
      toast.error("Session expired. Please request a new OTP.");
      return;
    }

    try {
      setIsVerifying(true);
      const res = await apiClient.post("/api/customers/verify-otp", {
        otp: otp.join(""),
        jwt: otpJwt,
      });

      if (res.status !== 200) {
        toast.error(res.data.message);
        return;
      }

      const loginJwt = res.data.jwt;
      const result = await signIn("credentials", {
        token: loginJwt,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Login failed");
      } else {
        toast.success("Login successful");
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Invalid OTP or session expired");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <AuthLayout>
      <>
        <div className="mb-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-1">Hello User</h1>
          <p className="text-gray-400 text-lg sm:text-xl">
            Welcome Back to Arvan
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <Button
            variant={authMethod === "password" ? "default" : "outline"}
            onClick={() => setAuthMethod("password")}
          >
            Password Login
          </Button>
          <Button
            variant={authMethod === "otp" ? "default" : "outline"}
            onClick={() => setAuthMethod("otp")}
          >
            OTP Login
          </Button>
        </div>

        <Form {...form}>
          <form
            onSubmit={
              authMethod === "password"
                ? form.handleSubmit(onSubmitPassword)
                : (e) => {
                    e.preventDefault();
                    if (otpSent) {
                      verifyOtp();
                    } else {
                      sendOtp();
                    }
                  }
            }
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormControl>
                    <div
                      className={`${styles.phoneContainer} rounded-xl border-2 border-lime-400 bg-gradient-to-r from-[#2e470fb4] via-[#3a5b0bc9] to-[#3a5b0b49]`}
                    >
                      <PhoneInput
                        country={"in"}
                        value={field.value}
                        onChange={(phone) => onChange(phone)}
                        disabled={isLoading || isVerifying}
                        inputClass="!w-full !p-5 !px-10 !text-white !bg-transparent !border-0 !rounded-xl !outline-none !ring-0"
                        containerClass="!bg-transparent"
                        buttonClass="!bg-transparent !border-0"
                        dropdownClass="!bg-[#1a1a1a] !text-white"
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

            {authMethod === "password" && (
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
                          className="w-full p-4 text-white bg-transparent border-0 rounded-xl outline-none"
                          disabled={isLoading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-sm ml-2" />
                  </FormItem>
                )}
              />
            )}

            {authMethod === "password" && (
              <div className="text-end mt-2">
                <Link
                  href="/forgot-password"
                  className="text-sm text-lime-400"
                >
                  Forget Password?
                </Link>
              </div>
            )}

            {authMethod === "otp" && otpSent && (
              <div>
                <OTPInput otp={otp} onChangeOtp={setOtp} />
                <div className="text-sm text-center mt-2">
                  {isResendDisabled ? (
                    <p className="text-gray-400">
                      Resend OTP in{" "}
                      <span className="text-lime-400 font-medium">
                        {formatTime(timer)}
                      </span>
                    </p>
                  ) : (
                    <Button
                      variant="link"
                      onClick={sendOtp}
                      className="text-lime-400 hover:text-lime-500"
                    >
                      Resend OTP
                    </Button>
                  )}
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full p-3 text-black font-bold text-lg rounded-xl bg-lime-400 shadow-[0_4px_20px_rgba(255,255,255,0.6)] hover:bg-lime-500"
              disabled={isLoading || isVerifying}
            >
              {authMethod === "otp"
                ? otpSent
                  ? isVerifying
                    ? "Verifying..."
                    : "Verify OTP"
                  : isLoading
                  ? "Sending OTP..."
                  : "Send OTP"
                : isLoading
                ? "Logging in..."
                : "Login"}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-6 text-sm text-lime-400">
          Don{"'"}t have an account?
          <Button
            variant="link"
            className="text-gray-400 font-bold p-0"
            type="button"
            onClick={() => router.push("/signup")}
            disabled={isLoading}
          >
            Sign Up
          </Button>
        </div>
      </>
    </AuthLayout>
  );
};

export default Signin;
