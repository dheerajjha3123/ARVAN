"use client";
import { useState, useEffect } from "react";
import AuthLayout from "@/components/AuthLayout";
import OTPInput from "@/components/OTPInput";
import { apiClient } from "@/lib/axiosClient";
import { toast } from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa";
import { useRouter } from "next/navigation";

const OTPVerification = ({ mobileNumber }: { mobileNumber: string }) => {
  const [otp, setOtp] = useState<string[]>(Array(7).fill(""));
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  

  const startResendTimer = () => {
    setIsResendDisabled(true);
    setTimer(900); 
  };

  useEffect(() => {
    const sendOTP = async () => {
      try {
        const res = await apiClient.get("/api/customers/otp?mobile_no=" + mobileNumber);
        if(res.status === 202) {
          toast.error(res.data.message);
          return;
        }
        toast.success("OTP sent to your WhatsApp");
        startResendTimer();
      } catch (error) {  
        console.error("Error sending OTP:", error);
        toast.error("Failed to send OTP");
      }
    };
    sendOTP();
  }, [mobileNumber]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            setIsResendDisabled(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled, timer]);

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const res = await apiClient.post("/api/customers/verify-otp", {
        mobileNumber,
        otp: otp.join(""),
        type: "verify",
      });
      if (res.status !== 200) {
        toast.error(res.data.message);
      }
      toast.success("OTP verified successfully!");
      router.push("/signin");
      setIsResendDisabled(false);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };
  const handleResendOTP = async () => {
    try {
      const res = await apiClient.get("/api/customers/otp?mobile_no=" + mobileNumber);
      toast.success("OTP resent to your WhatsApp");
      if(res.status === 202) {
        toast.error(res.data.message);
        return;
      }
      startResendTimer();
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Failed to resend OTP");
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <AuthLayout>
      <div className="mb-8 justify-center flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-1">
          OTP Confirmation
        </h1>
        <p className="text-gray-400 text-lg mt-1 flex items-center gap-1">
          OTP is sent to your <FaWhatsapp className="text-green-500" /> WhatsApp mobile
          number
        </p>{" "}
      </div>
      <form className="bg-transparent" onSubmit={handleOTPSubmit}>
        <OTPInput otp={otp} onChangeOtp={setOtp} />
        <p className="text-end mt-3 mb-6 text-sm text-lime-400">
          {isResendDisabled ? (
            <span>Resend available in {formatTime(timer)}</span>
          ) : (
            <button type="button" onClick={handleResendOTP}>
              Resend SMS
            </button>
          )}
        </p>
        <button 
          className="w-full p-3 text-black font-bold text-lg rounded-xl bg-lime-400 shadow-lg disabled:opacity-50"
          disabled={isVerifying}
        >
          {isVerifying ? "Verifying..." : "Continue"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default OTPVerification;
