"use client";
import gsap from "gsap";
import React, { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface InteractiveGridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  squares?: [number, number];
  className?: string;
  squaresClassName?: string;
}

const GridBackground: React.FC<InteractiveGridPatternProps> = ({
  width = 60,
  height = 70,
  squares = [50],
}) => {
  const [horizontal] = squares;
  const [vertical, setVertical] = useState(50);

  useEffect(() => {
    const updateVertical = () => {
      if (window.matchMedia("(max-width: 640px)").matches) {
        setVertical(20); // Reduced for mobile to fit screen
      } else if (window.matchMedia("(max-width: 1024px)").matches) {
        setVertical(45); // Adjusted for medium screens
      } else {
        setVertical(50); // Default for large screens
      }
    };

    updateVertical(); // Initial check
    window.addEventListener("resize", updateVertical); // Listen for screen resize

    return () => window.removeEventListener("resize", updateVertical);
  }, []);

  return (
    <div className="absolute w-full h-full overflow-hidden ">
      <svg
        width={width * horizontal}
        height={height * vertical}
        // viewBox={`0 0 ${width * horizontal} ${height * vertical}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute top-0 left-0 w-full h-full"
      >
        <defs>
          <radialGradient
            id="centerGradient"
            cx="50%"
            cy="50%"
            r="50%"
            spreadMethod="pad"
          >
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="60%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          <mask id="gridMask">
            <rect x="0" y="0" width="100%" height="100%" fill="black" />

            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#centerGradient)"
            />
          </mask>
        </defs>

        {Array.from({ length: horizontal * vertical }).map((_, index) => {
          const x = (index % horizontal) * width;
          const y = Math.floor(index / horizontal) * height;
          return (
            <rect
              key={index}
              x={x}
              y={y}
              width={width}
              height={height}
              className="stroke-[#C2E53A]/10 transition-all duration-100 ease-in-out [&:not(:hover)]:duration-1000 fill-transparent"
              mask="url(#gridMask)"
            />
          );
        })}
      </svg>
    </div>
  );
};

export default GridBackground;
