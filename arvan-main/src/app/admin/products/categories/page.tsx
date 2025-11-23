import { CategoriesList } from "@/components/admin/categories-list"

export default function CategoriesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-[#1c1c1c] mb-6">Product Categories</h1>
      <CategoriesList />
    </div>
  )
}

