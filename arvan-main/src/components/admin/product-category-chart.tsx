"use client";

import { ProductPerformanceApi } from "@/lib/api/productperformance";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export function ProductCategoryChart() {
  // Fetch products using React Query
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ["productPerformance"],
    queryFn: async () => {
      try {
        const data = await ProductPerformanceApi.getAll();
        console.log("Fetched products:", data);
        if (!Array.isArray(data)) {
          throw new Error("API response is not an array");
        }
        return data;
      } catch (error) {
        console.error("Error fetching products:", error);
        return [];
      }
    },
  });

  // Ensure products is an array before applying reduce
  const categorySales = Array.isArray(products) ? products.reduce((acc, product) => {
    const existingCategory = acc.find((item) => item.name === product.category);

    if (existingCategory) {
      existingCategory.value += product.sales;
    } else {
      acc.push({ name: product.category, value: product.sales });
    }

    return acc;
  }, [] as { name: string; value: number }[]) : [];

  console.log("Processed category sales:", categorySales);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-medium mb-4 text-[#4f507f]">Sales by Category</h2>
      <div className="h-[300px]">
        {isLoading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : isError || categorySales.length === 0 ? (
          <p className="text-red-500 text-center">No Product Catagory Found</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categorySales} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                {categorySales.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
