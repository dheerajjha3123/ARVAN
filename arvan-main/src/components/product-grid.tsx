"use client";
import Link from "next/link";
import Image from "next/image";
import { Products } from "./admin/products-table";
import { useEffect, useState } from "react";
export default function ProductGrid({
  product,
  index,
}: {
  product: Products;
  index: number;
}) {
  const [borderClasses, setBorderClasses] = useState("border border-gray-200");

  useEffect(() => {
    // Function to update border classes based on current grid layout
    const updateBorderClasses = () => {
      let columns = 2; // Default (mobile)

      // Determine current column count based on viewport width
      if (window.innerWidth >= 1024) {
        columns = 4; // lg breakpoint
      } else if (window.innerWidth >= 768) {
        columns = 3; // md breakpoint
      }

      const isLeftEdge = index % columns === 0;
      const isRightEdge = index % columns === columns - 1;

      let classes = "border-t border-b border-gray-200 ";
      if (isLeftEdge) {
        classes += "border-r border-gray-200 ";
      } else if (isRightEdge) {
        classes += "border-l border-gray-200 ";
      } else {
        classes += "border-l border-r border-gray-200 ";
      }

      setBorderClasses(classes);
    };

    // Set initial classes
    updateBorderClasses();

    // Update on window resize
    window.addEventListener("resize", updateBorderClasses);
    return () => window.removeEventListener("resize", updateBorderClasses);
  }, [index]);
  return (
    <Link
      href={`/product/${product.id}`}
      className={`group  ${borderClasses}   font-montserrat`}
    >
      <div className="relative aspect-square overflow-hidden  ">
        {product.discountPrice && (
          <span className="absolute top-2 right-2 bg-[#CCFF00] text-black px-2 py-1 text-sm rounded">
            {(
              ((product.price - product.discountPrice!) / product.price) *
              100
            ).toFixed(2)}
            % off
          </span>
        )}
        <Image
          src={product?.assets![0].asset_url || "/placeholder.svg"}
          alt={product.name}
          width={400}
          height={400}
          loading="lazy"
          unoptimized
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="px-3 py-5">
        <div className="flex flex-col md:flex-row items-start text-xs lg:text-lg md:items-center gap-2 md:gap-0 md:justify-between mb-2">
          <h3 className="font-bold ">{product.name}</h3>
          <div className="text-right">
            <div className="font-bold ">
              ₹ {product.discountPrice ? product.discountPrice : product.price}
            </div>
            {product.discountPrice && (
              <div className="text-sm text-gray-400 line-through">
                ₹{product.price}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
