"use client";
import { createContext, useContext, useRef } from "react";
import { gsap } from "gsap";
import Landing_overlay from "../components/Sections/landing_overlay"; // Import Overlay component

// Define the type for the context value
type OverlayContextValue = {
  animateOverlay: (isVisible: boolean) => void;
};

// Create the context
export const OverlayContext = createContext<OverlayContextValue | null>(null);

export const OverlayProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Function to toggle overlay animation
  const animateOverlay = (isVisible: boolean) => {
    if (!overlayRef.current) return;

    if (isVisible) {
      // Show overlay (slide down)
      overlayRef.current.style.visibility = "visible";
      gsap.to(overlayRef.current, {
        y: "0%",
        duration: 1,
        ease: "power3.out",
      });
    } else {
      // Hide overlay (slide up)
      gsap.to(overlayRef.current, {
        y: "-100%",
        duration: 1,
        ease: "power3.in",
        onComplete: () => {
          overlayRef.current!.style.visibility = "hidden"; // Hide after animation
        },
      });
    }
  };

  const contextValue: OverlayContextValue = {
    animateOverlay,
  };

  return (
    <OverlayContext.Provider value={contextValue}>
      {children}
      <Landing_overlay ref={overlayRef} />
    </OverlayContext.Provider>
  );
};

export const useOverlayContext = () => {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error("useOverlayContext must be used within an OverlayProvider");
  }
  return context;
};