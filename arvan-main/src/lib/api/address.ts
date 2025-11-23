import { AddressType } from "@/types/types";
import { apiClient } from "../axiosClient";

export type Address = {
  id: string;
  name?: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  userId: string;
  createdAt: string; // ISO date format
  updatedAt: string; // ISO date format
};

export const AddressApi = {
  getAddress: async (): Promise<Address[]> => {
    const response = await apiClient.get("/api/customers/address");
    return response.data.address;
  },
  addAddress: async (formData: AddressType): Promise<void> => {
   await apiClient.post(
      "/api/customers/address",
      formData
    );
  },
};
