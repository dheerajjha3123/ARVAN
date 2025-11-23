import { apiClient } from "@/lib/axiosClient";
import { Review } from "@/types/types";

export const productReviewApi = {
    // fetch all reviews
  getAll: async (productId: string): Promise<Review[]> => {
    const response = await apiClient.get("/api/reviews", {params: {productId}});
    return response.data.reviews;
  },

    // fetch review by product id
    getById: async (productId: string): Promise<{reviews : Review[]}> => {
        const response = await apiClient.get(`/api/reviews/${productId}`);
        return response.data;
    },

    // create a new review by product id
    create: async (id: string , review: Omit<Review, "id" | "date">): Promise<Review> => {
        const response = await apiClient.post(`/api/reviews/${id}`, review);
        return response.data;
    },

    // update a review
    update: async (id: string, review: Partial<Review>): Promise<Review> => {
        const response = await apiClient.put(`/api/reviews/${id}`, review);
        return response.data;
    },

    // delete
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/reviews/${id}`);
    }

};