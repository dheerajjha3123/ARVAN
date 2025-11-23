"use client";

import DelayedGTM from "@/components/DelayedGTM";
import VercelAnalytics from "@/components/VercelAnalytic";
import { Toaster } from "react-hot-toast";

export default function Providers() {
  return (
    <>
      <DelayedGTM />
      <VercelAnalytics />
      <Toaster />
    </>
  );
}
