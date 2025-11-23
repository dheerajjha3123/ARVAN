"use client";

import { ProductPerformanceApi } from "@/lib/api/productperformance";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ProductPerformance } from "./product-performance-table";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Define types
interface Sale {
  date: string;
  totalOrders: number;
}

interface Product {
  id: string;
  name: string;
  sales: Sale[];
}

interface MonthlySalesData {
  name: string;
  sales: number;
}

export function SalesChart() {
  // Fetch products using React Query
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["productPerformance"],
    queryFn: async () => {
      try {
        const rawData: ProductPerformance[] = await ProductPerformanceApi.getAll();
        const data: Product[] = rawData.map((item) => ({
          id: item.id,
          name: item.name,
          sales: Array.isArray(item.sales)
            ? item.sales.filter((sale): sale is Sale => sale && typeof sale === "object" && "date" in sale && "totalOrders" in sale)
            : [], // If sales is invalid, return an empty array
        }));
        console.log("Fetched products:", data);
        return data;
      } catch (error) {
        console.error("Error fetching products:", error);
        return [];
      }
    },
  });

  // Aggregate sales data by month
  const monthlySales: MonthlySalesData[] = products
    .flatMap((product) => product.sales || []) // Ensure sales is always an array
    .reduce((acc: MonthlySalesData[], sale: Sale) => {
      if (!sale.date) return acc; // Skip invalid data
      const monthIndex = new Date(sale.date).getMonth();
      const monthName = monthNames[monthIndex];

      const existingMonth = acc.find((item) => item.name === monthName);
      if (existingMonth) {
        existingMonth.sales += sale.totalOrders;
      } else {
        acc.push({ name: monthName, sales: sale.totalOrders });
      }

      return acc;
    }, []);

  const [activeTab, setActiveTab] = useState<"Daily" | "Weekly" | "Monthly" | "Yearly">("Monthly");

  const tabs: ("Daily" | "Weekly" | "Monthly" | "Yearly")[] = ["Daily", "Weekly", "Monthly", "Yearly"];

  // ✅ Empty Data Handling: Ensure chart is always rendered
  const chartData = monthlySales.length > 0 ? monthlySales : monthNames.map((month) => ({ name: month, sales: 0 }));

  return (
    <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <h2 className="text-base sm:text-lg font-medium text-[#4f507f]">Sales Trend</h2>
        
        {/* Scrollable Tab Container for Mobile */}
        <div className="w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 -mx-3 px-3 sm:mx-0 sm:px-0">
          <div className="flex space-x-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md whitespace-nowrap ${
                  activeTab === tab ? "bg-[#4f507f] text-white" : "text-gray-500 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="h-[200px] sm:h-[250px] md:h-[300px] flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading chart data...</div>
        </div>
      ) : (
        <div className="h-[200px] sm:h-[250px] md:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                fontSize={12}
                tick={{ fill: '#6b7280' }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                fontSize={12}
                width={30}
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '6px',
                  border: '1px solid #f0f0f0',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#4f507f" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 5, fill: '#4f507f', stroke: 'white', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}