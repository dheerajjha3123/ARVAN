"use client";

import Image from "next/image";
import { apiClient } from "@/lib/axiosClient";
import { toast } from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import styles from "@/components/Sections/PhoneInput.module.css";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
} from "../ui/form";
import { Input } from "../ui/input";
import { Facebook, InstagramIcon, MailIcon } from "lucide-react";
import Link from "next/link";

// Define the type for the form data
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  mobile: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^(\+?\d{1,3})?\d{10}$/, "Invalid mobile number format"),
  message: z.string().min(1, "Message is required"),
});

export default function ContactForm() {
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      message: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof contactFormSchema>) => {
    try {
      await apiClient.post("/api/send", {
        ...data,
        phone: data.mobile,
      });
      toast.success("Message sent successfully!");
      form.reset();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 md:px-12 py-12 mb-10">
      <h2 className="contact text-xl sm:text-4xl md:text-5xl lg:text-6xl font-bold pb-6">
        Contact{" "}
        <span className="relative">
          Us
          <Image
            src="/Star.svg"
            width={40}
            height={40}
            alt="Star SVG"
            className="absolute -z-[10] -top-5 right-0 animate-[spin_3s_linear_infinite]"
          />
        </span>
      </h2>

      <div className="relative max-w-5xl p-6 sm:p-8 text-white flex flex-col md:flex-row">
        {/* Border for tablet and desktop - Increased scale only for md: */}
        <div className="absolute inset-0 z-0 hidden md:block md:scale-110 lg:scale-100">
          <Image
            src="/border.svg"
            alt="Border"
            width={1000}
            height={100}
            className="object-fill"
            priority
          />
        </div>
        {/* Border for mobile */}
        <div className="absolute inset-0 z-0 block md:hidden scale-105">
          <Image
            src="/border_mobile.svg"
            alt="Border"
            width={1000}
            height={100}
            className="object-fill scale-x-[1.2] scale-y-[1.25] sm:scale-y-[1.2]"
            priority
          />
        </div>
        <div className="absolute inset-0 z-0 opacity-50 md:opacity-70 blur-md scale-125 hidden md:block">
          <Image
            src="/background.svg"
            alt="Background"
            width={1000}
            height={100}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 z-0 opacity-50 md:opacity-70 blur-md block md:hidden">
          <Image
            src="/background_mobile.svg"
            alt="Background"
            width={1000}
            height={100}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row w-full pb-6 sm:p-4 md:p-6">
          {/* Left Side - Form */}
          <div className="relative md:w-1/2 p-4 sm:p-6 border-b md:border-b-0 md:border-r border-gray-700">
            <h2 className="text-lg sm:text-3xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
              ANY <span className="text-[#C2E53A]">QUERIES</span>
              <span className="text-white">?</span>
            </h2>
            <p className="text-gray-300 mt-2 text-[10px] sm:text-sm md:text-sm lg:text-base leading-relaxed">
              Got a question or need assistance? We&apos;re here to help!
            </p>
            <Form {...form}>
              <form
                className="mt-6 space-y-4 sm:space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Name"
                          className="w-full bg-transparent border-b border-gray-500 p-2 focus:outline-none text-sm sm:text-base md:text-sm lg:text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs mt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Email"
                          className="w-full bg-transparent border-b border-gray-500 p-2 focus:outline-none text-sm sm:text-base md:text-sm lg:text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs mt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field: { onChange, ...field } }) => (
                    <FormItem>
                      <FormControl>
                        <div className={styles.phoneContainer}>
                          <PhoneInput
                            country={"in"}
                            value={field.value}
                            onChange={(phone) => onChange(phone)}
                            inputClass="!w-full !p-5 !px-10 !sm:p-5 !border-b !text-white !bg-transparent !border-0  !outline-none !ring-0"
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
                      <FormMessage className="text-red-400 text-xs mt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <textarea
                          {...field}
                          placeholder="Message"
                          className="w-full bg-transparent border-b border-gray-500 p-2 focus:outline-none text-sm sm:text-base md:text-sm lg:text-base"
                          style={{ resize: "none" }}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs mt-1" />
                    </FormItem>
                  )}
                />

                <button
                  type="submit"
                  className="relative text-base sm:text-xl md:text-lg lg:text-xl font-light px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-[#c3e53a8a] to-[#b3d2343e] text-white uppercase shadow-[0px_0px_2px_#c3e53a] hover:shadow-[0px_0px_5px_#c3e53a] transition-all duration-300 mt-4 sm:mt-5 md:ml-10 lg:ml-0">
                  Submit
                </button>
              </form>
            </Form>
          </div>

          {/* Right Side - Contact Details */}
          <div className="relative w-full md:w-1/2 p-4 sm:p-6 pl-6 md:pl-10 lg:pl-16 flex flex-col justify-between">
            <h2 className="text-lg sm:text-3xl md:text-3xl lg:text-4xl font-bold text-right leading-tight mb-6">
              GET IN <span className="text-[#C2E53A]">TOUCH</span>
            </h2>

            <div className="flex flex-col space-y-8">
              {/* Email */}
              <div>
                <h3 className="text-[#C2E53A] font-semibold text-base sm:text-lg md:text-base lg:text-lg">
                  EMAIL
                </h3>
                <p className="text-gray-300 mt-2 text-[10px] sm:text-sm md:text-sm lg:text-base leading-relaxed">
                  Reach out to us via email for any inquiries, support, or
                  collaborations. We’re just a message away and
                  ready to assist you!
                </p>
              </div>

              {/* Wrapper for Follow Us and Phone No Sections */}
              <div className="flex flex-row md:flex-row lg:flex-col space-x-4 md:space-x-6 lg:space-x-0 lg:space-y-8">
                {/* Follow Us Section */}
                <div className="w-1/2 md:w-1/2 lg:w-full">
                  <h3 className="text-[#C2E53A] font-semibold text-base sm:text-lg md:text-base lg:text-lg">
                    FOLLOW US ON
                  </h3>
                  <div className="flex space-x-4 mt-4">
                    <Link href={"mailto:thearvan77@gmail.com"}>
                      <MailIcon className="text-white text-2xl sm:text-4xl md:text-3xl lg:text-4xl cursor-pointer" />
                    </Link>
                    <Link
                      href="https://www.instagram.com/thearvan.official?igsh=ZmlndGt0NGZ1bXF6"
                      target="_blank">
                      <InstagramIcon className="text-white text-2xl sm:text-4xl md:text-3xl lg:text-4xl cursor-pointer" />
                    </Link>
                    <Link href={"https://www.facebook.com"} target="_blank">
                      <Facebook className="text-white text-2xl sm:text-4xl md:text-3xl lg:text-4xl cursor-pointer" />
                    </Link>
                  </div>
                </div>

                {/* Phone No Section */}
                <div className="w-1/2 md:w-1/2 lg:w-full">
                  <h3 className="text-[#C2E53A] font-semibold text-base sm:text-lg md:text-base lg:text-lg">
                    PHONE NO.
                  </h3>
                  <p className="text-gray-300 mt-2 text-[10px] sm:text-sm md:text-sm lg:text-base leading-relaxed">
                    +91 7428637234
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[10px] sm:text-sm md:text-sm lg:text-base leading-relaxed mt-6 md:mb-5 hidden md:block">
              We’d love to hear from you! Whether you have questions, or just
              want to say hello, feel free to reach out.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
