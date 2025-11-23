"use client";

import Image from "next/image";

const LogoMarquee = () => {
  // Logo paths
  const logos = [
    "/Myntra.svg",
    "/Amazon.svg",
    "/Meesho.svg",
    "/Flipkart.svg",
    "/Myntra.svg",
    "/Amazon.svg",
    "/Meesho.svg",
    "/Flipkart.svg",
  ];

  return (
    <div>
      <div className="marquee">
        <div
          className="w-[90%] max-w-7xl mx-auto relative h-28 mt-10 md:mt-20 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0))",
            WebkitMaskImage:
              "linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0))",
          }}
        >
          {logos.map((logo, i) => (
            <div
              key={i}
              className={`flex items-center justify-center rounded-md absolute w-[200px] h-[100px]`}
              style={{
                left: "max(calc(130px * 8), 100%)",
                animationName: "scrollLeft",
                animationDuration: "30s",
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
                animationDelay: `calc(30s / 8 * (8 - ${i + 1}) * -1)`,
              }}
            >
              <Image
                alt="LOGO"
                src={logo}
                unoptimized
                width={100}
                height={100}
                className={`object-cover  ${i === 2 ? "w-14" : ""} ${
                  i === 6 ? "w-14" : ""
                } ${i === 3 ? "w-36" : ""} ${i === 7 ? "w-36" : ""}  `}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoMarquee;