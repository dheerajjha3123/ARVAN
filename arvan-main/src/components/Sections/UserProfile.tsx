"use client";

import { useState } from "react";
import { Pencil, LogOut, X } from "lucide-react";
import Image from "next/image";
import { FaUser, FaShoppingBag, FaMapMarkerAlt } from "react-icons/fa";
import { signOut } from "next-auth/react";
import TrackOrders from "./TrackOrders";
import ManageAddress from "./ManageAddress";
import Navigation from "../navigation";
import { useGetCustomer,useUpdateCustomer } from "@/app/profile/hooks/hooks";
import { Session } from "next-auth";
export default function ProfilePage({ user }: { user: Session["user"] }) {
  const { data: customerData, isLoading } = useGetCustomer();
  const updateCustomerMutation = useUpdateCustomer();
  const [activeSection, setActiveSection] = useState("personal");
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editField, setEditField] = useState<{
    label: string;
    key: string;
    value: string;
  } | null>(null);
  const [editValue, setEditValue] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C2E53A]"></div>
      </div>
    );
  }

  const customer = customerData?.customer;

  const handleEdit = (label: string, key: string, value: string) => {
    setEditField({ label, key, value });
    setEditValue(value);
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    if (!editField) return;
    
    try {
      await updateCustomerMutation.mutateAsync({
        [editField.key]: editValue
      });
      setIsEditModalOpen(false);
      setEditField(null);
    } catch (error) {
      console.error('Failed to update customer:', error);
    }
  };

  const profile = {
    fullName: customer?.name || 'N/A',
    email: customer?.email || 'N/A',
    phone: customer?.mobile_no || 'N/A',
    avatar: customer?.image || "/userProfile.png",
  };

  return (
    <>
      <Navigation />
      <div className="text-white min-h-screen p-4 sm:p-6 md:p-10 lg:p-16 flex flex-col w-full">
        <div className="max-w-7xl mx-auto w-full flex-grow">
          <h1 className="text-3xl font-semibold mb-6 sm:mb-8 text-center sm:text-left">
            My Profile
          </h1>

          {/* Blurred circle in background */}
          <div className="absolute w-[80vw] h-[40vw] rounded-full bg-lime-600/10 blur-3xl left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-1 pointer-events-none"></div>

          <div className="grid grid-cols-1 md:grid-cols-[300px,1fr] gap-6 sm:gap-8">
            {/* Sidebar */}
            <div className="border border-gray-700 rounded-sm">
              <div className="flex items-center space-x-4 text-white p-4 sm:p-6">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16">
                  <Image
                    src={profile.avatar}
                    alt="Profile"
                    width={64}
                    height={64}
                    unoptimized
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-base font-medium">{profile.fullName}</h2>
                  <p className="text-xs text-gray-400">{profile.phone}</p>
                </div>
              </div>
              <hr className="border-[#959595] w-full mb-6" />

              <nav>
                <ul className="space-y-2 w-full">
                  <li
                    className={`flex items-center space-x-2 px-4 py-2 rounded-sm cursor-pointer w-full transition ${
                      activeSection === "personal"
                        ? "text-white font-semibold"
                        : "text-gray-400 hover:bg-gray-700"
                    }`}
                    onClick={() => setActiveSection("personal")}>
                    <FaUser
                      className={`w-4 h-4 ${
                        activeSection === "personal"
                          ? "text-[#C2E53A]"
                          : "text-gray-400"
                      }`}
                    />
                    <span>Personal Details</span>
                  </li>

                  <li
                    className={`flex items-center space-x-2 px-4 py-2 rounded-sm cursor-pointer w-full transition ${
                      activeSection === "orders"
                        ? "text-white font-semibold"
                        : "text-gray-400 hover:bg-gray-700"
                    }`}
                    onClick={() => setActiveSection("orders")}>
                    <FaShoppingBag
                      className={`w-4 h-4 ${
                        activeSection === "orders"
                          ? "text-[#C2E53A]"
                          : "text-gray-400"
                      }`}
                    />
                    <span>My Orders</span>
                  </li>

                  <li
                    className={`flex items-center space-x-2 px-4 py-2 rounded-sm cursor-pointer w-full transition ${
                      activeSection === "address"
                        ? "text-white font-semibold"
                        : "text-gray-400 hover:bg-gray-700"
                    }`}
                    onClick={() => setActiveSection("address")}>
                    <FaMapMarkerAlt
                      className={`w-4 h-4 ${
                        activeSection === "address"
                          ? "text-[#C2E53A]"
                          : "text-gray-400"
                      }`}
                    />
                    <span>Manage Address</span>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Dynamic Content Section */}
            <div className="p-4 sm:p-6 w-full relative">
              {activeSection === "personal" && (
                <div>
                  <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-10">
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden">
                      <Image
                        src={profile.avatar}
                        alt="Profile"
                        unoptimized
                        width={112}
                        height={112}
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center text-center sm:text-left w-full">
                      <h2 className="text-xl font-semibold">
                        {profile.fullName}
                      </h2>
                      <p className="text-sm text-gray-400">{profile.phone}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 w-full">
                    {[
                      {
                        label: "Full Name",
                        key: "name",
                        value: profile.fullName,
                      },
                      {
                        label: "Phone No.",
                        key: "mobile_no",
                        value: profile.phone,
                      },
                      { label: "Email", key: "email", value: profile.email },
                    ].map((field, index) => (
                      <div key={index} className="w-full">
                        <label className="block text-sm text-gray-400 mb-1">
                          {field.label}
                        </label>
                        <div className="relative w-full">
                          <input
                            type="text"
                            value={field.value}
                            readOnly
                            placeholder={`Enter ${field.label}`}
                            className="w-full text-sm bg-[#C2E53A2E] border border-[#C2E53A] rounded-sm px-4 py-2.5 pr-10"
                          />
                          <button
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            onClick={() =>
                              handleEdit(field.label, field.key, field.value)
                            }
                            disabled={field.key === "mobile_no"}>
                            <Pencil className={`w-4 h-4 ${field.key === "mobile_no" ? "text-gray-500" : "text-[#beaaaa]"}`} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === "orders" && <TrackOrders user={user}/>}

              {activeSection === "address" && <ManageAddress  user={user}/>}
            </div>
          </div>
        </div>
        {/* Logout Button */}
        <div className="mt-6 self-center sm:self-end w-full flex justify-center sm:justify-end">
          <button
            onClick={() => signOut()}
            className="flex items-center space-x-2 bg-[#B22B2B] text-white px-6 py-2 rounded-sm hover:bg-red-500/20 transition">
            <span>Log Out</span>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        {isEditModalOpen && editField && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/70">
            <div className="bg-[#C2E53A2E] backdrop-blur-md bg-opacity-30 border border-[#C2E53A] rounded-sm w-full max-w-md p-6 relative">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-4 right-4 text-[#beaaaa] hover:text-white">
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-semibold mb-6">
                Edit {editField.label}
              </h3>

              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">
                  {editField.label}
                </label>
                <input
                  type={editField.key === "email" ? "email" : "text"}
                  value={editValue}
                  placeholder={`Enter your ${editField.label}`}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full text-sm bg-[#C2E53A2E] backdrop-blur-sm bg-opacity-30 border border-[#C2E53A] rounded-sm px-4 py-2.5"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-[#C2E53A] rounded-sm text-gray-400 hover:bg-[#C2E53A2E] transition">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={updateCustomerMutation.isPending}
                  className="px-4 py-2 bg-[#C2E53A] text-black rounded-sm hover:bg-[#C2E53A]/80 transition disabled:opacity-50">
                  {updateCustomerMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}