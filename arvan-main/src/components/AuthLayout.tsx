"use client";
import GridLogin from "@/components/GridLogin";
import Image from "next/image";
import { ReactNode } from "react";
import BentoImg from "./BentoImg";
import { useRouter } from "next/navigation";
interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center h-screen bg-black text-white relative overflow-hidden">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 cursor-pointer z-10 left-4 bg-lime-400 text-black font-bold py-1 px-4 rounded"
      >
        Back
      </button>

      {/* Grid Background Effect */}
      <div className="absolute inset-0 hidden lg:block">
        <GridLogin />
      </div>

      <Image
        src={"/logo.svg"}
        width={40}
        height={80}
        alt="logo"
        className="object-cover absolute top-4 right-0 -translate-x-1/2"
      />

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row justify-center gap-10 w-full z-10 max-w-6xl h-auto rounded-lg overflow-hidden p-4">
        <BentoImg />

        <div className="w-full lg:w-1/2 sm:p-10 flex flex-col justify-center ">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
