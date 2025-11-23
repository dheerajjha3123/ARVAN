"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface StrokeMarqueeProps {
  direction?: "left" | "right";
  text: string;
  StrokeColor?: string;
}

const StrokeMarquee: React.FC<StrokeMarqueeProps> = ({
  direction = "left",
  text = "STYLISH / COMFORT / AFFORDABLE /&nbsp;",
  StrokeColor = "1.5px #fff",
}) => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const isLeft = direction === "left";

  useGSAP(() => {
    if (!marqueeRef.current) return;

    const marqueeChildren = marqueeRef.current
      .children as HTMLCollectionOf<HTMLElement>;

    gsap.set(marqueeChildren, {
      xPercent: isLeft ? 0 : -100,
    });

    const marqueeAnimation = gsap.to(marqueeChildren, {
      xPercent: isLeft ? -100 : 0,
      duration: 20,
      ease: "none",
      repeat: -1,
    });

    return () => {
      marqueeAnimation.kill();
    };
  }, []);

  return (
    <div className="w-full z-[10] relative pt-5 pointer-events-none">
      <div className="relative flex overflow-hidden">
        <div ref={marqueeRef} className="flex whitespace-nowrap gap-0 w-fit">
          {[...Array(4)].map((_, i) => (
            <h1
              key={i}
              className="marquee-stroke text-[15vw] sm:text-[10vw] md:text-[6vw] leading-none font-semibold transform-gpu   uppercase pr-1"
              style={{
                WebkitTextStroke: `${StrokeColor}`,
                color: "transparent",
              }}
            >
              {text}
            </h1>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StrokeMarquee;