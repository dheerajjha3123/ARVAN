"use client"

import { useState, useEffect } from "react"
import { Eye, Search } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { orderApi, Order } from "@/lib/api/orders"
import { useDebounce } from "@/hooks/useDebounce"
import Image from "next/image"

interface OrderWithCustomer extends Order {
  customer?: {
    name: string;
  };
  
  date?: string;
  fulfillment: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedOrdersResponse {
  success: boolean;
  orders: OrderWithCustomer[];
  pagination: {
    totalPages: number;
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export function OrdersTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithCustomer | null>(null);
  const [orders, setOrders] = useState<OrderWithCustomer[]>([]);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const { data, isLoading, error } = useQuery<PaginatedOrdersResponse>({
    queryKey: ["orders", currentPage, itemsPerPage, debouncedSearchTerm],
    queryFn: async () => {
      const response = await orderApi.getOrders(
        currentPage.toString(), 
        itemsPerPage.toString(), 
        debouncedSearchTerm
      );
      return response as PaginatedOrdersResponse;
    },
  });

  useEffect(() => {
    if (data) {
      setCurrentPage(data.pagination.currentPage);
      setItemsPerPage(data.pagination.itemsPerPage);
      setOrders(data.orders);
    }
  }, [data]);

  const totalPages = data?.pagination?.totalPages || 1;

  const getFulfillmentColor = (fulfillment: string) => {
    switch (fulfillment) {
      case 'pending': return "bg-yellow-100 text-yellow-800";
      case 'processing': return "bg-blue-100 text-blue-800";
      case 'shipped': return "bg-green-100 text-green-800";
      case 'delivered': return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search orders..."
          className="w-full bg-white p-2 pl-10 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
      </div>

      {isLoading && <div className="flex justify-center p-4">Loading...</div>}
      {!isLoading && !orders.length && (
        <div className="p-4">No orders found</div>
      )}
      {error && <div className="text-red-500 p-4">Error loading orders</div>}
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fulfillment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order: OrderWithCustomer) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{order.total.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getFulfillmentColor(order.fulfillment)}`}>
                    {order.fulfillment}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items.length}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => setSelectedOrder(order)} className="text-indigo-600 hover:text-indigo-900">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 bg-white p-4 rounded-lg shadow">
        <div className="mb-4 sm:mb-0">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-4 bg-white py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-700">
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
        
        <div className="flex justify-center space-x-3">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Previous</span>
          </button>
          
          <div className="flex items-center space-x-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-200 ${
                    currentPage === pageNum
                      ? "bg-indigo-600 text-white font-medium shadow-md"
                      : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                  }`}>
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 flex items-center space-x-1">
            <span>Next</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {selectedOrder && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="relative top-20 mx-auto p-5 border w-[480px] shadow-lg rounded-md bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">Order Details</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">Order ID: {selectedOrder.id}</p>
                <p className="text-sm text-gray-500">Created: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                <p className="text-sm text-gray-500">Updated: {new Date(selectedOrder.updatedAt).toLocaleString()}</p>
                <p className="text-sm text-gray-500">Address ID: {selectedOrder.addressId}</p>
                <p className="text-sm text-gray-500">Total: ₹{selectedOrder.total.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Fulfillment Status: {selectedOrder.fulfillment}</p>
                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-900">Items:</h4>
                  <div className="space-y-3 mt-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-start space-x-3 p-2 border rounded-lg">
                        <Image width={500} height={500} src={item.productImage} alt={item.productName} className="w-16 h-16 object-cover rounded" />
                        <div>
                          <p className="font-medium text-sm">{item.productName}</p>
                          <p className="text-sm text-gray-500">
                            Size: {item.size} | Color: {item.color}
                          </p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity} x ₹{item.priceAtOrder.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}