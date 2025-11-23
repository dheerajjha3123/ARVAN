
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { z } from "zod"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useGetAddresses } from "@/app/profile/hooks/hooks"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { MapPin } from "lucide-react"

import { Loader } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useUpdateAddress } from "@/app/profile/hooks/hooks"
import { toast } from "react-hot-toast"

export default function AddressPage() {
  const params = useParams()
  const addressId = params.id as string
  const { data: addresses, isLoading, isError } = useGetAddresses()
  const [address, setAddress] = useState<any>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (addresses && !isLoading) {
      const foundAddress = addresses.find((addr: any) => addr.id === addressId)
      if (foundAddress) {
        setAddress(foundAddress)
      } else {
        setNotFound(true)
      }
    }
  }, [addresses, addressId, isLoading])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader className="animate-spin text-lime-400 w-8 h-8" />
      </div>
    )
  }

  if (notFound || isError) {
    return <NotFoundPage />
  }

  return address ? <UpdateAddressForm address={address} /> : null
}

function NotFoundPage() {
    const router = useRouter()
  
    return (
      <div className="relative w-full min-h-screen bg-black overflow-hidden py-5 flex flex-col items-center justify-center">
        {/* Blurred circle in background */}
        <div className="absolute w-[80vw] h-[40vw] rounded-full bg-lime-500/15 blur-3xl left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10"></div>
  
        <div className="text-center max-w-md px-4">
          <div className="flex justify-center mb-6">
            <div className="bg-lime-400/20 p-6 rounded-full">
              <MapPin className="w-16 h-16 text-lime-400" />
            </div>
          </div>
  
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Address Not Found</h1>
  
          <p className="text-gray-400 mb-8">
            We couldn&apos;t find the address you&apos;re looking for. It may have been deleted or the link is incorrect.
          </p>
  
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push("/address/new")}
              className="bg-lime-400 text-black font-bold py-2 px-6 rounded-xl hover:bg-lime-500"
            >
              Add New Address
            </Button>
  
            <Button
              onClick={() => router.push("/profile")}
              className="border-2 border-white text-white font-bold py-2 px-6 rounded-xl bg-transparent hover:bg-white/10"
            >
              Go to Profile
            </Button>
          </div>
        </div>
      </div>
    )
  }

  
  






// Define the schema based on the Prisma model
const addressSchema = z.object({
  name: z.string().min(2, { message: "Full name is required" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  street: z.string().min(3, { message: "Street address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  country: z.string().min(2, { message: "Country is required" }),
  zipCode: z.string().min(5, { message: "Valid zip code is required" }),
})

type AddressFormValues = z.infer<typeof addressSchema>

 function UpdateAddressForm({ address }: { address: any }) {
  const router = useRouter()
  const { mutate, isPending } = useUpdateAddress()

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
  })

  // Set form values when address data is available
  useEffect(() => {
    if (address) {
      form.reset({
        name: address.name || "",
        phone: address.phone || "",
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        country: address.country || "",
        zipCode: address.zipCode || "",
      })
    }
  }, [address, form])

  function onSubmit(data: AddressFormValues) {
    mutate(
      { addressId: address.id, addressData: data },
      {
        onSuccess: () => {
          toast(
            "Your address has been successfully updated",
          )
          router.push("/profile")
        },
        onError: () => {
          toast( "Failed to update address. Please try again.")
        },
      },
    )
  }

  const handleCancel = () => {
    router.push("/profile")
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden py-5">
      {/* Blurred circle in background */}
      <div className="absolute w-[80vw] h-[40vw] rounded-full bg-lime-500/15 blur-3xl left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10"></div>

      <Button
        onClick={handleBack}
        className="relative ml-4 bg-lime-400 text-black font-bold py-1 px-4 rounded hover:bg-lime-500"
      >
        Back
      </Button>

      {/* Form container */}
      <div className="w-full px-4 sm:px-10 flex flex-col relative z-10 mt-6 sm:mt-10">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 text-white">UPDATE YOUR ADDRESS</h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-transparent w-full sm:w-[90vw] md:w-[85vw] px-4 sm:px-10 mt-5 h-auto"
        >
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

            {/* Phone Number */}
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
                  <FormLabel className="text-gray-400">Street Address</FormLabel>
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
              disabled={isPending || !form.formState.isDirty}
            >
              {isPending ? <Loader className="animate-spin mr-2" /> : null}
              Update
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
  )
}

