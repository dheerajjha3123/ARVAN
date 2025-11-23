"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";

import { useAddAddress } from "../profile/hooks/hooks";

// Schema
const addressSchema = z.object({
  name: z.string().min(2, { message: "Full name is required" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  street: z.string().min(3, { message: "Street address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  country: z.string().min(2, { message: "Country is required" }),
  zipCode: z.string().min(6, { message: "Valid zip code is required" }),
});

type AddressFormValues = z.infer<typeof addressSchema>;

export default function AddAddressForm() {
  const router = useRouter();
  const { mutate, isPending } = useAddAddress();

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
  });

  const onSubmit = (data: AddressFormValues) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Address added successfully");
        router.back();
      },
    });
  };

  const handleCancel = () => {
    router.push("/checkout");
  };

  const handleBack = () => {
    router.push("/");
  };

  // 🔁 Auto-fill based on PINCODE
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "zipCode" && value.zipCode?.length === 6) {
        fetch(`https://api.postalpincode.in/pincode/${value.zipCode}`)
          .then((res) => res.json())
          .then((data) => {
            const postOffice = data?.[0]?.PostOffice?.[0];
            if (postOffice) {
              form.setValue("city", postOffice.Block || postOffice.Taluk || "");
              form.setValue("state", postOffice.State || "");
              form.setValue("country", postOffice.Country || "India");
            } else {
              toast.error("Invalid pincode. Please check.");
            }
          })
          .catch(() => {
            toast.error("Failed to fetch address from pincode.");
          });
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden py-5">
      <div className="absolute w-[80vw] h-[40vw] rounded-full bg-lime-500/15 blur-3xl left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10"></div>

      <Button
        onClick={handleBack}
        className="relative ml-4 bg-lime-400 text-black font-bold py-1 px-4 rounded hover:bg-lime-500"
      >
        Back
      </Button>

      <div className="w-full px-4 sm:px-10 flex flex-col relative z-10 mt-6 sm:mt-10">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 text-white">
          ADD YOUR ADDRESS
        </h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-transparent w-full sm:w-[90vw] md:w-[85vw] px-4 sm:px-10 mt-5 h-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
            {[
              { name: "name", label: "Full Name", placeholder: "Full Name" },
              { name: "phone", label: "Mobile Number", placeholder: "Mobile Number" },
              { name: "street", label: "Street Address", placeholder: "Street and Number" },
              { name: "city", label: "City", placeholder: "City" },
              { name: "zipCode", label: "PINCODE", placeholder: "000000" },
              { name: "state", label: "State", placeholder: "State" },
              { name: "country", label: "Country", placeholder: "Country" },
            ].map(({ name, label, placeholder }) => (
              <FormField
                key={name}
                control={form.control}
                name={name as keyof AddressFormValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-400">{label}</FormLabel>
                    <FormControl>
                      <div className="rounded-sm border-2 border-lime-400 bg-gradient-to-r from-[#2e470fb4] via-[#3a5b0bc9] to-[#3a5b0b49]">
                        <Input
                          placeholder={placeholder}
                          className="w-full p-3 sm:p-6 text-white bg-transparent outline-none text-sm sm:text-base border-0"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-700 text-xs mt-1" />
                  </FormItem>
                )}
              />
            ))}
          </div>

          <div className="flex items-center gap-4 sm:gap-10 w-full sm:w-3/4 md:w-1/2 mt-6 sm:mt-8">
            <Button
              type="submit"
              className="relative w-full py-2 sm:py-3 text-black flex items-center justify-center font-bold text-base sm:text-lg rounded-xl bg-lime-400 shadow-[0_4px_20px_rgba(255,255,255,0.6)] hover:bg-lime-500"
              disabled={isPending}
            >
              {isPending ? <Loader className="animate-spin mr-2" /> : null}
              Save
            </Button>
            <Button
              type="button"
              onClick={handleCancel}
              className="relative w-full py-2 sm:py-3 text-white border-2 border-white font-bold text-base sm:text-lg rounded-xl bg-transparent hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
