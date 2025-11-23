"use client";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import { ProductOverview } from "@/components/admin/product-overview";
import { RecentOrders } from "@/components/admin/recent-orders";
import { TopSellingProducts } from "@/components/admin/top-selling-products";
import { InventoryAlerts } from "@/components/admin/inventory-alerts";
import { apiClient } from "@/lib/axiosClient";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSyncProducts = async () => {
    try {
      setIsLoading(true);
      await apiClient.get("/api/merchant/sync");
      toast.success("Products synced successfully to merchant store");
    } catch (error) {
      toast.error("Products sync failed to merchant store");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <DashboardHeader />
      <div className="absolute top-0 right-10 p-4">
        <button
          className="flex-1 bg-[#4f507f] text-white flex-col py-2 px-3 sm:px-4 rounded-md hover:bg-[#3e3f63] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          onClick={handleSyncProducts}
          disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Syncing...
            </div>
          ) : (
            "Sync Products"
          )}
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <ProductOverview />
        <InventoryAlerts />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <TopSellingProducts />
        <RecentOrders />
      </div>
    </div>
  );
}
