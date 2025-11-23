"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  CreditCard,
  XCircle,
  Loader2,
  Link2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { orderApi } from "@/lib/api/orders";
import Loading from "@/app/loading";
import { apiClient } from "@/lib/axiosClient";
import ReturnReasonModal from "./ReturnReasonModal";

interface OrderDetailsProps {
  orderId: string;
}
const Oldorder = {
  status: "Shipping",
  message: "Expected Delivery On 19 March 2025",
  actions: ["Cancel Order", "Return Order"],
  isReturned: false,
  returnDate: null,
  awb: "987654321",
  products: [
    {
      id: 1,
      productName: "Skull Haunted Sliders",
      size: "8",
      quantity: 1,
      productColor: "Red",
      price: 599,
      image: "/images/shoe1.png",
    },
  ],
  totalPrice: 599,
  orderDate: "5 March 2024",
  orderId: "ORD456789123",
  paymentMethod: "Cash on Delivery",
  shippingAddress: {
    name: "Mike Johnson",
    street: "789 Lake Road",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560001",
    phone: "+91 9876543212",
  },
  // timeline: [
  //   { status: "Order Placed", date: "5 March 2024, 10:30 AM", completed: true },
  //   { status: "Payment Confirmed", date: "5 March 2024, 11:15 AM", completed: true },
  //   { status: "Processing", date: "6 March 2024, 9:00 AM", completed: true },
  //   { status: "Shipped", date: "7 March 2024, 2:45 PM", completed: true },
  //   { status: "Out for Delivery", date: "Expected 19 March 2024", completed: false },
  //   { status: "Delivered", date: "Expected 19 March 2024", completed: false }
  // ]
};
// In a real app, you would fetch the order details using the orderId
// For this example, I'll use mock data

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId }) => {
  const [order, setOrder] = useState(Oldorder);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const response = await orderApi.getOrderById(orderId);
      return response;
    },
  });

  useEffect(() => {
    if (data) {
      //@ts-expect-error: data is not undefined
      setOrder(data);
    }
  }, [data]);

  const handleCancelOrder = async () => {
    const confirmed = confirm("Are you sure you want to cancel this order?");
    if (!confirmed) return;

    try {
      setIsCancelling(true);
      await apiClient.post("/api/shiprocket/cancel", { orderId });
      await refetch();
    } catch (error) {
      console.error("Failed to cancel order:", error);
      alert("Failed to cancel the order. Please try again later.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReturnOrder = () => {
    setShowReturnModal(true);
  };

  const submitReturnRequest = async (
    reason: string,
    additionalInfo: string
  ) => {
    try {
      setIsReturning(true);
      await apiClient.post("/api/shiprocket/return", {
        orderId,
        reason,
        additionalInfo,
      });
      await refetch();
    } catch (error) {
      console.error("Failed to return order:", error);
      throw error;
    } finally {
      setIsReturning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "SHIPPING":
        return <Truck className="w-5 h-5 text-yellow-500" />;
      case "PENDING":
        return <Package className="w-5 h-5 text-yellow-500" />;
      case "CANCELED":
        return <XCircle className="w-5 h-5 text-gray-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  if (isLoading) return <Loading />;

  if (!data)
    return (
      <div className="flex items-center flex-col justify-center h-screen font-montserrat text-white">
        <h1 className="text-2xl">Invalid Order ID</h1>
        <Link href="/track-order">
          <button className="bg-[#C2E53A] text-black px-4 py-2 sm:px-6 sm:py-3 rounded-sm hover:bg-[#a8c72f] transition text-sm sm:text-base">
            Go Back And Continue Shopping
          </button>
        </Link>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/track-order"
          className="inline-flex items-center text-gray-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Link>

        {isFetching && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Loader2 className="animate-spin w-4 h-4" />
            Refreshing...
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-coluna mb-2">Order Details</h1>
          <p className="text-gray-400 font-montserrat">
            Order ID: <span className="font-mono">{order.orderId}</span>
          </p>
          {order.awb && (
            <p className="text-gray-400 font-montserrat">
              Order AWB: <span className="font-mono">{order.awb}</span>
              <Link2
                className="ml-2 w-4 h-4"
                onClick={() =>
                  window.open(
                    `https://www.shiprocket.in/shipment-tracking`,
                    "_blank"
                  )
                }
              />
            </p>
          )}
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <div className="flex items-center gap-2">
            {getStatusIcon(order.status)}
            <span className="font-medium text-yellow-500">{order.status}</span>
          </div>
          {order.awb && (
            <a
              href={`https://shiprocket.co/tracking/${order.awb}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#C2E53A] text-black px-4 py-2 rounded-sm text-sm hover:bg-[#a8c72f] transition">
              Track Package
            </a>
          )}
          {order.actions.includes("Cancel Order") && (
            <button
              onClick={handleCancelOrder}
              disabled={isCancelling}
              className={`flex items-center justify-center gap-2 bg-[#9C2918] hover:bg-[#7a1f12] px-4 py-2 rounded-sm text-sm transition ${
                isCancelling ? "opacity-70 cursor-not-allowed" : ""
              }`}>
              {isCancelling && <Loader2 className="w-4 h-4 animate-spin" />}
              {isCancelling ? "Cancelling..." : "Cancel Order"}
            </button>
          )}
          {order.actions.includes("Return Order") && (
            <button
              onClick={handleReturnOrder}
              disabled={isReturning}
              className={`flex items-center justify-center gap-2 bg-[#9C2918] hover:bg-[#7a1f12] px-4 py-2 rounded-sm text-sm transition ${
                isReturning ? "opacity-70 cursor-not-allowed" : ""
              }`}>
              {isReturning && <Loader2 className="w-4 h-4 animate-spin" />}
              {isReturning ? "Returning..." : "Return Order"}
            </button>
          )}
          {order.isReturned && (
            <div className="bg-gray-900/20 border border-gray-800 rounded-lg p-6 mt-4">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3"
                  />
                </svg>
                <p className="text-gray-400 font-medium text-lg">
                  Order Returned
                </p>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p>
                  Returned On{" "}
                  <span className="font-mono font-medium">
                    {order.returnDate}
                  </span>
                </p>
              </div>
            </div>
          )}
          {/* @ts-expect-error:Many possible erros */}
          {order.fulfillment === "RETURNING" && (
            <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 mt-4">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 font-medium">
                  Return in Progress
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Your return request is being processed</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="border border-gray-700 rounded-lg overflow-hidden mb-8 bg-black/30 backdrop-blur-sm">
        <div className="border-b border-gray-700 p-6">
          <h2 className="text-xl font-medium">Order Items</h2>
        </div>
        <div className="divide-y divide-gray-700">
          {order.products.map((product, index) => (
            <div key={index} className="p-6 flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-24 h-24 bg-white rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={product.image}
                  alt={product.productName}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-grow">
                <h3 className="text-lg font-medium mb-2">
                  {product.productName}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm text-gray-400">
                  <p>Size: {product.size}</p>
                  <p>Color: {product.productColor}</p>
                  <p>Qty: {product.quantity}</p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-lg font-medium">₹{product.price}</span>
                  <Link href={`/product/${product.id}`}>
                    <button className="border border-gray-600 px-4 py-2 rounded-sm hover:bg-gray-800 transition text-sm">
                      View Product
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-700 p-6 bg-black/20">
          <div className="flex justify-between items-center">
            <span className="text-lg">Order Total:</span>
            <span className="text-2xl font-medium">
              ₹{order.totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Order Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Shipping Information */}
        <div className="border border-gray-700 rounded-lg p-6 bg-black/30 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-[#C2E53A]" />
            <h2 className="text-xl font-medium">Shipping Information</h2>
          </div>
          <div className="text-gray-400 space-y-2">
            <p className="text-white font-medium">
              {order.shippingAddress.name}
            </p>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}
            </p>
            <p>{order.shippingAddress.pincode}</p>
            <p>{order.shippingAddress.phone}</p>
          </div>
        </div>

        {/* Payment Information */}
        <div className="border border-gray-700 rounded-lg p-6 bg-black/30 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-[#C2E53A]" />
            <h2 className="text-xl font-medium">Payment Information</h2>
          </div>
          <div className="text-gray-400 space-y-2">
            <div className="flex justify-between">
              <p>Payment Method:</p>
              <p className="text-white">{order.paymentMethod}</p>
            </div>
            <div className="flex justify-between">
              <p>Order Date:</p>
              <p className="text-white">{order.orderDate}</p>
            </div>
            <div className="flex justify-between">
              <p>Order Status:</p>
              <p className="text-yellow-500">{order.status}</p>
            </div>
            <div className="border-t border-gray-700 my-4 pt-4">
              <div className="flex justify-between">
                <p>Subtotal:</p>
                <p className="text-white">₹{order.totalPrice.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Shipping:</p>
                <p className="text-white">₹0</p>
              </div>
              <div className="flex justify-between mt-4">
                <p className="font-medium text-white">Total:</p>
                <p className="font-medium text-white">
                  ₹{order.totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Need Help Section */}
      <div className="mt-8 text-center">
        <p className="text-gray-400 mb-4">Need help with your order?</p>
        <Link href="/contact">
          <button className="bg-transparent border border-[#C2E53A] text-[#C2E53A] px-6 py-3 rounded-sm hover:bg-[#C2E53A]/10 transition">
            Contact Support
          </button>
        </Link>
      </div>
      {showReturnModal && (
        <ReturnReasonModal
          isOpen={showReturnModal}
          onClose={() => setShowReturnModal(false)}
          onSubmit={submitReturnRequest}
        />
      )}
    </div>
  );
};

export default OrderDetails;
