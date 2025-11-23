import { OrdersTable } from "@/components/admin/orders-table"

export default function OrdersPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-[#1c1c1c] mb-6">Orders</h1>
      <OrdersTable />
    </div>
  )
}

