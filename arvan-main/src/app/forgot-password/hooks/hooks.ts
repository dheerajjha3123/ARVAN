import { apiClient } from "@/lib/axiosClient";
import { useMutation } from "@tanstack/react-query";

const forgotPassword = async(mobile_no:string)=>{
      return  (await apiClient.post("/api/customers/otp", { mobile_no:mobile_no,type:"forgetpassword" })).data;
}

export const useForgotPassword = () => {
    return useMutation({
        mutationFn:forgotPassword,
        mutationKey:[ "forgot-password"]
    })
}