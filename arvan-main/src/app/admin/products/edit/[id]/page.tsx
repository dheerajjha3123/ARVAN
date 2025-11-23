"use client"
import { EditProductForm } from "@/components/admin/edit-product-form"
import { useParams } from "next/navigation";

export default function EditProductPage() {
  const { id } = useParams();
  if(id === undefined) return <div>Product ID is not defined</div>
  if(typeof id !== "string") return <div>Product ID is not a string</div>
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-[#1c1c1c] mb-6">Edit Product</h1>
      <EditProductForm productId={id} />
    </div>
  )
}

