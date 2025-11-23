/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/axiosClient";
import { useMutation } from "@tanstack/react-query";

const verifyOtp = async(data:any)=>{
   return  (await apiClient.post("/api/customers/verify-otp",data)).data;
}

const resendOtp = async(data:any)=>{
    return  (await apiClient.post(`/api/customers/resend-otp`,data)).data;
}

export const useVerifyOtp = () => {
    return useMutation({
        mutationFn:verifyOtp,
        mutationKey:[ "verify-otp"]
        
    })
}

export const useResendOtp = () => {
    return useMutation({
        mutationFn:resendOtp,
        mutationKey:[ "resend-otp"]
    })
};
