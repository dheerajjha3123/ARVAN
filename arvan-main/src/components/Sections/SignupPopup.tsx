"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/axiosClient";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import OTPInput from "@/components/OTPInput";
import { FaWhatsapp } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import styles from "@/components/Sections/PhoneInput.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";

const SignupPopup = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpJwt, setOtpJwt] = useState<string | null>(null);

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber) return toast.error("Enter a valid mobile number");

    setIsSubmitting(true);
    try {
      const res = await apiClient.post("/api/customers/otp", {
        mobile_no: mobileNumber,
        type: "verify",
      });

      if (res.status === 202) {
        toast.error(res.data.message);
        return;
      }

      if (res.data.jwt) {
        setOtpJwt(res.data.jwt);
      }

      toast.success("OTP sent via WhatsApp");
      setStep("otp");
      startResendTimer();
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpJwt) {
      toast.error("Session expired. Please try again.");
      setStep("mobile");
      return;
    }

    setIsVerifying(true);
    try {
      const verifyRes = await apiClient.post("/api/customers/verify-otp", {
        otp: otp.join(""),
        jwt: otpJwt,
      });

      if (verifyRes.status !== 200) {
        toast.error(verifyRes.data.message);
        return;
      }

      toast.success("OTP verified!");

      const loginJwt = verifyRes.data.jwt;

      const res = await signIn("credentials", {
        token: loginJwt,
        redirect: false,
      });

      if (res?.error) toast.error("Login failed");

      onClose();
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Invalid OTP or session expired");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await apiClient.post("/api/customers/otp", {
        mobile_no: mobileNumber,
        type: "verify",
      });

      if (res.status === 202) {
        toast.error(res.data.message);
        return;
      }

      if (res.data.jwt) {
        setOtpJwt(res.data.jwt);
      }

      toast.success("OTP resent via WhatsApp");
      startResendTimer();
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Resend failed");
    }
  };

  const startResendTimer = () => {
    setIsResendDisabled(true);
    setTimer(90);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled, timer]);

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div
        className="fixed inset-0 flex sm:items-center sm:justify-center items-end justify-center z-50 p-0 sm:p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-b from-[#1a1a1a] to-[#252525] text-white rounded-t-2xl sm:rounded-2xl w-full sm:w-[450px] max-w-[%] sm:max-h-[90%] sm:relative fixed bottom-0 sm:bottom-auto left-0 sm:left-auto h-[60%] sm:h-auto shadow-2xl z-50 border border-lime-400/30 overflow-y-auto"
        >
          <Button
            onClick={onClose}
            variant="ghost"
            className="absolute top-4 right-4 text-white rounded-full p-2 hover:bg-white/10 z-10"
            size="icon"
          >
            <IoClose size={20} />
          </Button>

          <AnimatePresence mode="wait">
            {step === "mobile" ? (
              <motion.div
                key="mobile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="px-6 py-8 sm:px-8 sm:py-10"
              >
                <form onSubmit={handleMobileSubmit} className="flex flex-col gap-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-lime-300 to-lime-500 bg-clip-text text-transparent">
                      Welcome to Arvan
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base">
                      Enter your mobile number to continue
                    </p>
                  </div>

                  <div
                    className={`${styles.phoneContainer} rounded-xl border-2 border-lime-400 bg-gradient-to-r from-[#2e470fb4] via-[#3a5b0bc9] to-[#3a5b0b49] mt-4`}
                  >
                    <PhoneInput
                      country={"in"}
                      value={mobileNumber}
                      onChange={setMobileNumber}
                      inputClass="!w-full !p-5 !px-10 !text-white !bg-transparent !border-0 !rounded-xl !outline-none !ring-0"
                      containerClass="!bg-transparent"
                      buttonClass="!bg-transparent !border-0"
                      dropdownClass="!bg-[#1a1a1a] !text-white"
                      searchClass="!bg-[#1a1a1a] !text-white"
                      inputProps={{
                        required: true,
                        placeholder: "Mobile Number",
                      }}
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full p-3 text-black font-bold text-base sm:text-lg rounded-xl bg-lime-400 shadow-[0_4px_20px_rgba(132,204,22,0.4)] hover:bg-lime-500 transition-all duration-300 mt-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending OTP..." : "Continue"}
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="px-6 py-8 sm:px-8 sm:py-10"
              >
                <form onSubmit={handleVerifyOTP} className="flex flex-col gap-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-lime-300 to-lime-500 bg-clip-text text-transparent">
                      Verify OTP
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base flex items-center justify-center gap-2">
                      OTP sent via <FaWhatsapp className="text-green-500" /> to {mobileNumber}
                    </p>
                  </div>

                  <div className="my-4">
                    <OTPInput otp={otp} onChangeOtp={setOtp} />
                  </div>

                  <div className="text-center text-sm">
                    {isResendDisabled ? (
                      <p className="text-gray-400">
                        Resend OTP in{" "}
                        <span className="text-lime-400 font-medium">
                          {formatTime(timer)}
                        </span>
                      </p>
                    ) : (
                      <Button
                        type="button"
                        variant="link"
                        onClick={handleResend}
                        className="text-lime-400 hover:text-lime-500"
                      >
                        Resend OTP
                      </Button>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full p-3 text-black font-bold text-base sm:text-lg rounded-xl bg-lime-400 shadow-[0_4px_20px_rgba(132,204,22,0.4)] hover:bg-lime-500 transition-all duration-300"
                    disabled={isVerifying}
                  >
                    {isVerifying ? "Verifying..." : "Verify OTP"}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                    onClick={() => setStep("mobile")}
                  >
                    Change mobile number
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
};

export default SignupPopup;
