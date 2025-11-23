"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import React, { useRef } from "react";
import { useGSAPContext } from "@/context/GSAPContext";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const BrushStroke = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const clipPathRef = useRef<HTMLImageElement>(null);
  const ctx = useGSAPContext();

  useGSAP(() => {
    if (!clipPathRef.current || !containerRef.current) return;

    ctx.add(() => {
      gsap.set(clipPathRef.current, {
        opacity: 0,
        clipPath: "inset(0 100% 0 0)",
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        })
        .to(clipPathRef.current, {
          opacity: 1,
          duration: 0.3,
        })
        .to(clipPathRef.current, {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.5,
          ease: "power2.out",
        });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      <h1 className="text-lg md:text-4xl lg:text-6xl px-[5vw] md:px-[10vw] lg:px-[13w] leading-none uppercase font-bold relative">
        ARVAN CRAFTED FOR THOSE WHO VALUE COMFORT AND{" "}
        <span className="relative inline-block">
          STYLE.
          <Image
            src="/Vector.svg"
            alt="Brush Stroke"
            width={1000}
            height={1000}
            className="absolute left-0 top-0 md:top-1 -z-10 opacity-0"
            ref={clipPathRef}
            style={{ clipPath: "inset(0 100% 0 0)" }}
          />
        </span>
      </h1>
    </div>
  );
};

export default BrushStroke;
