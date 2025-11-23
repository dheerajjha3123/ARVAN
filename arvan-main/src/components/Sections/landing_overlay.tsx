"use client";
import { forwardRef, useState } from "react";
import { useOverlayContext } from "@/context/OverlayContext";
import Image from "next/image";
const slides = [
  {
    name: "red dragon",
    image:
      "https://res.cloudinary.com/dficko9l8/image/upload/v1743693176/RedDragon_wybpoi.png",
  },
  {
    name: "monster",
    image:
      "https://res.cloudinary.com/dficko9l8/image/upload/v1743693176/Monster_yhqbgo.png",
  },
  {
    name: "Cube",
    image:
      "https://res.cloudinary.com/dficko9l8/image/upload/v1743693176/Cube_vent5d.png",
  },
  {
    name: "life is good",
    image:
      "https://res.cloudinary.com/dficko9l8/image/upload/v1743693176/Life_Is_good_pja00c.png",
  },
  {
    name: "leo",
    image:
      "https://res.cloudinary.com/dficko9l8/image/upload/v1743693176/Leo_floo51.png",
  },
  {
    name: "haunted skull",
    image:
      "https://res.cloudinary.com/dficko9l8/image/upload/v1743693175/Haunted_Skull_jtlmst.png",
  },
];
const Landing_overlay = forwardRef<HTMLDivElement>((_, ref) => {
  const { animateOverlay } = useOverlayContext();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null); // Track hovered item

  return (
    <div
      ref={ref}
      className="w-full h-[100dvh] bg-black lg:block fixed top-0 left-0 z-50"
      style={{ transform: "translateY(-100%)", visibility: "hidden" }}
    >
      <div className="w-full h-full flex flex-col gap-2 relative items-center justify-center">
        {/* Render all images but only show the hovered one */}

        {slides.map((slide, i) => (
          <div key={`slide-${i}`}>
          <div
            className={`absolute w-full h-full top-0 left-0 z-10 transition-opacity duration-500 ease-in-out ${
              hoveredIndex === i ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              width={600}
              height={500}
              src={slide.image}
              alt={slide.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className="relative z-40"
            onMouseEnter={() => setHoveredIndex(i)} // Set hovered index
            onMouseLeave={() => setHoveredIndex(null)} // Reset hovered index
          >
            <h3
              className={`text-5xl  md:text-6xl font-coluna font-medium md:font-bold hover:scale-110 cursor-pointer
                    after:content-[''] after:absolute  after:left-[-5%]  after:right-[-5%]  after:top-[42%] after:-translate-y-1/2 after:h-[7px] after:bg-[#C2E53A] after:scale-x-0 hover:after:scale-x-100 after:transition-all after:duration-500 after:origin-left transition-opacity duration-400 ${
                      hoveredIndex === null || hoveredIndex === i
                        ? "opacity-100"
                        : "opacity-0"
                    }
                `}
            >
              {slide.name}
            </h3>
          </div>
          </div>
        ))}

        <button
          className="absolute z-20 top-8 right-8 text-white transition-all duration-700 hover:scale-110 cursor-pointer"
          onClick={() => {
            animateOverlay(false);
          }} // Slide back up when clicked
        >
          <Image
            alt="Menu Close Button"
            width={50}
            height={100}
            src={"/Menu-Close-Btn.svg"}
          />
        </button>
      </div>
    </div>
  );
});

Landing_overlay.displayName = "Overlay";
export default Landing_overlay;
