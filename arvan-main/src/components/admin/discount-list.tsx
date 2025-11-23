"use client"

import { useState } from "react"
import { Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react"

const initialDiscounts = [
  {
    id: 1,
    code: "SUMMER2023",
    type: "Percentage",
    value: 20,
    minPurchase: 100,
    usageLimit: 100,
    usageCount: 50,
    startDate: "2023-06-01",
    endDate: "2023-08-31",
    status: "Active",
  },
  {
    id: 2,
    code: "FREESHIP",
    type: "Fixed Amount",
    value: 10,
    minPurchase: 50,
    usageLimit: 200,
    usageCount: 75,
    startDate: "2023-06-15",
    endDate: "2023-07-15",
    status: "Active",
  },
  {
    id: 3,
    code: "WELCOME10",
    type: "Percentage",
    value: 10,
    minPurchase: 0,
    usageLimit: 1000,
    usageCount: 500,
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    status: "Active",
  },
  {
    id: 4,
    code: "FLASH50",
    type: "Percentage",
    value: 50,
    minPurchase: 200,
    usageLimit: 50,
    usageCount: 50,
    startDate: "2023-05-01",
    endDate: "2023-05-02",
    status: "Expired",
  },
  {
    id: 5,
    code: "LOYALTY25",
    type: "Percentage",
    value: 25,
    minPurchase: 150,
    usageLimit: null,
    usageCount: 1000,
    startDate: "2023-06-01",
    endDate: null,
    status: "Active",
  },
]

export function DiscountList() {
  const [discounts, setDiscounts] = useState(initialDiscounts)

  const handleDelete = (id: number) => {
    setDiscounts(discounts.filter((discount) => discount.id !== id))
  }

  const toggleStatus = (id: number) => {
    setDiscounts(
      discounts.map((discount) =>
        discount.id === id ? { ...discount, status: discount.status === "Active" ? "Inactive" : "Active" } : discount,
      ),
    )
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valid Period
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {discounts.map((discount) => (
            <tr key={discount.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{discount.code}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{discount.type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {discount.type === "Percentage" ? `${discount.value}%` : `$${discount.value}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {discount.usageCount} / {discount.usageLimit || "∞"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {discount.startDate} - {discount.endDate || "No End Date"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    discount.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {discount.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-900 mr-2">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(discount.id)} className="text-red-600 hover:text-red-900 mr-2">
                  <Trash2 size={18} />
                </button>
                <button onClick={() => toggleStatus(discount.id)} className="text-gray-600 hover:text-gray-900">
                  {discount.status === "Active" ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

