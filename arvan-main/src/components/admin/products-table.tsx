"use client";

import Link from "next/link";
import { Edit, Trash2, Copy, Eye, EyeOff, Search } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "@/types/types";
import Image from "next/image";
import cuid from "cuid";
import { productApi } from "@/lib/api/productdetails";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface Size {
  id: string
  size: string
  stock: number
  colorId: string
}

interface Asset {
  id: string
  asset_url: string
  productId: string | null
  type: string
  colorId: string | null
}

interface Color {
  id: string
  color: string
  productId: string
  assets: Asset[]
  sizes: Size[]
}

export interface Products extends Product {
  stock: number;
  category: string;
  id: string;
  assets: {
    type: "IMAGE" | "VIDEO";
    asset_url: string;
    url: string;
    id: string
  }[];
  colors: Color[];
  createdAt : string
}

export function ProductsTable() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", currentPage, itemsPerPage, debouncedSearchTerm],
    queryFn: () => productApi.getProducts(currentPage, itemsPerPage, debouncedSearchTerm),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const copyMutation = useMutation({
    mutationFn: async (product: Products) => {
      const newProduct = {
        ...product,
        id: cuid(),
        name: `${product.name} (Copy)`,
        status: "DRAFT" as const,
        discountPrice: 10,
        assets:
          product.assets?.map((asset) => ({
            ...asset,
            url: asset.asset_url || "",
          })) || [],
      };
      await productApi.addProduct(newProduct);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: string }) =>
      productApi.updateStatus(id, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const products = data?.products || [];
  const { totalPages } = data?.pagination || { totalPages: 1 };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full bg-white p-2 pl-10 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
      </div>

      {isLoading && <div className="flex justify-center p-4">Loading...</div>}
      {!isLoading && !products.length && (
        <div className="p-4">No products found</div>
      )}
      {error && <div className="text-red-500 p-4">Error loading products</div>}
      
      {/* Desktop Table - Hidden on mobile */}
      <div className="hidden md:block bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product: Products) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative w-20 h-20">
                    <Image
                      src={product.assets?.[0]?.asset_url || "/placeholder.png"}
                      alt={product.name}
                      fill
                      className="object-cover rounded"
                      sizes="80px"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-wrap whitespace-nowrap">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ₹{product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.status === "PUBLISHED"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/products/edit/${product.id}`}
                      className="text-indigo-600 hover:text-indigo-900 transition-colors">
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => deleteMutation.mutate(product.id)}
                      className="text-red-600 hover:text-red-900 transition-colors">
                      <Trash2 size={18} />
                    </button>
                    <button
                      onClick={() => copyMutation.mutate(product)}
                      className="text-blue-600 hover:text-blue-900 transition-colors">
                      <Copy size={18} />
                    </button>
                    <button
                      onClick={() =>
                        toggleStatusMutation.mutate({
                          id: product.id,
                          newStatus:
                            product.status === "PUBLISHED"
                              ? "DRAFT"
                              : "PUBLISHED",
                        })
                      }
                      className="text-gray-600 hover:text-gray-900 transition-colors">
                      {product.status === "PUBLISHED" ? (
                        <Eye size={18} />
                      ) : (
                        <EyeOff size={18} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - Only visible on mobile */}
      <div className="md:hidden space-y-4">
        {products.map((product: Products) => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={product.assets?.[0]?.asset_url || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-cover rounded"
                  sizes="80px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm text-wrap font-medium text-gray-900 truncate">{product.name}</h3>
                  <span
                    className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.status === "PUBLISHED"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                    {product.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">₹{product.price.toFixed(2)}</p>
                
                {/* Action buttons at the bottom of card */}
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex space-x-3">
                    <Link
                      href={`/admin/products/edit/${product.id}`}
                      className="text-indigo-600 hover:text-indigo-900 transition-colors p-1.5">
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => deleteMutation.mutate(product.id)}
                      className="text-red-600 hover:text-red-900 transition-colors p-1.5">
                      <Trash2 size={18} />
                    </button>
                    <button
                      onClick={() => copyMutation.mutate(product)}
                      className="text-blue-600 hover:text-blue-900 transition-colors p-1.5">
                      <Copy size={18} />
                    </button>
                    <button
                      onClick={() =>
                        toggleStatusMutation.mutate({
                          id: product.id,
                          newStatus:
                            product.status === "PUBLISHED"
                              ? "DRAFT"
                              : "PUBLISHED",
                        })
                      }
                      className="text-gray-600 hover:text-gray-900 transition-colors p-1.5">
                      {product.status === "PUBLISHED" ? (
                        <Eye size={18} />
                      ) : (
                        <EyeOff size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
        {/* Items per page - Stacked on mobile, side by side on larger screens */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="w-full sm:w-auto">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-700">
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
          
          {/* Pagination - Simplified on mobile */}
          <div className="flex items-center justify-center w-full sm:w-auto">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-2 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline ml-1">Previous</span>
            </button>
            
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
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-2 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 flex items-center">
              <span className="hidden sm:inline mr-1">Next</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}