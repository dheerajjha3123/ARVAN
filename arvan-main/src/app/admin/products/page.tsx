"use client"
import Link from "next/link"
import { Plus, RefreshCw } from "lucide-react"
import { ProductsTable } from "@/components/admin/products-table"
import { useState } from "react";
import { apiClient } from "@/lib/axiosClient";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const [isLoading, setIsLoading] = useState(false);
  
    const handleSyncProducts = async () => {
      try {
        setIsLoading(true);
        await apiClient.get("/api/merchant/sync")
        toast.success("Products synced successfully to merchant store")
      } catch (error) {
        console.log(error)
        toast.error("Products sync failed to merchant store")
      } finally {
        setIsLoading(false);
      }
    }
  return (
    <div className="p-6">
      <div className="xl:flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#1c1c1c] mb-2 xl:mb-0">Products</h1>
        <div className="flex gap-2 sm:gap-3">
        <button 
            className="bg-[#4f507f] text-white flex-row py-2 px-3 sm:px-4 rounded-md hover:bg-[#3e3f63] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            onClick={handleSyncProducts}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Syncing...
              </div>
            ) : (
              'Sync Products'
            )}
          </button>
        
        <Link
          href="/admin/products/add"
          className="flex items-center gap-2 px-4 py-2 bg-[#4f507f] text-white rounded-md hover:bg-[#3e3f63] transition-colors"
        >
          <Plus size={16} />
          <span>Add Product</span>
        </Link>
        </div>
      </div>
      <ProductsTable />
    </div>
  )
}

