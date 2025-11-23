"use client";
import { apiClient } from "@/lib/axiosClient";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";

export function RecentOrders() {
  const oldorders = [
    { id: "1234", customer: "John Doe", total: 99.99, status: "Pending" }
  ];

  const [orders, setOrders] = useState(oldorders);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: () => apiClient.get("/api/orders?limit=5"),
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (data) {
      setOrders(data.data.orders);
    }
  }, [data]);

  if (isError) {
    return (
      <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm min-h-[200px] md:min-h-[400px] flex items-center justify-center text-red-500">
        Error fetching data. Please try again later.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-[#4f507f]">Recent Orders</h2>
        <Link href="/admin/orders" className="text-[#4f507f] hover:text-[#6365a3] transition-colors duration-200 text-xs md:text-sm font-medium">
          View all →
        </Link>
      </div>
      
      {/* Desktop Table View - Hidden on small screens */}
      <div className="hidden sm:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-4 md:px-6 py-2 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-2 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Total
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-2 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading || orders.length === 0 ? (
              <tr className="hover:bg-gray-50 transition-colors duration-200">
                <td colSpan={4} className="px-3 sm:px-4 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm text-gray-500">
                  {isLoading ? "Loading orders..." : "No orders found."}
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-3 sm:px-4 md:px-6 py-2 whitespace-nowrap text-sm font-medium text-[#4f507f]">
                    #{order.id}
                  </td>
                  <td className="px-3 sm:px-4 md:px-6 py-2 whitespace-nowrap text-sm text-gray-700">
                    ₹{order.total.toFixed(2)}
                  </td>
                  <td className="px-3 sm:px-4 md:px-6 py-2 whitespace-nowrap">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === "Delivered" ? "bg-green-100 text-green-800" :
                      order.status === "Shipped" ? "bg-blue-100 text-blue-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Mobile Card View - Visible only on small screens */}
      <div className="sm:hidden space-y-3">
        {isLoading ? (
          <div className="text-center py-4 text-sm text-gray-500">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-4 text-sm text-gray-500">
            No orders found.
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="rounded-lg shadow-sm p-3 hover:bg-gray-50 transition-colors duration-200">
              <h1 className="font-medium text-[#4f507f] mb-2">
                #{order.id}
              </h1>
              <div className="text-sm flex justify-between items-center text-gray-700">
                <div className="flex gap-2 items-center">
                  <span className="text-gray-500">Total:</span>
                  <span className="font-medium">₹{order.total.toFixed(2)}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === "Delivered" ? "bg-green-100 text-green-800" :
                  order.status === "Shipped" ? "bg-blue-100 text-blue-800" :
                  "bg-yellow-100 text-yellow-800"
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}