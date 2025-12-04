"use client";
import AuthLayout from "@/components/AuthLayout";
import OTPInput from "@/components/OTPInput";
import { useState } from "react";
import toast from "react-hot-toast";
import z from "zod";
import { useVerifyOtp,useResendOtp } from "@/app/otp/hooks/verify-otp";
import { useRouter } from "next/navigation";

const otpschema = z.array(z.string().length(1)).length(6);


const OTPVerification = ({id}:{id:string}) => {
  const [otp,setOtp] = useState<string[]>(Array(6).fill(''));
  const verifyOtp  = useVerifyOtp();
  const resendOtp = useResendOtp();
  const router = useRouter();

  
const handleResendOtp = async() => {
  await resendOtp.mutate({jwt:id},{
    onSuccess:(data)=>{
      router.push(`/otp/${data.jwt}`);
    }
  });
}

  const handleOTPSubmit = async() => {
   const parsedOtp = otpschema.safeParse(otp);

   if(parsedOtp.success){
    const otpString = parsedOtp.data.join('');

    const data = {otp:otpString,jwt:id}

    verifyOtp.mutate(data,{
      onSuccess:(data)=>{
        if (data?.success === false) {
          toast.error(data.message);
          // Optionally, add a button or redirect to signup
          setTimeout(() => {
            router.push('/signup');
          }, 2000); // Redirect to signup after 2 seconds
          return;
        }
        toast.success("OTP verified successfully");
        if(data?.jwt){
          router.push(`/signin`);
        }
        else{
          router.push(`/`);

        }
      },

    });

   }else{
  toast.error("Invalid OTP");
   }
  };
  return (
    <AuthLayout>
      <>
        <div className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-1">
            OTP Confirmation
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl">
            OTP is sent on your given whatsapp mobile number
          </p>
        </div>
      
          <OTPInput otp={otp} onChangeOtp={setOtp}/>
          <p className="relative text-end mt-3 mb-6 text-sm text-lime-400">
            <button onClick={handleResendOtp}>
              Resend SMS
            </button>
          </p>
          <button className="w-full p-3 text-black font-bold text-lg rounded-xl bg-lime-400 shadow-[0_4px_20px_rgba(255,255,255,0.6)]" onClick={handleOTPSubmit}>
            {/* Verify OTP */}
            Continue
          </button>
       
      </>
    </AuthLayout>
  );
};

export default OTPVerification;
