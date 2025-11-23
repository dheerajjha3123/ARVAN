"use client";
import Image from "next/image";
import { useOverlayContext } from "@/context/OverlayContext";
const LandingPage = () => {
  const { animateOverlay } = useOverlayContext();

  const backgroundImages = [
    [
      "https://res.cloudinary.com/dficko9l8/image/upload/v1743685582/Mobile_wcue4b.png",
      "https://res.cloudinary.com/dficko9l8/image/upload/v1743685583/Desktop_tds6fg.png",
    ],
  ];

  return (
    <div className="relative h-[100dvh] overflow-hidden ">
      {/* Top ClipPath with logo */}
      <div
        className="clippath1 absolute max-sm:hidden -top-1 left-0  z-[20] bg-[#121212] w-full h-full  justify-center items-start  object-cover hidden lg:flex "
        style={{
          clipPath:
            "polygon(0px 0px, 40% 0px, 45% 4%, 55% 4%, 60% 0px, 100% 0px)",
        }}>
        <Image
          src={"/logo.svg"}
          width={20}
          height={80}
          alt="logo"
          className="object-cover absolute top-1 left-1/2 -translate-x-1/2"
        />
      </div>
      {/* Right ClipPath */}
      <div
        className="clippath1 max-sm:hidden absolute top-0 right-0 z-[20] bg-[#121212] w-full h-full hidden lg:block "
        style={{
          clipPath:
            "polygon(100% 0%, 100% 30%, 97% 35%, 97% 55%, 100% 60%, 100% 100%)",
        }}>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling (optional)
            animateOverlay(true);
          }}
          className="w-fit  absolute top-[45%] -translate-y-1/2 -right-11 font-semibold text-xl rotate-90  ">
          BESTSELLER
        </button>
      </div>
      {/* Left side */}
      <div
        className="clippath1 max-sm:hidden absolute top-0 left-0 z-[20] bg-[#121212] w-full h-full hidden lg:block "
        style={{
          clipPath:
            "polygon(0% 0%, 0% 30%, 2.5% 35%, 2.5% 55%, 0% 60%,0% 100%)",
        }}></div>
      {/* Bottom CLipPath */}
      <div
        className="clippath1 max-sm:hidden absolute top-0 z-[20] right-0 bg-[#121212] text-white w-full h-full hidden lg:block "
        style={{
          clipPath: "polygon(0% 100%, 40% 100%, 45% 96%, 55% 96%, 60% 100%)",
        }}>
        <h2 className="w-fit font-montserrat absolute bottom-1 hidden  lg:block left-1/2 -translate-x-1/2 text-md   ">
          SCROLL DOWN
        </h2>
      </div>

      {/* Mobile Bottom ClipPath */}
      <div className=" absolute clipP bottom-0 z-[20] right-0 text-white w-full h-full [clip-path:polygon(0%_100%,35%_100%,40%_96%,60%_96%,65%_100%)] block lg:hidden ">
        <h2 className="w-fit  absolute font-montserrat bottom-4 left-1/2 -translate-x-1/2 text-xs md:text-xl  block lg:hidden">
          SCROLL DOWN
        </h2>
      </div>

      {/*Mobile Left Side */}
      <div
        className="absolute top-0 left-0 z-[30] bg-[#121212] w-full h-full block lg:hidden "
        style={{
          clipPath: "polygon(0% 0%, 0% 40%, 5% 45%, 5% 55%, 0% 60%,0% 100%)",
        }}></div>

      <div
        className="clippath1  absolute top-0 right-0 z-[20] bg-[#121212] w-full h-full block lg:hidden "
        style={{
          clipPath:
            "polygon(100% 0%, 100% 40%, 95% 45%, 95% 55%, 100% 60%, 100% 100%)",
        }}>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling (optional)
            animateOverlay(true);
          }}
          className="w-fit absolute top-[50%] lg:hidden -translate-y-1/2 -right-6 md:-right-12 font-semibold text-xs md:text-xl rotate-90  ">
          BESTSELLER
        </button>
      </div>

      <div
        className="clippath1 absolute  -top-1 left-0  z-[20] bg-[#121212] w-full h-full  justify-center items-start  object-cover flex md:hidden "
        style={{
          clipPath:
            "polygon(0px 0px, 35% 0px, 40% 5%,60% 5%, 65% 0px, 100% 0px)",
        }}>
        <Image
          src={"/logo.svg"}
          width={20}
          height={80}
          alt="logo"
          className="object-cover absolute top-2 sm:top-3 left-1/2 -translate-x-1/2"
        />
      </div>
      <div className="relative w-full h-full">
        <Image
          alt="/bgslides/bg-1.png"
          src={backgroundImages[0][0]}
          fill
          priority
          className="lg:hidden object-cover"
        />
        <Image
          alt="/bgslides/bg-1.png"
          src={backgroundImages[0][1]}
          width={1000}
          height={1000}
          className="w-full h-full object-cover hidden lg:block"
        />
      </div>
      <main className=" absolute inset-0 z-10 min-h-screen h-screen w-full bg-black/30 pointer-events-auto">
        <div className="w-full h-full p-2 flex gap-y-80 items-center max-sm:pt-28 relative max-sm:flex-col max-sm:items-start">
          <h2 className="mainText absolute sm:left-28 md:left-10 text-[25vw] md:text-[20vw] lg:text-[12vw] leading-none font-normal md:font-bold font-coluna tracking-wide max-sm:relative max-sm:left-4">
            THE <br />
            ARVAN
          </h2>
          <p className="absolute bottom-0 md:bottom-6 left-6 text-sm md:text-md w-[25%] md:w-[45%] lg:w-[25%] font-montserrat max-sm:relative max-sm:w-[90%]">
            Ready to level up your comfort game? <br />
            Slip into The Arvan, and feel the difference. We’ve got the perfect
            pair waiting for you.
          </p>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
