import OTPVerification from "@/components/OTPVerification";
import { cookies } from "next/headers";

export default async function OTPPage() {
  const cookieStore = await cookies();
  const signupData = cookieStore.get("signupData");
  const mobileNumber = signupData ? JSON.parse(signupData.value).mobileNumber : "";

  return <OTPVerification mobileNumber={mobileNumber} />;
}
