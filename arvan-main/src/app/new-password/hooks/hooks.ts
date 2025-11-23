/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/axiosClient";
import { useMutation } from "@tanstack/react-query";

const resetPassword = async(data:any)=>{
      return  (await apiClient.post("/api/customers/reset-password", data)).data;
}

export const useResetPassword = () => {
    return useMutation({
        mutationFn:resetPassword,
        mutationKey:[ "reset-password"]
    })
}