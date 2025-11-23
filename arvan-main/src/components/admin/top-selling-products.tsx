"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { analyticApi } from "@/lib/api/analytic";

export function TopSellingProducts() {
  // Fetch products using React Query
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ["productPerformance"],
    queryFn: async () => {
      try {
        const data = await analyticApi.getTopProducts();
        if (!data) throw new Error("No data returned");
        return data;
      } catch (error) {
        console.error("Error fetching products:", error);
        return [];
      }
    },
  });

  if (isError) {
    return (
      <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-sm">
        <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-[#4f507f]">
          Top Selling Products
        </h2>
        <div className="text-center py-4 sm:py-6 md:py-8 text-red-500 text-sm sm:text-base">
          Error loading products data. Please try again later.
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-sm">
        <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-[#4f507f]">
          Top Selling Products
        </h2>
        <div className="text-center py-4 sm:py-6 md:py-8 text-gray-500 text-sm sm:text-base">
          <div className="inline-block animate-pulse">
            <div className="h-4 w-28 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-sm">
      <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-[#4f507f]">
        Top Selling Products
      </h2>
      
      {/* Desktop Table - Hidden on small screens */}
      <div className="hidden sm:block overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sales
              </th>
              <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Revenue
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length > 0 ? (
              products?.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-2 sm:px-4 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-2 sm:px-4 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    {product.sales}
                  </td>
                  <td className="px-2 sm:px-4 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    ₹{typeof product.revenue === 'number' ? product.revenue.toLocaleString() : product.revenue}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-2 sm:px-4 md:px-6 py-4 text-center text-xs sm:text-sm text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Mobile Cards - Visible only on small screens */}
      <div className="sm:hidden space-y-3">
        {products.length > 0 ? (
          products?.map((product, index) => (
            <div 
              key={index} 
              className="p-3 rounded-md border border-gray-100 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="mb-2">
                <span className="font-medium text-sm text-gray-900 line-clamp-1">{product.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 rounded p-2 flex items-center justify-between">
                  <span className="text-gray-500">Sales</span>
                  <span className="font-medium text-gray-700">{product.sales}</span>
                </div>
                <div className="bg-gray-50 rounded p-2 flex items-center justify-between">
                  <span className="text-gray-500">Revenue</span>
                  <span className="font-medium text-gray-700">
                    ₹{typeof product.revenue === 'number' ? product.revenue.toLocaleString() : product.revenue}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-xs sm:text-sm text-gray-500">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
}