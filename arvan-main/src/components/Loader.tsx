import Image from "next/image";
import React from "react";

const Loader = () => {
  return (
    <div className="w-full h-[100dvh] z-[1000] bg-black fixed overflow-hidden flex justify-center items-center object-cover">
      <Image
        src={"/logo.svg"}
        width={150}
        height={100}
        alt="Logo"
        className="will-change-transform pulse"
      />
    </div>
  );
};

export default Loader;
