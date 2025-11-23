"use client"
import { inventoryApi } from "@/lib/api/inventory"
import { useQuery } from "@tanstack/react-query"
import { Package, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import { useEffect, useState } from "react"

export function InventoryOverview() {
  const [totalProducts, setTotalProducts] = useState(0)
  const [lowStockItems, setLowStockItems] = useState(0)
  const [outOfStock, setOutOfStock] = useState(0)
  const [restockAlerts, setRestockAlerts] = useState(0)

  const { data , isLoading } = useQuery({
    queryKey: ["inventoryOverview"],
    queryFn: inventoryApi.getInventoryOverview,
  })

  useEffect(() => {
    if (data) {
      setTotalProducts(data.totalProducts)
      setLowStockItems(data.lowStockItems)
      setOutOfStock(data.outOfStock)
      setRestockAlerts(data.restockAlerts)
    }
  }, [data])

  const metrics = [
    { title: "Total Products", value: totalProducts, icon: Package, color: "bg-blue-100 text-blue-800" },
    { title: "Low Stock Items", value: lowStockItems, icon: AlertTriangle, color: "bg-yellow-100 text-yellow-800" },
    { title: "Out of Stock", value: outOfStock, icon: TrendingDown, color: "bg-red-100 text-red-800" },
    { title: "In Stock", value: restockAlerts, icon: TrendingUp, color: "bg-green-100 text-green-800" },
  ]

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!data) {
    return <div>No data</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <div key={index} className={`p-4 rounded-lg ${metric.color}`}>
          <div className="flex items-center">
            <metric.icon className="h-8 w-8 mr-3" />
            <div>
              <p className="text-sm font-medium">{metric.title}</p>
              <p className="text-2xl font-semibold">{metric.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

