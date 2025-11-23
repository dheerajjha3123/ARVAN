"use client";

import { useEffect, useState } from "react";
import { Edit, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { inventoryApi, InventoryItem } from "@/lib/api/inventory";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";

export function InventoryTable() {
  const [inventory, setInventory] = useState<InventoryItem[]>(
    [] as InventoryItem[]
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // Query the backend with pagination and search parameters
  const { data, isLoading, error } = useQuery({
    queryKey: ["inventory", currentPage, itemsPerPage, debouncedSearchTerm],
    queryFn: () =>
      inventoryApi.getInventory(currentPage, itemsPerPage, debouncedSearchTerm),
  });

  // When backend data returns update local inventory state (if needed)
  useEffect(() => {
    if (data && data.products) {
      setInventory(data.products);
    }
  }, [data]);

  // Assume backend returns pagination info like { totalPages: number }
  const { totalPages = 1 } = data?.pagination || {};

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search inventory..."
          className="w-full bg-white p-2 pl-10 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
      </div>

      {isLoading && <div className="flex justify-center p-4">Loading...</div>}
      {!isLoading && !inventory.length && (
        <div className="p-4">No inventory found</div>
      )}
      {error && <div className="text-red-500 p-4">Error loading inventory</div>}

      {!isLoading && inventory.length > 0 && (
        <>
          {/* Desktop Table View - Hidden on small screens */}
          <div className="hidden sm:block bg-white shadow-sm rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    In Stock
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.inStock}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      {item.inStock === 0 ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Out of Stock
                        </span>
                      ) : item.inStock <= item.lowStockThreshold ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/admin/products/inventory/edit/${item.id}`}
                        className="text-indigo-600 hover:text-indigo-900 inline-block p-1.5 rounded-full hover:bg-indigo-50">
                        <Edit size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View - Only visible on small screens */}
          <div className="sm:hidden space-y-3">
            {inventory.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                  <Link
                    href={`/admin/products/inventory/edit/${item.id}`}
                    className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-full hover:bg-indigo-50">
                    <Edit size={16} />
                  </Link>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">In Stock:</span>
                    <span className="text-sm font-medium">{item.inStock}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Status:</span>
                    {item.inStock === 0 ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-red-100 text-red-800">
                        Out of Stock
                      </span>
                    ) : item.inStock <= item.lowStockThreshold ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Low Stock
                      </span>
                    ) : (
                      <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-green-100 text-green-800">
                        In Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Responsive Pagination */}
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              {/* Items per page - Full width on mobile */}
              <div className="w-full sm:w-auto">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-700 text-sm">
                  <option value="5">5 per page</option>
                  <option value="10">10 per page</option>
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                </select>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-center w-full sm:w-auto">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-2 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 flex items-center">
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span className="hidden sm:inline ml-1">Previous</span>
                </button>

                {/* Page numbers - Hidden on mobile */}
                <div className="hidden sm:flex items-center mx-2 space-x-1">
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
                        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg transition-colors duration-200 ${
                          currentPage === pageNum
                            ? "bg-indigo-600 text-white font-medium shadow-md"
                            : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                        }`}>
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Mobile page indicator */}
                <span className="mx-2 text-sm sm:hidden">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-2 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 flex items-center">
                  <span className="hidden sm:inline mr-1">Next</span>
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}