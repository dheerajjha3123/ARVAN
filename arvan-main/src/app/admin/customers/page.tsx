import { CustomerTable } from "@/components/admin/customer-table"

export default function CustomersPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-[#1c1c1c] mb-6">Customers</h1>
      <CustomerTable />
    </div>
  )
}

