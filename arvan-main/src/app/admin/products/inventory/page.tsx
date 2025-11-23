import { InventoryTable } from "@/components/admin/inventory-table"
import { InventoryOverview } from "@/components/admin/inventory-overview"

export default function InventoryPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-[#1c1c1c] mb-6">Inventory Management</h1>
      <InventoryOverview />
      <div className="mt-6">
        <InventoryTable />
      </div>
    </div>
  )
}

