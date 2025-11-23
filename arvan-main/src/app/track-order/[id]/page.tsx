"use client";
import Navigation from "@/components/navigation";
import OrderDetails from "@/components/OrderDetails";
import { useParams } from "next/navigation";
import React from "react";

const Page = () => {
  const { id } = useParams();
  if (!id) {
    return (
      <div className="flex items-center justify-center h-[100dvh] font-montserrat text-white">
        <h1 className="text-2xl">Invalid Order ID</h1>
      </div>
    );
  }
  if (typeof id !== "string") {
    return (
      <div className="flex items-center justify-center h-[100dvh] font-montserrat text-white">
        <h1 className="text-2xl">Invalid Order ID</h1>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <OrderDetails orderId={id} />
    </div>
  );
};

export default Page;
