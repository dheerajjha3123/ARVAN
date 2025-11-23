"use client";
import React, { useEffect, useRef, useState } from "react";
import { Star, ShoppingCart, Truck } from "lucide-react";
import Image from "next/image";
import ReviewWritings from "../reviewWriting";
import { useQueries } from "@tanstack/react-query";
import { productApi } from "@/lib/api/productdetails";
import { useCart } from "@/context/CartContext";
import Loading from "@/app/product/[id]/loading";
import Navigation from "../navigation";
import BestSellers from "./bestSellers";
import Footer from "../Footer";
import { productReviewApi } from "@/lib/api/productreview";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import cuid from "cuid";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper as Swiper2 } from "swiper/types";
import { useSession } from "next-auth/react";
import SignupPopup from "./SignupPopup";

const ProductDetails: React.FC<{ productId: string }> = ({ productId }) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState("White");
  const [selectedSize, setSelectedSize] = useState("7");
  const [selectedImage, setSelectedImage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const swiperRef = useRef<Swiper2 | null>(null);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const { addToCart } = useCart();
  const router = useRouter();
  const { data: session } = useSession();
  const [showSignupPopup, setShowSignupPopup] = useState(false);

  const handlecloseReviewModal = () => {
    setShowReviewModal(false);
  };
  const handleWriteReview = () => {
    setShowReviewModal(true);
  };

  const handleThumbClick = (index: number) => {
    swiperRef.current?.slideTo(index);
  };

  const results = useQueries({
    queries: [
      {
        queryKey: ["products", productId],
        queryFn: ({ queryKey }) => productApi.getById(queryKey[1] as string),
      },

      {
        queryKey: ["reviews", productId],
        queryFn: ({ queryKey }) =>
          productReviewApi.getById(queryKey[1] as string),
      },
    ],
  });

  const [productData, fetchedReviews] = results;

  // First useEffect - runs when productData.data changes
  useEffect(() => {
    if (productData.data) {
      // Set first color if available
      if (productData.data.colors.length > 0) {
        setSelectedColor(productData.data.colors[0].color);
        // Set first available size for the first color
        const firstColorSizes = productData.data.colors[0].sizes
          .map((size) => size.size.replace("SIZE_", ""))
          .sort((a, b) => Number(a) - Number(b));
        if (firstColorSizes.length > 0) {
          setSelectedSize(firstColorSizes[0]);
        }
      } else {
        setSelectedColor("");
      }

      // Get all color-specific image IDs to exclude them
      const colorImageIds = new Set(
        productData.data.colors.flatMap(
          (color) =>
            color.assets
              .filter((asset) => asset.type === "IMAGE")
              .map((asset) => asset.id) // Store only IDs
        )
      );

      // Load main product images, excluding color-specific images
      const mainImages: string[] = [];
      productData.data.assets.forEach((asset) => {
        if (asset.type === "IMAGE" && !colorImageIds.has(asset.id)) {
          mainImages.push(asset.asset_url);
        }
      });

      setImages(mainImages);

      // Set default selected image from main images
      if (mainImages.length > 0) {
        setSelectedImage(mainImages[0]);
      }
    }
  }, [productData.data]);

  // Second useEffect - runs when selectedColor changes
  useEffect(() => {
    if (productData.data) {
      if (!selectedColor) {
        // Get all color-specific image IDs to exclude them
        const colorImageIds = new Set(
          productData.data.colors.flatMap(
            (color) =>
              color.assets
                .filter((asset) => asset.type === "IMAGE")
                .map((asset) => asset.id) // Store only IDs
          )
        );
        // Load main product images, excluding color-specific images
        const mainImages: string[] = [];
        productData.data.assets.forEach((asset) => {
          if (asset.type === "IMAGE" && !colorImageIds.has(asset.id)) {
            mainImages.push(asset.asset_url);
          }
        });
        setImages(mainImages);

        if (mainImages.length > 0) {
          setSelectedImage(mainImages[0]);
        }
      } else {
        // When a color is selected, show only that color's images
        const currentColor = productData.data.colors.find(
          (color) => color.color === selectedColor
        );

        if (currentColor) {
          // Set color-specific images
          const colorImages: string[] = [];
          currentColor.assets.forEach((asset) => {
            if (asset.type === "IMAGE") {
              colorImages.push(asset.asset_url);
            }
          });

          // If no color-specific images, keep main images (optional)
          if (colorImages.length === 0) {
            const colorImageUrls = new Set(
              productData.data.colors
                .filter((color) => color.color !== selectedColor) // Exclude current color
                .flatMap((color) =>
                  color.assets
                    .filter((asset) => asset.type === "IMAGE")
                    .map((asset) => asset.asset_url)
                )
            );

            productData.data.assets.forEach((asset) => {
              if (
                asset.type === "IMAGE" &&
                !colorImageUrls.has(asset.asset_url)
              ) {
                colorImages.push(asset.asset_url);
              }
            });
          }

          setImages(colorImages);

          // Update available sizes for the selected color
          const sizes = currentColor.sizes
            .map((size) => size.size.replace("SIZE_", ""))
            .sort((a, b) => Number(a) - Number(b));
          setAvailableSizes(sizes);

          // Set default size when color is selected
          if (sizes.length > 0) {
            setSelectedSize(sizes[0]);
          }
          // Update selectedImage to first color-specific asset
          if (colorImages.length > 0) {
            setSelectedImage(colorImages[0]);
          }
        }
      }
    }
  }, [productData.data, selectedColor]);

  return (
    <>
      {productData.isLoading ? (
        <Loading />
      ) : productData.data ? (
        <>
          <Navigation />
          <div className="w-full min-h-screen relative mx-auto pt-10 pb-10 px-6 md:px-12 ">
            <div className="w-full h-full relative mx-auto pb-10  grid grid-cols-1 lg:grid-cols-2 items-start gap-6 lg:gap-8 ">
              {/* Left Section - Image Gallery */}
              <div className="hidden lg:flex lg:sticky lg:top-5  items-center gap-4 ">
                <div className="flex sm:flex-col overflow-x-auto gap-3 order-2 sm:order-1">
                  {images.map((img, index) => (
                    <>
                      <Image
                        key={index}
                        src={img || ""}
                        alt="Thumbnail"
                        height={200}
                        unoptimized
                        width={200}
                        className={`h-12 w-14 cursor-pointer border-2 transition-all duration-200 ${
                          selectedImage === img
                            ? "border-[#c2e53a]"
                            : "border-white"
                        }`}
                        onClick={() => setSelectedImage(img)}
                      />
                    </>
                  ))}
                </div>
                <div className="w-full sm:h-[50dvh] my-10 md:my-0 md:h-[80dvh] order-1 sm:order-2 shadow-[0_4px_20px_rgba(255,255,255,0.3)] rounded-2xl overflow-hidden ">
                  {selectedImage !== "" && (
                    <Image
                      src={selectedImage}
                      height={500}
                      width={500}
                      unoptimized
                      alt="Product"
                      className="w-full h-full object-cover "
                    />
                  )}
                </div>
              </div>

              {/* Mobile Left Section - using Swiper */}
              <div className="flex flex-col sm:flex-row-reverse  lg:hidden   items-center gap-4 ">
                <div className="flex sm:flex-col lg:hidden overflow-x-auto gap-3 order-2 sm:order-1">
                  {images.map((img, index) => (
                    <>
                      <Image
                        key={index}
                        src={img || ""}
                        alt="Thumbnail"
                        height={200}
                        unoptimized
                        width={200}
                        className={`h-12 w-14 cursor-pointer border-2 transition-all duration-200 ${
                          selectedImage === img
                            ? "border-[#c2e53a]"
                            : "border-white"
                        }`}
                        onClick={() => handleThumbClick(index)}
                      />
                    </>
                  ))}
                </div>
                {selectedImage !== "" && (
                  <Swiper
                    speed={700}
                    spaceBetween={20}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    onSlideChange={(swiper) =>
                      setSelectedImage(images[swiper.activeIndex])
                    }
                    className="w-full h-full">
                    {images.map((img, index) => (
                      <SwiperSlide key={index}>
                        <div className="w-full sm:h-[50dvh]   my-10 md:my-0 md:h-[80dvh] order-1 sm:order-2 bg-white rounded-2xl overflow-hidden ">
                          <Image
                            src={img}
                            alt={`Slide ${index}`}
                            width={500}
                            unoptimized
                            height={500}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>

              <div>
                <div className="flex flex-col sm:flex-row justify-between w-full  items-start sm:items-center mt-3">
                  <div className="md:w-[80%]">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-montserrat uppercase">
                      {productData.data.name}
                    </h2>
                    <div className="flex items-center gap-2  my-2 flex-wrap">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-montserrat text-lg sm:text-xl font-bold">
                            {/* {remainProduct.currency} */}₹{" "}
                            {productData.data.discountPrice
                              ? productData.data.discountPrice
                              : productData.data.price}
                          </p>
                          {productData.data.discountPrice && (
                            <p className="text-[#858585] text-lg sm:text-xl font-bold  line-through">
                              ₹ {productData.data.price}
                            </p>
                          )}
                          {productData.data.discountPrice && (
                            <div className="text-black text-normal border font-montserrat  rounded-xl  bg-[#C2E53A] font-bold px-2">
                              {(
                                ((productData.data.price -
                                  productData.data.discountPrice!) /
                                  productData.data.price) *
                                100
                              ).toFixed(2)}
                              %
                            </div>
                          )}
                        </div>
                        <span className="text-[#858585] text-xs mt-1">
                          inclusive of all taxes
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-[20%] flex flex-col items-start sm:items-center gap-1 mt-2 sm:mt-0">
                    <div className="border border-[#c2e53a] px-2 py-1 rounded-md flex items-center gap-1">
                      <Star className="text-[#c2e53a] h-4 w-4" />
                      {fetchedReviews.data &&
                        fetchedReviews.data.reviews.length > 0 && (
                          <>
                            {/* <span className="text-sm">{productData.data.rating}</span> */}
                            <span className="text-sm">
                              {fetchedReviews.data.reviews.length}
                            </span>
                          </>
                        )}
                    </div>
                    <button
                      className="text-[#bababa] w-full text-sm underline"
                      onClick={handleWriteReview}>
                      Write a Review
                    </button>
                    {showReviewModal && (
                      <ReviewWritings
                        onClose={handlecloseReviewModal}
                        productId={productId}
                      />
                    )}
                  </div>
                </div>
                {/* </div> */}
                <hr className="border-gray-600 my-4" />
                {/* Color Selection */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3">
                  <div className="w-full">
                    <p className="text-base mb-4">
                      Select Color: {selectedColor}
                    </p>
                    <div className="flex gap-3 mb-4">
                      {productData.data?.colors.map((color, index) => (
                        <Image
                          key={index}
                          unoptimized
                          src={
                            color.assets[0].asset_url ||
                            productData.data.assets[0]?.asset_url
                          }
                          width={200}
                          height={200}
                          alt={color.color}
                          className={`w-12 h-12 rounded-sm border-2 cursor-pointer transition-all duration-200 ${
                            selectedColor === color.color
                              ? "border-[#c2e53a]"
                              : "border-white"
                          }`}
                          onClick={() => setSelectedColor(color.color)}
                        />
                      ))}
                    </div>

                    {/* Size Selection */}
                    <div className="flex items-center justify-between w-full">
                      <p className="text-base ">Select Size (UK):</p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="text-white underline text-sm font-medium font-montserrat  w-fit uppercase mt-4 sm:mt-0">
                            Size Chart
                          </button>
                        </DialogTrigger>
                        <DialogContent
                          aria-describedby="Size Chart"
                          aria-description="Size Chart"
                          className="bg-black/95 text-white border-white/20">
                          <div className="p-2 rounded-xl overflow-hidden  object-cover">
                            <Image
                              width={2000}
                              height={100}
                              unoptimized
                              src={
                                "https://res.cloudinary.com/dficko9l8/image/upload/v1743685602/size_chart_u9j5gs.png"
                              }
                              alt="Size Chart"
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {availableSizes.length > 0 ? (
                        availableSizes.map((size) => (
                          <button
                            key={size}
                            className={`w-12 h-12 rounded-lg border-2 ${
                              selectedSize === size
                                ? "border-[#c2e53a]"
                                : "border-white"
                            }`}
                            onClick={() => setSelectedSize(size)}>
                            {size}
                          </button>
                        ))
                      ) : (
                        <div className="flex items-center justify-center">
                          <p className="text-white text-sm">
                            Select any Color First
                          </p>
                        </div>
                      )}
                    </div>
                    {/* Size Chart Button */}

                    {/* Buttons */}

                    <div className="mt-10 flex flex-row sm:flex-col md:flex-row w-full justify-between items-center gap-4">
                      <button
                        className="w-full h-10 bg-[#c2e53a] rounded-xl text-black text-xl font-medium uppercase font-montserrat"
                        onClick={() => {

                          if(!session?.user){
                            setShowSignupPopup(true);
                            return;
                          }

                          if (availableSizes.length === 0) {
                            toast.error(
                              `Please select a color first to see available sizes.`,
                              {
                                duration: 2500,
                              }
                            );
                            return;
                          }

                          addToCart({
                            id: cuid(),
                            productId: productData.data.id,
                            productVariantId: productData.data.colors
                              .find((color) => color.color === selectedColor)
                              ?.sizes.find(
                                (size) => size.size === `SIZE_${selectedSize}`
                              )?.id,
                            name: productData.data.name,
                            price:
                              productData.data.discountPrice ||
                              productData.data.price,
                            quantity: 1,
                            color: selectedColor,
                            size: selectedSize,
                            asset: selectedImage,
                            image: selectedImage,
                            // stock: stockInfo?.stock || 0,
                            material: productData.data.material,
                          });

                          toast.success(
                            `${productData.data.name} has been added to your cart.`,
                            {
                              duration: 2500,
                            }
                          );

                          router.push("/cart");
                        }}>
                        Buy Now
                      </button>
                      <div className="w-full flex items-center  justify-center gap-1">
                        <button
                          className="w-full h-10 border border-[#c2e53a] text-white  text-sm md:text-xl font-normal uppercase font-montserrat flex items-center justify-center gap-2 rounded-xl"
                          onClick={() => {
                            if (availableSizes.length === 0) {
                              toast.error(
                                `Please select a color first to see available sizes.`,
                                {
                                  duration: 2500,
                                }
                              );
                              return;
                            }

                            addToCart({
                              id: cuid(),
                              productId: productData.data.id,
                              productVariantId: productData.data.colors
                                .find((color) => color.color === selectedColor)
                                ?.sizes.find(
                                  (size) => size.size === `SIZE_${selectedSize}`
                                )?.id,
                              name: productData.data.name,
                              price:
                                productData.data.discountPrice ||
                                productData.data.price,
                              quantity: 1,
                              color: selectedColor,
                              size: selectedSize,
                              asset: selectedImage,
                              image: selectedImage,
                              // stock: stockInfo?.stock || 0,
                              material: productData.data.material,
                            });

                            toast.success(
                              `${productData.data.name} has been added to your cart.`,
                              {
                                duration: 2500,
                              }
                            );
                          }}>
                          <ShoppingCart className="h-5 w-5" /> Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div className="mt-10 border-t border-white pt-4">
                  <h3 className="text-2xl mt-5 sm:text-3xl font-montserrat lg:text-4xl font-bold">
                    Product Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-base lg:text-lg">
                    <p className="text-[#b3b3b3]">Description</p>{" "}
                    <p className="text-white uppercase text-sm">
                      {productData.data.description}
                    </p>
                    <p className="text-[#b3b3b3]">Material</p>{" "}
                    <p className="text-white uppercase">
                      {productData.data.material}
                    </p>
                    <p className="text-[#b3b3b3]">Color</p>{" "}
                    <p className="text-white">{selectedColor}</p>
                    <p className="text-[#b3b3b3] ">Name</p>{" "}
                    <p className="text-white ">{productData.data.name}</p>
                    <p className="text-[#b3b3b3]">Size</p>{" "}
                    <p className="text-white">{selectedSize}</p>
                  </div>
                </div>
                <div className="mt-10 border-t border-white pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-5">
                    {/* Free Shipping */}
                    <div className="flex flex-col items-center text-center p-4 border border-gray-700 rounded-lg">
                      <div className="relative mb-3">
                        <Truck className="text-[#c2e53a]" />
                      </div>
                      <h4 className="text-lg font-semibold mb-1">
                        Free Shipping
                      </h4>
                      <p className="text-sm text-gray-400">
                        Free shipping for all orders.
                      </p>
                    </div>

                    {/* Cash on Delivery */}
                    <div className="flex flex-col items-center text-center p-4 border border-gray-700 rounded-lg">
                      <div className="mb-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          role="img"
                          color="#c2e53a">
                          <path
                            d="M2 4.5H10L14 8"
                            stroke="#c2e53a"
                            stroke-width="1.5"
                            stroke-linecap="square"></path>
                          <path
                            d="M5 13.5H2"
                            stroke="#c2e53a"
                            stroke-width="1.5"
                            stroke-linecap="square"></path>
                          <path
                            d="M8.5 7.5L10.5 9.5C11.0523 10.0523 11.0523 10.9477 10.5 11.5C9.94772 12.0523 9.05229 12.0523 8.5 11.5L7 10C6.13931 10.8607 4.77671 10.9575 3.80294 10.2272L3.5 10"
                            stroke="#c2e53a"
                            stroke-width="1.5"
                            stroke-linecap="square"></path>
                          <path
                            d="M5 11V19.5H22V8.5H10"
                            stroke="#c2e53a"
                            stroke-width="1.5"
                            stroke-linecap="square"></path>
                          <path
                            d="M15.25 14C15.25 14.9665 14.4665 15.75 13.5 15.75C12.5335 15.75 11.75 14.9665 11.75 14C11.75 13.0335 12.5335 12.25 13.5 12.25C14.4665 12.25 15.25 13.0335 15.25 14Z"
                            stroke="#c2e53a"
                            stroke-width="1.5"
                            stroke-linecap="square"></path>
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold mb-1">
                        Cash on Delivery
                      </h4>
                      <p className="text-sm text-gray-400">
                        Cash on delivery at Zero Cost.
                      </p>
                    </div>

                    {/* Easy Return */}
                    <div className="flex flex-col items-center text-center p-4 border border-gray-700 rounded-lg">
                      <div className="mb-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          role="img"
                          color="#c2e53a">
                          <path
                            d="M2 8L5 2L19 2.00001L22 8"
                            stroke="#c2e53a"
                            stroke-width="1.5"></path>
                          <path
                            d="M12 8V2"
                            stroke="#c2e53a"
                            stroke-width="1.5"></path>
                          <path
                            d="M9 12H15"
                            stroke="#c2e53a"
                            stroke-width="1.5"></path>
                          <path
                            d="M22 13V8H2V22H19C20.6569 22 22 20.6569 22 19C22 17.3431 20.6569 16 19 16L15.5 16"
                            stroke="#c2e53a"
                            stroke-width="1.5"
                            stroke-linejoin="round"></path>
                          <path
                            d="M18 13.5L15.5 16L18 18.5"
                            stroke="#c2e53a"
                            stroke-width="1.5"></path>
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold mb-1">
                        Easy Return
                      </h4>
                      <p className="text-sm text-gray-400">
                        Free 7 day Return and Exchange.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-10 border-t border-white pt-4">
                  <h3 className="text-2xl mt-5 sm:text-3xl font-montserrat lg:text-4xl font-bold">
                    Mandatory Product Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-base lg:text-lg">
                    <p className="text-[#b3b3b3]">Manufacturer</p>
                    <p className="text-white uppercase text-sm ">
                      AK ENTERPRISES E / 120 NOIDA SEC 7 – 201301
                    </p>
                    <p className="text-[#b3b3b3]">
                      Month & Year of Manufacture
                    </p>
                    <p className="text-white">
                      {new Date(productData.data.createdAt).toLocaleString(
                        "en-US",
                        { month: "long", year: "numeric" }
                      )}
                    </p>
                    <p className="text-[#b3b3b3]">MRP</p>
                    <p className="text-white">
                      ₹{productData.data.price.toFixed(2)} (Inclusive of all
                      taxes)
                    </p>
                  </div>
                </div>

                <div className="mt-10 border-t border-white pt-4">
                  <h3 className="text-2xl  mt-5 sm:text-3xl lg:text-4xl font-bold">
                    Ratings & Reviews
                  </h3>

                  {/* Rating Overview */}

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between my-3  gap-4 sm:gap-0">
                    <div className="flex items-center gap-1">
                      <div className="border border-gray-700 rounded-lg px-3 py-1  flex items-center gap-1">
                        <Star className="text-[#c2e53a]  h-4 w-4" />
                        <span className="text-md">{5}</span>
                      </div>
                      <span className="text-[#bababa] text-sm">
                        {/* Total Ratings {fetchedReviews.reviews.length} */}
                      </span>
                    </div>

                    {/* Rate Product Button */}
                    <button
                      className="text-base px-4 py-2 rounded-lg bg-gradient-to-r from-[#c3e53a85] via-[#3a5b0b] to-[#3a5b0b5e] border border-[#C2E53A] w-full sm:w-48 h-10"
                      onClick={handleWriteReview}>
                      Rate Product
                    </button>
                  </div>

                  {/* Review Filters */}
                  <div className="mt-3 flex flex-wrap gap-3 sm:gap-6">
                    {["Color", "Comfort", "Perfect Fit", "Value for Money"].map(
                      (filter) => (
                        <button
                          key={filter}
                          className="border border-[#c2e53a] px-3 sm:px-6 py-1 rounded-sm text-sm sm:text-base">
                          {filter}
                        </button>
                      )
                    )}
                  </div>

                  <hr className="opacity-10 my-5 border" />

                  {/* Show Reviews or Empty State */}
                  {fetchedReviews.data &&
                    fetchedReviews.data.reviews.length > 0 && (
                      <div className="flex flex-col gap-2 w-full">
                        {fetchedReviews.data.reviews.map((review, i) => (
                          <>
                            <div
                              className=" w-full  flex  gap-2 items-center"
                              key={i}>
                              <h1 className="font-montserrat text-zinc-500 text-xl">
                                {review.title}
                              </h1>
                              <div className="border border-[#c2e53a] px-2 py-1 rounded-md flex items-center gap-1">
                                <Star className="text-[#c2e53a] h-4 w-4" />
                                <span className="text-sm">
                                  {review.rating}
                                </span>{" "}
                              </div>
                            </div>
                            <div className=" w-full ">
                              <p className="text-sm md:text-lg">
                                {review.description}
                              </p>
                            </div>
                          </>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          <hr className="opacity-50 my-4" />

          <div className="w-full mb-22 h-full">
            <BestSellers />
          </div>

          <div className="w-full mt-10">
            <Footer />
          </div>
          {showSignupPopup && (
            <SignupPopup onClose={() => setShowSignupPopup(false)} />
          )}
        </>
      ) : (
        productData.isError && <h1>Something went wrong.</h1>
      )}
    </>
  );
};
export default ProductDetails;
