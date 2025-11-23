import { AddProductForm } from "@/components/admin/add-product-form"

export default function AddProductPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1c1c1c]">Add New Product</h1>
        <p className="text-gray-500 mt-1">Create a new product to add to your inventory</p>
      </div>
      <AddProductForm />
    </div>
  )
}

