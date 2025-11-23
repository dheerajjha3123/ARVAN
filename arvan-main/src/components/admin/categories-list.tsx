"use client"

import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Category } from "@/types/types"
import { categoryApi } from "@/lib/api/categories"

export function CategoriesList() {
  const [newCategory, setNewCategory] = useState("")
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getAll,
  })

  const addCategoryMutation = useMutation({
    mutationFn: (newCategory: string) => categoryApi.addCategory(newCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },  })

  const updateCategoryMutation = useMutation({
    mutationFn: (category: { id: string; name: string }) => categoryApi.updateCategory(category.id, category.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      setEditingCategory(null)
    },
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })

  const handleAddCategory = () => {
    if (!newCategory.trim()) return
    addCategoryMutation.mutate(newCategory)
    setNewCategory("")
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
  }

  const handleUpdateCategory = (id: string, newName: string) => {
    if (!newName.trim()) return
    updateCategoryMutation.mutate({ id, name: newName })
  }

  const handleDeleteCategory = (id: string) => {
    deleteCategoryMutation.mutate(id)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            className="flex-grow px-3 py-2 bg-white border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#4f507f]"
          />
          <button
            onClick={handleAddCategory}
            className="px-4 py-2 bg-[#4f507f] text-white rounded-r-md hover:bg-[#3e3f63] transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
      <ul>
        {data?.map((category: Category) => (
          <li
            key={category.id}
            className="flex items-center justify-between px-6 py-4 border-b border-gray-200 last:border-b-0"
          >
            {editingCategory?.id === category.id ? (
              <div className="flex items-center flex-grow mr-4">
                <input
                  type="text"
                  defaultValue={category.name}
                  className="flex-grow px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f507f]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUpdateCategory(category.id, e.currentTarget.value)
                    } else if (e.key === 'Escape') {
                      setEditingCategory(null)
                    }
                  }}
                  onBlur={(e) => handleUpdateCategory(category.id, e.target.value)}
                  autoFocus
                />
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.productCount} products</p>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleEditCategory(category)} 
                className="text-indigo-600 hover:text-indigo-900"
              >
                <Edit size={18} />
              </button>
              <button onClick={() => handleDeleteCategory(category.id)} className="text-red-600 hover:text-red-900">
                <Trash2 size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
