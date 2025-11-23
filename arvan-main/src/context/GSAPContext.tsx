"use client";
import { createContext, useContext, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const gsapContext = gsap.context(() => {});
export const GSAPContext = createContext(gsapContext);

export const GSAPProvider = ({ children }: { children: React.ReactNode }) => {

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {});
    let lastWidth = window.innerWidth;

    const handleResize = () => {
      const newWidth = window.innerWidth;

      if (Math.abs(newWidth - lastWidth) > 50) {
        lastWidth = newWidth;
        window.location.reload();
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert();
    };
  }, []);
  return (
    <GSAPContext.Provider value={gsapContext}>{children}</GSAPContext.Provider>
  );
};

export const useGSAPContext = () => useContext(GSAPContext);
