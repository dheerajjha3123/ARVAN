import { ArrowLeft } from "lucide-react";
import React from "react";
import LogoMarquee from "../LogoMarquee";

const ShopNowAt = () => {
  return (
    <section className="py-12">
      <div className=" p-6 md:px-20">
        <div className="flex items-center gap-3 mb-3 sm:mb-5">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold">
            Shop Now At
          </h2>
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-lime-400 flex items-center justify-center relative overflow-hidden group cursor-pointer -rotate-45 shrink-0">
            <div className="absolute transform transition-transform duration-300 ease-in-out group-hover:-translate-x-[120%]">
              <ArrowLeft className="text-black w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" />
            </div>

            <div className="absolute transform translate-x-[120%] transition-transform duration-300 ease-in-out group-hover:translate-x-0">
              <ArrowLeft className="text-black w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" />
            </div>
          </div>
        </div>
        <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-3xl">
          Shop with ease on your favorite platforms! Find our products on
          Flipkart, Amazon, Meesho, and Myntra for a seamless shopping
          experience and fast delivery.
        </p>

        <LogoMarquee />
      </div>
    </section>
  );
};

export default ShopNowAt;
