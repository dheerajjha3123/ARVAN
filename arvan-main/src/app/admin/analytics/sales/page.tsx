import { SalesOverview } from "@/components/admin/sales-overview"
import { SalesChart } from "@/components/admin/sales-chart"
import { TopSellingProducts } from "@/components/admin/top-selling-products"

export default function SalesPerformancePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-[#1c1c1c] mb-6">Sales Performance</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesOverview />
        <SalesChart />
      </div>
      <div className="mt-6">
        <TopSellingProducts />
      </div>
    </div>
  )
}

