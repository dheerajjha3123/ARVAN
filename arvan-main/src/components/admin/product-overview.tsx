"use client";
import { productApi } from "@/lib/api/productdetails";
import { useQuery } from "@tanstack/react-query";
import { Package, DollarSign, TrendingUp, Users, TrendingDown } from "lucide-react"
import { useEffect, useState } from "react";

export function ProductOverview() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSales, setTotalSales] = useState("0%");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  
  const { data } = useQuery({
    queryKey: ["ProductOverview"],
    queryFn: productApi.getDashBoardOverview,
  });
  
  useEffect(() => {
    if (data) {
      setTotalCustomers(data.usersCount);
      setTotalProducts(data.totalProducts);
      setTotalSales(data.growth);
      setTotalRevenue(data.revenue);
    }
  }, [data]);
  
  return (
    <div className="bg-white rounded-xl p-4 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
      <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-[#4f507f] border-b pb-3">Product Overview</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <div className="p-3 md:p-4 bg-[#edeefc] rounded-xl shadow-sm">
            <Package size={24} className="text-[#4f507f]" />
          </div>
          <div>
            <p className="text-xs md:text-sm font-medium text-gray-500">Total Products</p>
            <p className="text-xl md:text-2xl font-bold text-gray-800">{totalProducts}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <div className="p-3 md:p-4 bg-[#e6f1fd] rounded-xl shadow-sm">
            <DollarSign size={24} className="text-[#7094f4]" />
          </div>
          <div>
            <p className="text-xs md:text-sm font-medium text-gray-500">Revenue</p>
            <p className="text-xl md:text-2xl font-bold text-gray-800">{totalRevenue}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <div className="p-3 md:p-4 bg-[#e6fdf1] rounded-xl shadow-sm">
            {parseFloat(totalSales.split("%")[0]) >= 0 ? (
              <TrendingUp size={24} className="text-[#4fc48a]" />
            ) : (
              <TrendingDown size={24} className="text-[#ff4d4d]" />
            )}
          </div>
          <div>
            <p className="text-xs md:text-sm font-medium text-gray-500">Growth</p>
            <p className="text-xl md:text-2xl font-bold text-gray-800">{totalSales}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <div className="p-3 md:p-4 bg-[#fdf1e6] rounded-xl shadow-sm">
            <Users size={24} className="text-[#f4a970]" />
          </div>
          <div>
            <p className="text-xs md:text-sm font-medium text-gray-500">Users</p>
            <p className="text-xl md:text-2xl font-bold text-gray-800">{totalCustomers}</p>
          </div>
        </div>
      </div>
    </div>
  )
}