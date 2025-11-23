import { apiClient } from "@/lib/axiosClient";
import { Category } from "@/types/types"; 

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get("/api/category");
    return response.data.categories;
  },
  getById: async (id: string): Promise<Category> => {
    const response = await apiClient.get(`/api/category/${id}`);
    return response.data;
  },
  addCategory: async (category: string): Promise<Category> => {
    const response = await apiClient.post("/api/category", {name:category});
    return response.data;
  },
  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/category/${id}`);
  },
  updateCategory: async (id: string, category: string): Promise<Category> => {
    const response = await apiClient.put(`/api/category/${id}`, {name:category});
    return response.data;
  }
};
