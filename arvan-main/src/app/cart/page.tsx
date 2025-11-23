"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Minus, ArrowLeft } from "lucide-react";
import Navigation from "@/components/navigation";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [giftCode, setGiftCode] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { cart, updateQuantity, removeFromCart } = useCart();

  const router = useRouter();

  const subtotal =
    cart && cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      router.push("/checkout");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Header - Only visible on small screens */}
      <Navigation />

      {/* Cart Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Cart Header */}

        <div className="flex items-center gap-4 mb-8">
          <Link href="/product" className="">
            <ArrowLeft className="w-6 h-6  " />
          </Link>
          <h1 className="text-2xl md:text-4xl font-bold text-center md:text-left flex-1 ">
            ITEMS IN CART
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 relative">
            {/* Blurred circle in background */}
            <div className="absolute pointer-events-none w-[60vw] h-[40vw] rounded-full bg-lime-500/15 blur-[200px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1]"></div>

            {/* Desktop Table Header - Hidden on mobile */}
            <div className="hidden md:grid grid-cols-7  gap-4 border-b border-gray-800 pb-4 mb-4">
              <div className="col-span-2">ITEM</div>
              <div>COLOR</div>
              <div>SIZE</div>
              <div>QUANTITY</div>
              <div>PRICE</div>
              <div className="text-center">REMOVE</div>
            </div>

            {/* Blurred circle in background */}
            <div className="absolute pointer-events-none w-[80vw] h-[80vw] rounded-full bg-lime-500/20 blur-[100px] left-1/2 top-[30%]  md:hidden transform -translate-x-1/2 -translate-y-1/2 z-[1]"></div>
            {/* Cart Items */}

            {cart.length > 0 ? (
              <div className="space-y-6 relative z-2">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex md:grid md:grid-cols-7 gap-4 items-center border-b border-gray-800 pb-6"
                  >
                    {/* Mobile Layout */}
                    <div className="flex md:hidden w-full relative">
                      <div className="w-24 h-24 bg-white rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={item.asset || "/placeholder.svg"}
                          alt={item.name}
                          width={96}
                          height={96}
                          unoptimized
                          loading="lazy"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between ml-4">
                        <div className="flex justify-between">
                          <span className="font-medium text-lg">
                            {item.name}
                          </span>
                          <button
                            onClick={() =>
                              removeFromCart(item.id, item.size, item.color)
                            }
                            className="text-gray-400 hover:text-white"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="text-xl font-bold">₹{item.price}</div>
                        <div className="flex items-center justify-end mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.size,
                                item.color,
                                item.quantity - 1
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#CCFF00] text-black"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center">
                            {item.quantity.toString().padStart(2, "0")}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.size,
                                item.color,
                                item.quantity + 1
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#CCFF00] text-black"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout - Hidden on mobile */}
                    <div className="hidden md:flex md:col-span-2 items-center gap-4">
                      <div className="w-16 h-16 bg-white rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={item.asset || "/placeholder.svg"}
                          alt={item.name}
                          width={64}
                          unoptimized
                          height={64}
                          loading="lazy"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </div>

                    <div className="hidden md:block">
                      {item.color || "white"}
                    </div>
                    <div className="hidden md:block">{item.size}</div>

                    <div className="hidden md:flex items-center">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.size,
                            item.color,
                            item.quantity - 1
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center border border-gray-700 rounded-l hover:bg-gray-800"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 h-8 flex items-center justify-center border-t border-b border-gray-700">
                        {item.quantity.toString().padStart(2, "0")}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.size,
                            item.color,
                            item.quantity + 1
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center border border-gray-700 rounded-r hover:bg-gray-800"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="hidden md:block">₹{item.price}</div>

                    <div className="hidden md:flex justify-center ">
                      <button
                        onClick={() =>
                          removeFromCart(item.id, item.size, item.color)
                        }
                        className="text-gray-400 hover:text-white "
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">Your cart is empty</p>
                <Link href="/product">
                  <Button className="bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Order Summary - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div
              className="rounded-xl lg:mt-5 p-6 relative overflow-hidden"
              style={{
                backdropFilter: "blur(100px)",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              }}
            >
              {/* Blurred circle in background */}
              <div className="absolute w-72 h-72 rounded-full bg-lime-500/30 blur-[100px]  left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-1"></div>

              <h2 className="text-xl font-bold mb-6">Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                {/* <div className="flex justify-between">
                  <span className="text-gray-300">Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div> */}

                {/* <div className="flex justify-between">
                  <span className="text-gray-300">Shipping Charges</span>
                  <span>₹{shippingCharges}</span>
                </div> */}

                <div className="mt-4 relative">
                  <Input
                    type="text"
                    placeholder="Enter Gift Code"
                    className="w-full border-none  bg-transparent border-b border-gray-600 pb-2 pr-10 focus:outline-none focus:border-lime-400"
                    value={giftCode}
                    onChange={(e) => setGiftCode(e.target.value)}
                  />
                  <button className="absolute right-0 top-0 text-gray-400 hover:text-white">
                    <span>→</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-700 mt-6">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-[#c2e53a] text-black text-xl font-montserrat rounded-lg py-3 font-semibold mt-6 uppercase cursor-pointer hover:bg-[#aecc34]"
                  disabled={subtotal === 0 || isLoading}
                  onClick={handleCheckout}
                >
                  {isLoading ? "Processing..." : "Checkout"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Summary - Fixed at bottom */}
        <div className="lg:hidden fixed w-full bottom-0 left-0 right-0 bg-[#111111] p-4 z-10">
          {showSummary ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Summary</h2>
                <button
                  onClick={() => setShowSummary(false)}
                  className="bg-[#CCFF00] text-black p-2 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
{/* 
                <div className="flex justify-between">
                  <span className="text-gray-300">Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div> */}
{/* 
                <div className="flex justify-between">
                  <span className="text-gray-300">Shipping Charges</span>
                  <span>₹{shippingCharges}</span>
                </div> */}

                <div className="mt-4 relative">
                  <Input
                    type="text"
                    placeholder="Enter Gift Code"
                    className="w-full bg-transparent border-none border-gray-600 pb-2 pr-10 focus:outline-none focus:border-lime-400"
                    value={giftCode}
                    onChange={(e) => setGiftCode(e.target.value)}
                  />
                  <button className="absolute right-0 top-0 text-gray-400 hover:text-white">
                    <span>→</span>
                  </button>
                </div>

                <div className="flex justify-between pt-4 border-t border-gray-800 text-xl font-bold">
                  <span>Total</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <Button
                  disabled={subtotal === 0 || isLoading}
                  className="w-full h-12 bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90 font-bold"
                  onClick={handleCheckout}
                >
                  {isLoading ? "Processing..." : "CHECKOUT"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Total</div>
                <div className="text-xl font-bold">₹{subtotal.toFixed(2)}</div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowSummary(true)}
                  variant="outline"
                  className="border-gray-700 h-12 w-12 p-0"
                >
                  <Plus className="w-5 h-5" />
                </Button>
                <Button
                  disabled={subtotal === 0 || isLoading}
                  className="h-12 bg-[#CCFF00] text-black hover:bg-[#CCFF00]/90 font-bold px-8"
                  onClick={handleCheckout}
                >
                  {isLoading ? "Processing..." : "CHECKOUT"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Add padding at the bottom to prevent content from being hidden behind the fixed summary */}
        <div className="lg:hidden h-24"></div>
      </div>
    </div>
  );
}

