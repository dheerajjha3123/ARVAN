import Razorpay from "@types/razorpay";

export {}

declare global {
  interface Window {
    Razorpay: Razorpay;
  }
}