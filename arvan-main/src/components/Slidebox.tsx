import Image from "next/image";
import React from "react";

type SlideboxProps = {
  image: string;
  name: string;
  price: number;
  category: string;
  discount?: number;
  transform?: string;
};

const Slidebox: React.FC<SlideboxProps> = ({
  image,
  name,
  price,
  category,
  discount = 0,
  transform,
}) => {
  return (
    <div className="h-full w-full rounded-md hover:scale-105 duration-150 cursor-pointer">
      <div className="p-2 bg-white aspect-square rounded-md relative">
        {discount > 0 && (
          <span className="absolute top-2 left-2 text-black rounded-md bg-[#C2E53A] px-2 py-1 text-xs font-bold font-montserrat">
            {(discount / price * 100).toFixed(2)}% OFF
          </span>
        )}
        <Image
          src={image}
          alt={name}
          width={500}
          height={500}
          className="object-cover aspect-square"
          style={transform ? { transform } : {}}
        />
      </div>
      <div className="flex justify-between mt-2 font-coluna text-2xl font-bold tracking-wide">
        <span className="uppercase">{name}</span>
        <span>
        ₹ {discount > 0
            ? discount.toFixed(2)
            : price.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between font-montserrat text-xs text-[#898989]">
        <span className="uppercase">{category}</span>
        {discount > 0 && (
          <span className="line-through text-gray-500">
           ₹{price.toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
};

export default Slidebox;
