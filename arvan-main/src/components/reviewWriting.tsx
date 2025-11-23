"use client"
import { productReviewApi } from "@/lib/api/productreview";
import { Review } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React, { useState } from "react";

interface ReviewWritingProps {
  onClose: () => void;
  productId: string; // Accept productId as a prop
}

function ReviewWriting({ onClose, productId }: ReviewWritingProps) {
  const [reviewData, setReviewData] = useState({
    rating: 0,
    title: "",
    description: "",
  });

  const queryClient = useQueryClient();

  // Create review mutation
  const mutation = useMutation({
    mutationFn: (variables: { productId: string; review: Review }) =>
      productReviewApi.create(variables.productId, variables.review),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      onClose(); // Close modal on success
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      productId,
      review: reviewData,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setReviewData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex font-montserrat items-center justify-center z-50">
      <div className="bg-zinc-900 text-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              value={reviewData.title}
              type="text"
              id="title"
              placeholder="Enter title"
              required
              className="w-full p-2 bg-zinc-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#c2e53a]"
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <textarea
              value={reviewData.description}
              id="description"
              placeholder="Enter description"
              required
              className="w-full p-2 bg-zinc-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#c2e53a]"
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Rating */}
          <label htmlFor="rating" className="block text-sm font-medium mb-1">
            Rating
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-2xl cursor-pointer ${
                  star <= reviewData.rating ? "text-[#c2e53a]" : "text-gray-300"
                }`}
                onClick={() =>
                  setReviewData((prev) => ({ ...prev, rating: star }))
                }
              >
                ★
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 transition-all duration-300 bg-gray-700 text-white rounded-md hover:bg-gray-600 "
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#c2e53a] text-black  rounded-md hover:bg-[#a4c033] transition-all duration-300"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <Loader className="animate-spin" />
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewWriting;
