"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AdminStyles() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      document.body.classList.add("admin-panel");
    } else {
      document.body.classList.remove("admin-panel");
    }
  }, [pathname]);

  return null;
}
