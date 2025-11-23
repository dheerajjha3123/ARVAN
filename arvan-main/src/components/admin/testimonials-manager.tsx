"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { testimonialApi } from "@/lib/api/testimonials";
import { TestimonialForm } from "./testimonial-form";
import { toast } from "react-hot-toast";
import { Trash2, Edit, Loader } from "lucide-react";
import Image from "next/image";

export interface Testimonial {
  id: string;
  username: string;
  role: string;
  description: string;
  image: string;
  ratings: number;
  date: string;
}

export function TestimonialsManager() {
  const [selectedTestimonial, setSelectedTestimonial] =
    useState<Testimonial | null>(null);
  const queryClient = useQueryClient();

  // Fetch testimonials
  const {
    data: testimonials,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["testimonials"],
    queryFn: testimonialApi.getAll,
  });

  // Delete testimonial mutation
  const deleteMutation = useMutation({
    mutationFn: testimonialApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast.success("Testimonial deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete testimonial");
      console.error("Error deleting testimonial:", error);
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
  };

  const handleFormSubmit = () => {
    setSelectedTestimonial(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin" />
        <span className="ml-2">Loading testimonials...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        Error loading testimonials. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#4f507f]">Testimonials</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="">
        {testimonials?.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No testimonials found. Add your first testimonial!</div>
        ) : ( 
          testimonials?.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white mb-4 p-4 rounded-lg shadow-md">
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  {testimonial.image && (
                    <Image
                    width={400}
                    height={400}
                      src={testimonial.image}
                      alt={testimonial.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{testimonial.username}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                    disabled={deleteMutation.isPending}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < testimonial.ratings
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }>
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm">
                  {testimonial.description}
                </p>
              </div>
            </div>
          ))
          )}
        </div>
        <TestimonialForm
          testimonial={selectedTestimonial}
          onSubmit={handleFormSubmit}
          onCancel={() => setSelectedTestimonial(null)}
        />
      </div>
    </div>
  );
}
