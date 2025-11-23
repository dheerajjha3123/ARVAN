"use client"
import { DollarSign, TrendingUp, ShoppingCart, Users } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

export interface SalesOverview {
  totalRevenue: number
  salesGrowth: number
  totalOrders: number
  newCustomers: number
}

const fetchSalesOverview = async (): Promise<SalesOverview> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sales/all-time`)
  if (!response.ok) {
    throw new Error("Failed to fetch sales overview")
  }
  return response.json()
}

export function SalesOverview() {
  // Fetch sales overview
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ["salesOverview"],
    queryFn: fetchSalesOverview,
  })

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
        <div className="flex justify-center items-center h-32">
          <div className="animate-pulse text-gray-400">Loading overview data...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
        <div className="flex justify-center items-center h-32">
          <div className="text-red-500">Error fetching sales overview.</div>
        </div>
      </div>
    )
  }

  const metricData = [
    {
      title: "Total Revenue",
      value: `$${metrics?.totalRevenue?.toLocaleString() ?? "0"}`,
      icon: DollarSign,
      changeType: "positive",
    },
    {
      title: "Sales Growth",
      value: `${metrics?.salesGrowth?.toFixed(2) ?? "0.00"}%`,
      icon: TrendingUp,
      change: (metrics?.salesGrowth ?? 0) > 0 ? `+${(metrics?.salesGrowth ?? 0).toFixed(2)}%` : `${(metrics?.salesGrowth ?? 0).toFixed(2)}%`,
      changeType: (metrics?.salesGrowth ?? 0) > 0 ? "positive" : "negative",
    },
    {
      title: "Total Orders",
      value: metrics?.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      changeType: "positive",
    },
    {
      title: "Total Customers",
      value: metrics?.newCustomers.toLocaleString(),
      icon: Users,
      changeType: "positive",
    },
  ]

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
      <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-[#4f507f]">Sales Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {metricData.map((metric, index) => (
          <div key={index} className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 mr-3 sm:mr-4">
              <div className="bg-white bg-opacity-60 p-1.5 sm:p-2 rounded-full">
                <metric.icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-[#4f507f]" />
              </div>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">{metric.title}</p>
              <p className="text-base sm:text-xl lg:text-2xl font-semibold text-gray-900">{metric.value}</p>
              {metric.change && (
                <p className={`text-xs sm:text-sm ${metric.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                  {metric.change}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}