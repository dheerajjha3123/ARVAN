"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"

export function CreateDiscountButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    closeModal()
  }

  return (
    <>
      <button
        onClick={openModal}
        className="bg-[#4f507f] text-white px-4 py-2 rounded-md hover:bg-[#3e3f63] transition-colors flex items-center gap-2"
      >
        <Plus size={16} />
        Create Discount
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Discount</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Discount Code
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Discount Type
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="Percentage">Percentage</option>
                  <option value="Fixed Amount">Fixed Amount</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                  Discount Value
                </label>
                <input
                  type="number"
                  id="value"
                  name="value"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="minPurchase" className="block text-sm font-medium text-gray-700">
                  Minimum Purchase
                </label>
                <input
                  type="number"
                  id="minPurchase"
                  name="minPurchase"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="usageLimit" className="block text-sm font-medium text-gray-700">
                  Usage Limit
                </label>
                <input
                  type="number"
                  id="usageLimit"
                  name="usageLimit"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#4f507f] text-white rounded-md text-sm font-medium hover:bg-[#3e3f63]"
                >
                  Create Discount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

