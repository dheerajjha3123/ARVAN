import { apiClient } from "@/lib/axiosClient";
import { Testimonial } from "@/components/admin/testimonials-manager";

export const testimonialApi = {
  getAll: async (): Promise<Testimonial[]> => {
    const response = await apiClient.get("/api/testimonials");
    return response.data.testimonials;
  },
  
  getById: async (id: string): Promise<Testimonial> => {
    const response = await apiClient.get(`/api/testimonials/${id}`);
    return response.data;
  },
  
  create: async (testimonial: Omit<Testimonial, "id" | "date">): Promise<Testimonial> => {
    const response = await apiClient.post("/api/testimonials", testimonial);
    return response.data;
  },
  
  update: async (id: string, testimonial: Partial<Testimonial>): Promise<Testimonial> => {
    const response = await apiClient.put(`/api/testimonials/${id}`, testimonial);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/testimonials/${id}`);
  }
};