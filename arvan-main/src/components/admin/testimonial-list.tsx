"use client"

import { useState } from "react"
import { Edit, Trash2, Star } from "lucide-react"
import type { Testimonial } from "./testimonials-manager"
import Image from "next/image"

interface TestimonialListProps {
  testimonials: Testimonial[]
  onEdit: (testimonial: Testimonial) => void
  onDelete: (id: string) => void
}

export function TestimonialList({ testimonials, onEdit, onDelete }: TestimonialListProps) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id)
  }

  const confirmDelete = () => {
    if (deleteConfirmId) {
      onDelete(deleteConfirmId)
      setDeleteConfirmId(null)
    }
  }

  const cancelDelete = () => {
    setDeleteConfirmId(null)
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-[#4f507f]">All Testimonials</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {testimonials.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No testimonials found. Add your first testimonial!</div>
        ) : (
          testimonials.map((testimonial) => (
            <div key={testimonial.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start gap-4">
                <Image
                  width={400}
                  height={400}
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.username}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{testimonial.username}</h3>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < testimonial.ratings ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{testimonial.description}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-500">{testimonial.date}</span>
                    <div className="flex gap-2">
                      <button onClick={() => onEdit(testimonial)} className="p-1 text-blue-600 hover:text-blue-800">
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(testimonial.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this testimonial? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

