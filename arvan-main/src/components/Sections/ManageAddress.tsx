/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type { Session } from "next-auth"
import { useGetAddresses, useDeleteAddress } from "@/app/profile/hooks/hooks"
import { Loader, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useEffect, useState } from "react"

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

const ManageAddress = ({ user }: { user: Session["user"] }) => {
  const router = useRouter()
  const { data, isLoading } = useGetAddresses()
  const { mutate: deleteAddress, isPending } = useDeleteAddress()
  const [addresses, setAddresses] = useState(oldAddresses)

  useEffect(() => {
    if(data) {
      setAddresses(data.address)
    }
  }, [data])

  const handleAddAddress = () => {
    router.push("/address")
  }

  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteAddress(id, {
        onSuccess: () => {
          toast.success("Address deleted successfully");
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to delete address");
        }
      })
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete address");
    }
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader className="animate-spin mr-2" />
        <span>Loading user information...</span>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader className="animate-spin mr-2" />
        <span>Loading addresses...</span>
      </div>
    )
  }

  return (
    <div className="w-full">
      <h2 className="text-4xl mb-4 sm:mb-6">Manage Address</h2>

      <Button
        onClick={handleAddAddress}
        className="flex items-center space-x-2 bg-[#C2E53A4D]/30 border border-[#C2E53A] px-6 py-3 sm:px-20 sm:py-4 rounded-sm mb-10 hover:bg-[#B5D632] transition text-white"
      >
        <Plus size={20} />
        <span className="text-lg">Add New Address</span>
      </Button>

      {/* Address List */}
      <div className="space-y-6">
        {addresses && addresses.length > 0 ? (
          addresses.map((address:any) => (
            <div
              key={address.id}
              className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-700 py-4"
            >
              {/* Address Details */}
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">{address.name}</h3>
                <p className="text-sm text-gray-400 mb-1">{address.street}</p>
                <p className="text-sm text-gray-400 mb-1">
                  {address.city}, {address.state}, {address.zipCode}
                </p>
                <p className="text-sm text-gray-400 mb-1">{address.country}</p>
                <p className="text-sm text-gray-400">{address.phone}</p>
              </div>

              {/* Edit and Delete Buttons */}
              <div className="flex flex-col space-y-2 mt-4 sm:mt-0 w-full sm:w-auto">
                <Link href={`/address/${address.id}`} passHref>
                  <Button className="border border-white px-6 py-2 rounded-sm hover:bg-gray-700 transition w-full">
                    Edit
                  </Button>
                </Link>
                <Button
                  className="bg-[#9C2918] text-white px-6 py-2 rounded-sm hover:bg-red-700 transition w-full"
                  onClick={() => handleDeleteAddress(address.id)}
                  disabled={isPending}
                >
                  {isPending ? <Loader className="animate-spin mr-2" /> : null}
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 border border-dashed border-gray-700 rounded-md">
            <div className="text-gray-400 mb-4 text-center">
              <p className="text-xl mb-2">No addresses found</p>
              <p className="text-sm">Add a new address to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageAddress