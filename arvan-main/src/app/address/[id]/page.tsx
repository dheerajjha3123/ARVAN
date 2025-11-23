"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { z } from "zod";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
import { useGetAddresses, useUpdateAddress } from "../../profile/hooks/hooks";
import Navigation from "@/components/navigation";

const oldAddresses = [{
  "id": "84110d2b-d500-4085-ac68-62165d98f8f5",
  "name": "Aditya Bansal",
  "phone": "7060140150",
  "street": "Supertech Upcountry",
  "city": "Greater Noida",
  "state": "Uttar Pradesh",
  "country": "India",
  "zipCode": "203201",
  "userId": "cm8vavsfy0000zvgwvcc3mkqg",
  "createdAt": "2025-03-30T07:44:38.703Z",
  "updatedAt": "2025-03-30T07:44:38.703Z"
}]

// Define the schema based on the Prisma model
const addressSchema = z.object({
  name: z.string().min(2, { message: "Full name is required" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  street: z.string().min(3, { message: "Street address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  country: z.string().min(2, { message: "Country is required" }),
  zipCode: z.string().min(5, { message: "Valid zip code is required" }),
});

type AddressFormValues = z.infer<typeof addressSchema>;

export default function EditAddressForm() {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading: isLoadingAddresses } = useGetAddresses();
  const { mutate, isPending } = useUpdateAddress();
  const [addresses, setAddress] = useState(oldAddresses);

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
  useEffect(() => {
    if (data) {
      setAddress(data.address);
    }
  }, [data]);

  useEffect(() => {
    if (!id || typeof id !== 'string') {
      toast.error("Invalid address ID");
      router.push("/profile");
      return;
    }

    if (addresses && !isLoadingAddresses) {
      const currentAddress = addresses?.find((address: { id: string; }) => address.id === id);
      
      if (!currentAddress) {
        toast.error("Address not found");
        router.push("/profile");
        return;
      }

      // Populate the form with existing address data
      form.reset({
        name: currentAddress.name || "",
        phone: currentAddress.phone || "",
        street: currentAddress.street || "",
        city: currentAddress.city || "",
        state: currentAddress.state || "",
        country: currentAddress.country || "",
        zipCode: currentAddress.zipCode || "",
      });
    }
  }, [addresses, id, isLoadingAddresses, form, router]);

  async function onSubmit(data: AddressFormValues) {
    if (typeof id !== 'string') return;
    
    mutate(
      { addressId: id, addressData: data },
      {
        onSuccess: () => {
          toast.success("Address updated successfully");
          router.push("/profile");
        },
        onError: (error) => {
          toast.error("Failed to update address");
          console.error(error);
        },
      }
    );
  }

  const handleCancel = () => {
    router.push("/profile");
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoadingAddresses) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader className="animate-spin text-lime-400" size={48} />
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden py-5">
      {/* Blurred circle in background */}
      <div className="absolute w-[80vw] h-[40vw] rounded-full bg-lime-500/15 blur-3xl left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none"></div>

      <Navigation />
      <Button
        onClick={handleBack}
        className="relative ml-4 mt-2 bg-lime-400 text-black font-bold py-1 px-4 rounded hover:bg-lime-500">
        Back
      </Button>

      {/* Form container */}
      <div className="w-full px-4 sm:px-10 flex flex-col relative z-10 mt-6 sm:mt-10">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 text-white">
          EDIT YOUR ADDRESS
        </h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-transparent w-full sm:w-[90vw] md:w-[85vw] px-4 sm:px-10 mt-5 h-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
            {/* Full Name (name in schema) */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Full Name</FormLabel>
                  <FormControl>
                    <div className="rounded-sm border-2 border-lime-400 bg-gradient-to-r from-[#2e470fb4] via-[#3a5b0bc9] to-[#3a5b0b49]">
                      <Input
                        placeholder="Full Name"
                        className="w-full p-3 sm:p-6 text-white bg-transparent outline-none text-sm sm:text-base border-0"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-700 text-xs mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Mobile Number</FormLabel>
                  <FormControl>
                    <div className="rounded-sm border-2 border-lime-400 bg-gradient-to-r from-[#2e470fb4] via-[#3a5b0bc9] to-[#3a5b0b49]">
                      <Input
                        placeholder="Mobile Number"
                        className="w-full p-3 sm:p-6 text-white bg-transparent outline-none text-sm sm:text-base border-0"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-700 text-xs mt-1" />
                </FormItem>
              )}
            />

            {/* Street Address */}
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">
                    Street Address
                  </FormLabel>
                  <FormControl>
                    <div className="rounded-sm border-2 border-lime-400 bg-gradient-to-r from-[#2e470fb4] via-[#3a5b0bc9] to-[#3a5b0b49]">
                      <Input
                        placeholder="Street and Number"
                        className="w-full p-3 sm:p-6 text-white bg-transparent outline-none text-sm sm:text-base border-0"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-700 text-xs mt-1" />
                </FormItem>
              )}
            />

            {/* City */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">City</FormLabel>
                  <FormControl>
                    <div className="rounded-sm border-2 border-lime-400 bg-gradient-to-r from-[#2e470fb4] via-[#3a5b0bc9] to-[#3a5b0b49]">
                      <Input
                        placeholder="City"
                        className="w-full p-3 sm:p-6 text-white bg-transparent outline-none text-sm sm:text-base border-0"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-700 text-xs mt-1" />
                </FormItem>
              )}
            />

            {/* Zip Code */}
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">PINCODE</FormLabel>
                  <FormControl>
                    <div className="rounded-sm border-2 border-lime-400 bg-gradient-to-r from-[#2e470fb4] via-[#3a5b0bc9] to-[#3a5b0b49]">
                      <Input
                        placeholder="000 000"
                        className="w-full p-3 sm:p-6 text-white bg-transparent outline-none text-sm sm:text-base border-0"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-700 text-xs mt-1" />
                </FormItem>
              )}
            />

            {/* State */}
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">State</FormLabel>
                  <FormControl>
                    <div className="rounded-sm border-2 border-lime-400 bg-gradient-to-r from-[#2e470fb4] via-[#3a5b0bc9] to-[#3a5b0b49]">
                      <Input
                        placeholder="State"
                        className="w-full p-3 sm:p-6 text-white bg-transparent outline-none text-sm sm:text-base border-0"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-700 text-xs mt-1" />
                </FormItem>
              )}
            />

            {/* Country */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Country</FormLabel>
                  <FormControl>
                    <div className="rounded-sm border-2 border-lime-400 bg-gradient-to-r from-[#2e470fb4] via-[#3a5b0bc9] to-[#3a5b0b49]">
                      <Input
                        placeholder="Country"
                        className="w-full p-3 sm:p-6 text-white bg-transparent outline-none text-sm sm:text-base border-0"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-700 text-xs mt-1" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center gap-4 sm:gap-10 w-full sm:w-3/4 md:w-1/2 mt-6 sm:mt-8">
            <Button
              type="submit"
              className="relative w-full py-2 sm:py-3 text-black flex items-center justify-center font-bold text-base sm:text-lg rounded-xl bg-lime-400 shadow-[0_4px_20px_rgba(255,255,255,0.6)] hover:bg-lime-500"
              disabled={isPending}>
              {isPending ? <Loader className="animate-spin mr-2" /> : null}
              Update
            </Button>
            <Button
              type="button"
              onClick={handleCancel}
              className="relative w-full py-2 sm:py-3 text-white border-2 border-white font-bold text-base sm:text-lg rounded-xl bg-transparent hover:bg-white/10">
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
