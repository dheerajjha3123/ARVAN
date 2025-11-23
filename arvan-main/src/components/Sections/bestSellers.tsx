"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Slidebox from "../Slidebox";
import { useQuery } from "@tanstack/react-query";
import { analyticApi } from "@/lib/api/analytic";

const BestSellers = () => {
  const [autoplayDelay, setAutoplayDelay] = useState(3000);

  const { data: slides , isLoading } = useQuery({
    queryKey: ["top-products"],
    queryFn: async () => analyticApi.getBestSellers(),
  });

  useEffect(() => {
    const updateAutoplay = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 450) {
        setAutoplayDelay(1000);
      } else {
        setAutoplayDelay(3000);
      }
    };

    updateAutoplay();
    window.addEventListener("resize", updateAutoplay);
    return () => {
      window.removeEventListener("resize", updateAutoplay);
    };
  }, []);

  if(isLoading) return <div className="w-full min-h-[50dvh] mt-16 flex justify-center items-center">Loading BestSellers...</div>

  return (
    <div className="w-full min-h-[50dvh] mt-16">
      <div className="flex sm:flex-row gap-4 items-center justify-start w-full px-6">
        <div className="w-full sm:w-fit p-2 flex items-center gap-4 max-sm:gap-1 sm:justify-start">
          <h5 className="font-general_sans text-2xl max-sm:text-xl font-semibold whitespace-nowrap">
            Bestsellers • Bestsellers
          </h5>
          {/* ArrowLeft Icon */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-lime-400 flex items-center justify-center relative overflow-hidden group cursor-pointer -rotate-[130deg] shrink-0">
            <div className="absolute transform transition-transform duration-300 ease-in-out group-hover:-translate-x-[120%]">
              <ArrowLeft className="text-black w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" />
            </div>
            <div className="absolute transform translate-x-[120%] transition-transform duration-300 ease-in-out group-hover:translate-x-0">
              <ArrowLeft className="text-black w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" />
            </div>
          </div>

          {/* Text */}
        </div>
      </div>

      <div className="w-full h-auto p-4 mt-10 overflow-hidden">
        {slides && (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={10}
            slidesPerView={1}
            centeredSlides={true}
            autoplay={{
              delay: autoplayDelay, // Delay between slides in milliseconds
              disableOnInteraction: true, // Continue autoplay even after user interaction
              reverseDirection: true,
            }}
            loop={true}
            speed={1000}
            breakpoints={{
              450: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              451: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 40,
              },
              1600: {
                slidesPerView: 5,
                spaceBetween: 50,
              },
            }}
            className="w-full h-full flex items-center justify-center"
          >
            {slides.map((slide, index) => (
              <SwiperSlide
                key={index}
                className="h-full flex justify-center items-center p-2"
              >
                <Link href={`/product/${slide.id}`}>
                  <Slidebox
                    image={slide.img}
                    name={slide.name}
                    price={slide.price}
                    category={slide.category}
                    discount={slide.discount}
                    transform="scaleX(-1)"
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default BestSellers;
