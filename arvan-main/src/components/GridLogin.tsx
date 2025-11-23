"use client";
import React from "react";

interface InteractiveGridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  squares?: [number, number];
  className?: string;
  squaresClassName?: string;
}

const GridLogin: React.FC<InteractiveGridPatternProps> = ({
  width = 90,
  height = 150,
  squares = [70],
}) => {
  const [horizontal] = squares;
  // const [vertical, setVertical] = useState(50);
  const vertical = 50;

  return (
    <>
      <div className="absolute w-full  h-[100dvh] overflow-hidden">
        <svg
          width={width * horizontal}
          height={height * vertical}
          className="h-auto w-full"
        >

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
    </>
  );
};

export default GridLogin;
