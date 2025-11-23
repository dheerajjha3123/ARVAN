/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AuthLayout from "@/components/AuthLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForgotPassword } from "@/app/forgot-password/hooks/hooks";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useState } from "react";
import styles from "@/components/Sections/PhoneInput.module.css";


// Define a simple schema for the mobile number field
const ForgotPasswordSchema = z.object({
  mobileNumber: z
      .string()
      .min(1, "Mobile number is required"),
});

const ForgotPassword = () => {
  const router = useRouter();
  const { mutate } = useForgotPassword();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      mobileNumber: "",
    }
  });

  async function handleSubmit(values: z.infer<typeof ForgotPasswordSchema>) {
    try {
      setIsLoading(true);
      // Handle the forgot password logic (e.g., sending an OTP)
      mutate(values.mobileNumber, {
        onSuccess: (data: any) => {
          toast.success("An OTP was sent to your WhatsApp");
          // Navigate to the OTP screen with the JWT token
          router.push(`/otp/${data.jwt}`);
        },
        onError: (error) => {
          toast.error(error.message);
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-1">
          Forgot Password?
        </h1>
        <p className="text-gray-400 text-lg sm:text-xl">
          Enter Your Mobile Number
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormControl>
                  <div className={` ${styles.phoneContainer} rounded-xl border-2 border-lime-400 bg-gradient-to-r from-[#2e470fb4] via-[#3a5b0bc9] to-[#3a5b0b49] `}>
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

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full p-3 text-black font-bold text-lg sm:text-xl rounded-xl bg-lime-400 shadow-[0_4px_20px_rgba(255,255,255,0.6)] hover:bg-lime-500"
          >
            Send OTP
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default ForgotPassword;
