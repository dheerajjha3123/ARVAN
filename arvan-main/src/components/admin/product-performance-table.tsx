"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUp, ArrowDown } from "lucide-react";
import { ProductPerformanceApi } from "@/lib/api/productperformance";

export interface ProductPerformance {
  id: string;
  name: string;
  category: string;
  sales: number;
  revenue: number;
  profit: number;
}

export function ProductPerformanceTable() {
  const [sortConfig, setSortConfig] = useState<{ key: keyof ProductPerformance; direction: "ascending" | "descending" } | null>(null);

  // Fetch products using React Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["productPerformance"],
    queryFn: async () => {
      try {
        const data = await ProductPerformanceApi.getAll();
        console.log("Fetched products:", data);
        return Array.isArray(data) ? data : []; // ✅ Ensure data is an array
      } catch (error) {
        console.error("Error fetching products:", error);
        return []; // ✅ Return empty array instead of undefined
      }
    },
  });

  const products = Array.isArray(data) ? data : []; // ✅ Prevent non-iterable error

  // Sorting logic
  const sortedProducts = [...products].sort((a, b) => {
    if (!sortConfig) return 0;
    const key = sortConfig.key;
    const aValue = a[key] ?? 0;
    const bValue = b[key] ?? 0;

    if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
    return 0;
  });

  // Sorting handler
  const requestSort = (key: keyof ProductPerformance) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Format currency helper function
  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {/* Desktop Table - Hidden on small screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                { label: "Name", key: "name" },
                { label: "Category", key: "category" },
                { label: "Sales", key: "sales" },
                { label: "Revenue", key: "revenue" },
                { label: "Profit", key: "profit" },
              ].map(({ label, key }) => (
                <th
                  key={key}
                  className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort(key as keyof ProductPerformance)}
                >
                  <div className="flex items-center">
                    <span>{label}</span>
                    {sortConfig?.key === key && (
                      <span className="ml-1">
                        {sortConfig.direction === "ascending" ? (
                          <ArrowUp size={14} className="inline" />
                        ) : (
                          <ArrowDown size={14} className="inline" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-3 sm:px-4 lg:px-6 py-4 text-center text-xs sm:text-sm text-gray-500">
                  Loading products...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={5} className="px-3 sm:px-4 lg:px-6 py-4 text-center text-xs sm:text-sm text-red-500">
                  Error loading products. Please try again later.
                </td>
              </tr>
            ) : products.length > 0 ? (
              sortedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{product.category}</td>
                  <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{product.sales}</td>
                  <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{formatCurrency(product.revenue)}</td>
                  <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{formatCurrency(product.profit)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-3 sm:px-4 lg:px-6 py-4 text-center text-xs sm:text-sm text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - Visible only on small screens */}
      <div className="md:hidden">
        <div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <div className="text-sm font-medium text-gray-700">Product Performance</div>
          <div className="flex items-center space-x-2">
            {sortConfig && (
              <div className="text-xs text-gray-500">
                Sorted by: <span className="font-medium">{sortConfig.key}</span>
                {sortConfig.direction === "ascending" ? (
                  <ArrowUp size={12} className="inline ml-1" />
                ) : (
                  <ArrowDown size={12} className="inline ml-1" />
                )}
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="p-4 text-center text-sm text-gray-500">Loading products...</div>
        ) : isError ? (
          <div className="p-4 text-center text-sm text-red-500">Error loading products. Please try again later.</div>
        ) : products.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {sortedProducts.map((product) => (
              <div key={product.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div 
                    className="bg-gray-50 p-2 rounded text-center cursor-pointer"
                    onClick={() => requestSort("sales")}
                  >
                    <div className="text-xs text-gray-500">Sales</div>
                    <div className="text-sm font-medium">{product.sales}</div>
                  </div>
                  
                  <div 
                    className="bg-gray-50 p-2 rounded text-center cursor-pointer"
                    onClick={() => requestSort("revenue")}
                  >
                    <div className="text-xs text-gray-500">Revenue</div>
                    <div className="text-sm font-medium">{formatCurrency(product.revenue)}</div>
                  </div>
                  
                  <div 
                    className="bg-gray-50 p-2 rounded text-center cursor-pointer"
                    onClick={() => requestSort("profit")}
                  >
                    <div className="text-xs text-gray-500">Profit</div>
                    <div className="text-sm font-medium">{formatCurrency(product.profit)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-sm text-gray-500">No products found.</div>
        )}
      </div>
    </div>
  );
}