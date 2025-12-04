import { apiClient } from "../axiosClient";

export interface OrderItems {
  id?: string;
  productId: string;
  quantity: number;
  priceAtOrder: number;
  productVariantId: string;
  color: string;
  productImage: string;
  productName: string;
  size: string;
}

export interface Order {
  id?: string;
  addressId: string;
  awb?: string;
  paid?: boolean;
  userId: string;
  items: OrderItems[];
  total: number;
  status: string;
  DeliveryStatus?: string;
  fulfillment?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const orderApi = {
  getOrders: async (
    currentPage: string,
    itemsPerPage: string,
    debouncedSearchTerm: string
  ): Promise<{
    success: boolean;
    orders: Order[];
    pagination: {
      totalPages: number;
      currentPage: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }> => {
    const response = await apiClient.get("/api/orders", {
      params: {
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchTerm,
      },
    });
    return response.data;
  },
  getOrderById: async (id: string): Promise<Order> => {
    const response = await apiClient.get(`/api/orders/${id}`);
    return response.data.order;
  },
  createOrder: async (order: Order): Promise<Order> => {
    const response = await apiClient.post("/api/orders", order);
    return response.data.order;
  },
  updateOrder: async (id: string, order: Order): Promise<Order> => {
    const response = await apiClient.put(`/api/orders/${id}`, order);
    return response.data.order;
  },
  deleteOrder: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/orders/${id}`);
  },
};
