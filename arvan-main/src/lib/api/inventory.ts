import { apiClient } from "../axiosClient";
import { Varient } from "@/types/types";


interface InventoryOverview {
  totalProducts: number;
  lowStockItems: number;
  outOfStock: number;
  restockAlerts: number;
}
const getInventoryOverview = async (): Promise<InventoryOverview> => {
  const response = await apiClient.get('/api/inventory/overview');
  return response.data;
};

export interface InventoryItem {
  id: number;
  name: string;
  inStock: number;
  lowStockThreshold: number;
}

const getInventory = async (currentPage: number, itemsPerPage: number, debouncedSearchTerm: string): Promise<{ products: InventoryItem[], pagination: { totalPages: number } }> => {
  const response = await apiClient.get(`/api/inventory/all`, {
    params: {
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearchTerm,
    }
  });
  return response.data;
};

interface Size {
  id: string;
  size: string;
  stock: number;
  colorId: string;
}

const updateStock = async (variantId: string, stock: number): Promise<Size> => {
  const response = await apiClient.put(`/api/products/stock`, {
    stock,
    variantId,
  });
  return response.data.updatedVariant;
};

const addNewSize = async (colorId: string, sizes: Array<{ size: string; stock: number }>): Promise<Varient[]> => {
  const response = await apiClient.post(`/api/products/sizes`, {
    colorId,
    sizes
  });
  return response.data.variants;
};

const addNewColor = async (productId: string, newColorData: {name : string,imageUrl:string, sizes: Array<{ size: string; stock: number }>}): Promise<Varient[]> => {
  const response = await apiClient.post(`/api/products/color`, {
    productId,
    color: newColorData.name,
    assets : [{
      type : "IMAGE",
      url : newColorData.imageUrl
    }],
    sizes : newColorData.sizes
  });
  return response.data.productColor;
};

const deleteSize = async (sizeId: string): Promise<void> => {
  await apiClient.delete(`/api/products/sizes/${sizeId}`);
};

export const inventoryApi = {
  getInventoryOverview,
  getInventory,
  updateStock,
  addNewSize,
  addNewColor,
  deleteSize,
};