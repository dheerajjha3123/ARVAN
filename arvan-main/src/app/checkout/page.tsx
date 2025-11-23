"use client";

import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { Address, AddressApi } from "@/lib/api/address";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PiPencilSimple } from "react-icons/pi";
import Script from "next/script";
import { useSession } from "next-auth/react";
import { Order, orderApi } from "@/lib/api/orders";
import { apiClient } from "@/lib/axiosClient";
import cuid from "cuid";

const Checkout: React.FC = () => {
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
const [isPaymentFailed, setIsPaymentFailed] = useState(false);
const [paymentErrorMessage, setPaymentErrorMessage] = useState("");
const [errorMessage, setErrorMessage] = useState("");
const { cart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const { data: addresses } = useQuery({
    queryKey: ["address"],
    queryFn: async () => {
      const rawAddress = await AddressApi.getAddress();
      return rawAddress.map((addr: Address) => ({
        id: addr.id,
        name: addr.name ? addr.name : "Guest",
        details: `${addr.street}, ${addr.city}, ${addr.state}, ${addr.country} - ${addr.zipCode}`,
        street: addr.street,
        city: addr.city,
        state: addr.state,
        country: addr.country,
        zipCode: addr.zipCode,
      }));
    },
  });

  const createShiprocketOrder = async (orderId: string) => {
    const selectedAddr = addresses?.find((a) => a.id === selectedAddress);

    if (!selectedAddr) {
      throw new Error("Selected address not found.");
    }

    const orderData = {
      order_id: orderId || cuid(), // Ensure unique order ID
      order_date: new Date().toISOString().slice(0, 10),
      pickup_location: "Home",
      billing_customer_name: selectedAddr.name.split(" ")[0] || "Guest",
      billing_address: selectedAddr.details || "N/A",
      billing_city: selectedAddr.city || "N/A",
      billing_pincode: selectedAddr.zipCode || "000000",
      billing_state: selectedAddr.state || "N/A",
      billing_last_name: selectedAddr.name.split(" ")[1] || " ",
      billing_country: "India",
      billing_email: session?.user?.email || "test@test.com",
      billing_phone: session?.user?.mobile_no
        ? session.user.mobile_no.slice(-10)
        : "0000000000",
      shipping_is_billing: true,
      order_items: cart.map((item) => ({
        name: item.name,
        sku: `ARV${item.color || "Default"}${item.size || "Free"}`,
        units: item.quantity || 1,
        selling_price: item.price?.toString() || "0",
        hsn: Math.floor(Math.random() * 10000).toString(),
      })),
      payment_method: paymentMethod === "cod" ? "COD" : "Prepaid",
      sub_total: subtotal || 0,
      shipping_charges: 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: 0,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 1,
    };

    await apiClient.post("/api/shiprocket", orderData);
  };

const handleSubmit = async () => {
  console.log("clicked");
  setErrorMessage("");
  if (!selectedAddress) {
    setErrorMessage("Please select an address.");
    return;
  }
  if (!paymentMethod) {
    setErrorMessage("Please select a payment method.");
    return;
  }
  if (!cart || cart.length === 0) {
    setErrorMessage("Your cart is empty.");
    return;
  }
  setIsLoading(true);
    if (paymentMethod === "cod") {
      orderMutaion.mutate(
        {
          userId: session?.user?.id as string,
          addressId: selectedAddress,
          total:subtotal,
          items: cart.map((item) => ({
            productId: item.productId,
            color: item.color,
            productName: item.name,
            size: item.size,
            productVariantId: item.productVariantId as string,
            quantity: item.quantity,
            priceAtOrder: item.price,
            productImage: item.image,
          })),
          status: "PENDING",
        },
        {
          onSuccess: async (data) => {
            console.log("Order created successfully:", data);
            try {
              await createShiprocketOrder(data.id as string);
              console.log("Shiprocket order created");
            } catch (err) {
              console.error("Failed to create Shiprocket order", err);
            }
            setIsLoading(false);
            router.push("/profile");
          },
          onError: (error) => {
            console.error("Order creation failed:", error);
            setIsLoading(false);
          },
        }
      );
    } else {
      setIsPaymentProcessing(true);
      processPayment();
    }
  };

  const orderMutaion = useMutation({
    mutationFn: (order: Order) => {
      return orderApi.createOrder(order);
    },
  });

  // Sync selected address with fetched data
  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses[0].id); // Only set default if no address is selected
    }
  }, [addresses, selectedAddress]);

  const selectAddress = (id: string) => {
    setSelectedAddress(id);
    // Optionally, update backend state if needed
    // AddressApi.updateSelectedAddress(id);
  };

  // Checkout calculations
  const subtotal =
    cart?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  const createOrderId = async () => {
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: subtotal * 100,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data.orderId;
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  const processPayment = async () => {
    try {
      const orderId: string = await createOrderId();
      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: subtotal * 100,
        currency: "INR",
        name: "Arvan Footwear",
        description: "Arvan Footwear Order",
        order_id: orderId,

        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          setIsPaymentProcessing(false);
          const data = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const result = await fetch("/api/verify", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
          });
          const res = await result.json();
          if (res.isOk) {
            orderMutaion.mutate(
              {
                userId: session?.user?.id as string,
                addressId: selectedAddress,
                total: subtotal,
                items: cart.map((item) => ({
                  productId: item.productId,
                  color: item.color,
                  productName: item.name,
                  size: item.size,
                  productVariantId: item.productVariantId as string,
                  quantity: item.quantity,
                  priceAtOrder: item.price,
                  productImage: item.image,
                })),
                status: "PENDING",
              },
              {
                onSuccess: async (data) => {
                  const orderId = data?.id;

                  // 🔥 Shiprocket Order
                  await createShiprocketOrder(orderId as string);
                  router.push("/profile");
                },
                onError: (error) => {
                  console.error("Error creating order:", error);
                },
              }
            );
          } else {
            setIsPaymentProcessing(false);
            setIsPaymentFailed(true);
            setPaymentErrorMessage(res.message);
          }
        },
        prefill: {
          name: session?.user?.name,
          contact: session?.user?.mobile_no,
        },
        theme: {
          color: "#3399cc",
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.on(
        "payment.failed",
        function (response: { error: { description: string } }) {
          setIsPaymentProcessing(false);
          setIsPaymentFailed(true);
          setPaymentErrorMessage(response.error.description);
        }
      );
      paymentObject.open();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <Navbar />

      <div className="container mx-auto max-w-6xl relative">
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
            <div className="bg-black/80 border border-lime-500 p-6 rounded-lg shadow-lg text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-bold text-lime-400">
                  Processing your order...
                </p>
              </div>
            </div>
          </div>
        )}

        {isPaymentProcessing && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
            <div className="bg-black/80 border border-lime-500 p-6 rounded-lg shadow-lg text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-bold text-lime-400">
                  Redirecting to payment...
                </p>
              </div>
            </div>
          </div>
        )}
        {isPaymentFailed && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
            <div className="bg-black/80 border border-red-500 p-6 rounded-lg shadow-lg text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 text-red-500 mb-4 flex items-center justify-center border-2 border-red-500 rounded-full">
                  <span className="text-2xl">❌</span>
                </div>
                <p className="text-lg font-bold text-red-400">Payment Failed</p>
                <p className="text-gray-400 mt-2">{paymentErrorMessage}</p>
                <button
                  onClick={() => {
                    setIsPaymentFailed(false);
                    router.push("/cart");
                  }}
                  className="mt-4 px-4 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Blurred Background */}
        <div className="absolute w-[80vw] h-[40vw] rounded-full bg-lime-600/15 blur-3xl left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-1"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center relative z-10">
          {/* Left Section: Address & Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address Section */}
            <div>
              <h2 className="text-4xl font-bold mb-4">Delivery To</h2>
              {/* {isLoading && <p>Loading addresses...</p>}
              {isError && <p>Error fetching addresses.</p>} */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Address Cards */}
                {addresses &&
                  addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`p-4 rounded-lg flex justify-between items-center cursor-pointer ${
                        selectedAddress === address.id
                          ? "border border-lime-400"
                          : "border-none"
                      }`}
                      style={{
                        backdropFilter: "blur(100px)",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      }}
                      onClick={() => selectAddress(address.id)}
                    >
                      <div className="flex items-start space-x-2">
                        {selectedAddress === address.id && (
                          <div className="bg-lime-400 rounded-full p-1 mt-1">
                            <div className="h-2 w-2 rounded-full bg-white"></div>
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium">{address.name}</h3>
                          <p className="text-gray-400 text-sm">
                            {address.details}
                          </p>
                        </div>
                      </div>
                      <button className="text-gray-200 hover:text-white">
                        <PiPencilSimple size={20} />
                      </button>
                    </div>
                  ))}

                {/* Add New Address Button */}
                <Link
                  href="/address"
                  className="p-4 rounded-lg bg-transparent border-2 border-lime-900 flex items-center justify-center cursor-pointer h-full"
                  style={{
                    backdropFilter: "blur(100px)",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <span className="text-lime-400">Add New Address</span>
                </Link>
              </div>
            </div>

            {/* Payment Methods Section */}
            <div>
              <h2 className="text-4xl font-bold mb-4">Payment Methods</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  {
                    id: "upi",
                    label: "UPI (Unified Payments Interface)",
                    icon: "/upi.svg",
                  },
                  { id: "cod", label: "Cash On Delivery", icon: "/money.svg" },
                  { id: "credit", label: "Credit Card", icon: "/wallet.svg" },
                ].map(({ id, label, icon }) => (
                  <div
                    key={id}
                    className={`p-4 rounded-lg bg-[#6c8118] border flex justify-between items-center cursor-pointer ${
                      paymentMethod === id
                        ? "border-lime-400"
                        : "border-gray-800"
                    }`}
                    onClick={() => setPaymentMethod(id)}
                  >
                    <div className="flex items-center">
                      <div className="bg-white p-2 rounded mr-3">
                        <Image src={icon} alt={label} width={40} height={40} unoptimized loading="lazy" />
                      </div>
                      <label htmlFor={`${id}-radio`} className="cursor-pointer">
                        {label}
                      </label>
                    </div>
                    <input
                      type="radio"
                      id={`${id}-radio`}
                      name="payment-method"
                      value={id}
                      checked={paymentMethod === id}
                      onChange={() => setPaymentMethod(id)}
                      className="w-5 h-5 accent-lime-500 appearance-none checked:bg-lime-400 checked:border-lime-800 border-2 border-lime-400 rounded-full"
                      aria-label={`Select ${label} payment method`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section: Order Summary */}
          <div className="lg:col-span-1">
            <div
              className="border-2 border-lime-500 rounded-lg lg:mt-5 p-6"
              style={{
                backdropFilter: "blur(100px)",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              }}
            >
              <h2 className="text-xl font-bold mb-6">Payment Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Subtotal</span>
                  <span>₹{subtotal?.toFixed(2)}</span>
                </div>
                {/* <hr className="border-gray-600" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total?.toFixed(2)}</span>
                </div> */}
              </div>
              <button
                onClick={() => handleSubmit()}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow h-9 px-4 w-full bg-[#c2e53a] text-black text-xl font-montserrat rounded-lg py-3 font-semibold mt-6 uppercase cursor-pointer hover:bg-[#aecc34]"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
