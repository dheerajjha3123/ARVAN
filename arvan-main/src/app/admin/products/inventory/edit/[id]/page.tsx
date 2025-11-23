"use client";

import { ProductInventoryEditor } from "@/components/admin/inventory-edit-product";
import { useParams } from "next/navigation";

export default function EditProductInventoryPage() {
  const { id } = useParams(); // ✅ Access params dynamically in client-side

  if (!id || typeof id !== "string") {
    return <div>Product ID not found</div>;
  }

  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-[#1c1c1c] mb-6">Edit Product Inventory</h1>
      <ProductInventoryEditor productId={id} /> 
    </div>
  );
}