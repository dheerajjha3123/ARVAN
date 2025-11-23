import React from "react";

const BentoImg = () => {
  const imageUrl = "https://res.cloudinary.com/dficko9l8/image/upload/v1743685583/Desktop_tds6fg.png";
  return (
    <div className="relative w-full max-w-xl  hidden lg:grid grid-cols-2 gap-2">
      {/* Top-left large cell (spans 1 row, 1 column) */}
      <div className="relative overflow-hidden rounded-lg border-2 border-lime-500">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: "0% 0%",
            backgroundSize: "200% 310%",
          }}
        />
      </div>

      {/* Top-right large cell (spans 2 rows, 1 column) */}
      <div className="relative overflow-hidden rounded-lg border-2 border-lime-500 row-span-2">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: "100% 0%",
            backgroundSize: "200% 150%",
          }}
        />
      </div>

      {/* Middle-left small cell */}
      <div className="relative overflow-hidden rounded-lg border-2 border-lime-500">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: "1% 50%",
            backgroundSize: "200% 300%",
          }}
        />
      </div>

      {/* Bottom-left large cell (spans 1 row, 1 column) */}
      <div className="relative overflow-hidden rounded-lg border-2 border-lime-500">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: "0% 100%",
            backgroundSize: "200% 300%",
          }}
        />
      </div>

      {/* Bottom-right large cell */}
      <div className="relative overflow-hidden rounded-lg border-2 border-lime-500">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: "100% 100%",
            backgroundSize: "200% 300%",
          }}
        />
      </div>
    </div>
  );
};

export default BentoImg;
