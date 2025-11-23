"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Upload } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { testimonialApi } from "@/lib/api/testimonials"
import type { Testimonial } from "./testimonials-manager"
import UploadPopup from "../UploadPopup"
import { toast } from "react-hot-toast" // Assuming you use toast for notifications
import Image from "next/image"

interface TestimonialFormProps {
  testimonial: Testimonial | null
  onSubmit: (testimonial: Testimonial) => void
  onCancel: () => void
}

export function TestimonialForm({ testimonial, onSubmit, onCancel }: TestimonialFormProps) {
  const [isUploadPopup, setUploadPopup] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    role: "",
    description: "",
    image: "",
    ratings: 5,
  })
  
  const queryClient = useQueryClient();
  
  // Create testimonial mutation
  const createMutation = useMutation({
    mutationFn: testimonialApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial added successfully!');
      onSubmit(data);
    },
    onError: (error) => {
      toast.error('Failed to add testimonial');
      console.error('Error creating testimonial:', error);
    }
  });
  
  // Update testimonial mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Testimonial> }) => 
      testimonialApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial updated successfully!');
      onSubmit(data);
    },
    onError: (error) => {
      toast.error('Failed to update testimonial');
      console.error('Error updating testimonial:', error);
    }
  });

  useEffect(() => {
    if (testimonial) {
      setFormData({
        username: testimonial.username,
        role: testimonial.role,
        description: testimonial.description,
        image: testimonial.image,
        ratings: testimonial.ratings,
      })
    } else {
      setFormData({
        username: "",
        role: "",
        description: "",
        image: "",
        ratings: 5,
      })
    }
  }, [testimonial])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleImageUpload = (imageUrl: string) => {
    setFormData({ ...formData, image: imageUrl })
    setUploadPopup(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (testimonial) {
      updateMutation.mutate({
        id: testimonial.id,
        data: {
          ...formData,
          ratings: Number(formData.ratings)
        }
      });
    } else {
      createMutation.mutate({
        ...formData,
        ratings: Number(formData.ratings)
      });
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-medium mb-4 text-[#4f507f]">
        {testimonial ? "Edit Testimonial" : "Add New Testimonial"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-3 bg-white py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f507f]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full bg-white px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f507f]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full bg-white px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f507f]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
          <select
            name="ratings"
            value={formData.ratings}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f507f]"
          >
            {[1, 2, 3, 4, 5].map((ratings) => (
              <option key={ratings} value={ratings}>
                {ratings} {ratings === 1 ? "Star" : "Stars"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
          <div className="flex items-center gap-4">
           {formData.image && <div className="relative w-20 h-20 border border-gray-200 rounded-md overflow-hidden">
              <Image
                width={400}
                height={400}
                src={formData.image}
                alt="Testimonial"
                className="w-full h-full object-cover"
              />
            </div>}
            <button
              type="button"
              onClick={() => setUploadPopup(true)}
              className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 flex items-center"
            >
              <Upload size={16} className="mr-2" />
              <span>{formData.image ? "Change Image" : "Upload Image"}</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          {testimonial && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-[#4f507f] text-white rounded-md hover:bg-[#3e3f63] disabled:opacity-50"
          >
            {isLoading ? "Saving..." : testimonial ? "Update Testimonial" : "Add Testimonial"}
          </button>
        </div>
      </form>
      {isUploadPopup && (
        <UploadPopup
          onSuccess={handleImageUpload}
          onClose={() => setUploadPopup(false)}
        />
      )}
    </div>
  )
}