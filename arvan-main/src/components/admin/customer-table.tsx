"use client"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Eye, Mail, Phone, X } from "lucide-react"
import { apiClient } from "@/lib/axiosClient"

interface Customer {
  id: string
  name: string
  email: string
  mobile_no: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: string
}

export function CustomerTable() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const { data: customers, isLoading, error } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const response = await apiClient.get("/api/customers/allcustomers");
      return response.data;
    },
  });

  if (isLoading) return (
    <div className="bg-white shadow-sm rounded-lg p-4 text-center">
      <p className="text-gray-500">Loading customers...</p>
    </div>
  )
  
  if (error) return (
    <div className="bg-white shadow-sm rounded-lg p-4 text-center">
      <p className="text-red-500">Failed to load customers</p>
    </div>
  )

  const customerList = Array.isArray(customers?.data) ? customers.data : [];

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {/* Desktop Table View - Hidden on small screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Orders
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Spent
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Order
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customerList.map((customer: Customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-4 lg:px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                <td className="px-4 lg:px-6 py-3 whitespace-nowrap text-sm text-gray-500">{customer.mobile_no}</td>
                <td className="px-4 lg:px-6 py-3 whitespace-nowrap text-sm text-gray-500">{customer.totalOrders}</td>
                <td className="px-4 lg:px-6 py-3 whitespace-nowrap text-sm text-gray-500">₹{customer.totalSpent.toFixed(2)}</td>
                <td className="px-4 lg:px-6 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(customer.lastOrderDate)}</td>
                <td className="px-4 lg:px-6 py-3 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => setSelectedCustomer(customer)} 
                    className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-full hover:bg-indigo-50"
                    aria-label="View customer details"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - Only visible on small screens */}
      <div className="md:hidden">
        <div className="divide-y divide-gray-200">
          {customerList.map((customer: Customer) => (
            <div key={customer.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-gray-900">{customer.name}</h3>
                <button 
                  onClick={() => setSelectedCustomer(customer)} 
                  className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-full hover:bg-indigo-50"
                  aria-label="View customer details"
                >
                  <Eye size={16} />
                </button>
              </div>
              
              <div className="space-y-1 mb-2">
                <div className="flex items-center text-xs text-gray-500">
                  <Phone size={14} className="mr-1.5 text-gray-400" />
                  <span>{customer.mobile_no}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
                <div>
                  <p className="text-gray-400">Orders</p>
                  <p className="font-medium">{customer.totalOrders}</p>
                </div>
                <div>
                  <p className="text-gray-400">Spent</p>
                  <p className="font-medium">₹{customer.totalSpent.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Last Order</p>
                  <p className="font-medium">{formatDate(customer.lastOrderDate)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Responsive Modal */}
      {selectedCustomer && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="relative mx-auto p-4 sm:p-5 max-w-xs sm:max-w-sm md:max-w-md shadow-lg rounded-md bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Customer Details</h3>
              <button 
                onClick={() => setSelectedCustomer(null)} 
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-3 mb-5">
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-500 flex flex-col">
                  <span className="font-medium text-gray-700">Name</span>
                  {selectedCustomer.name}
                </p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-500 flex flex-col">
                  <span className="font-medium text-gray-700">Email</span>
                  {selectedCustomer.email || "Not provided"}
                </p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-500 flex flex-col">
                  <span className="font-medium text-gray-700">Phone</span>
                  {selectedCustomer.mobile_no}
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-xs sm:text-sm text-gray-500 flex flex-col">
                    <span className="font-medium text-gray-700">Orders</span>
                    {selectedCustomer.totalOrders}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-xs sm:text-sm text-gray-500 flex flex-col">
                    <span className="font-medium text-gray-700">Spent</span>
                    ₹{selectedCustomer.totalSpent.toFixed(2)}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-xs sm:text-sm text-gray-500 flex flex-col">
                    <span className="font-medium text-gray-700">Last Order</span>
                    {formatDate(selectedCustomer.lastOrderDate)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center gap-3">
              <button className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center text-sm">
                <Mail size={16} className="mr-1.5" />
                Email
              </button>
              <button className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 flex items-center justify-center text-sm">
                <Phone size={16} className="mr-1.5" />
                Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}