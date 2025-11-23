import { ProductPerformance } from "@/components/admin/product-performance-table";
import { apiClient } from "@/lib/axiosClient";


export const ProductPerformanceApi = {
    getAll: async (): Promise<ProductPerformance[]> => {
      const response = await apiClient.get("/api/productperformance");
      return response.data; 
    }
  }
  
