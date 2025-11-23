import { z } from "zod";
import { OrderFulfillment, OrderStatus } from "@prisma/client";


export const OrderItemSchema = z.object({
  productId: z.string().cuid(),
  productVariantId: z.string().cuid(),
  quantity: z.number().int().min(1),
  priceAtOrder: z.number().min(0),
  color: z.string(),
  productImage: z.string(),
  productName: z.string(),
  size: z.string(),
});

export const createOrderSchema = z.object({
  addressId: z.string().optional(),
  name: z.string().optional(), 
  phone: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  paid: z.boolean().optional(),
  userId: z.string().cuid(), // Required user ID
  items: z.array(OrderItemSchema).min(1), // At least one item is required
  total: z.number().min(0), // Total price must be positive
}).refine(data => data.addressId || (data.name && data.phone && data.street && data.city && data.state && data.country && data.zipCode),
  {
    message: "Either addressId or full address details must be provided",
  }
);

export const updateOrderStatusSchema = z.object({
    status: z.nativeEnum(OrderStatus),
  });
  
  /** ✅ Schema for updating fulfillment status */
  export const updateFulfillmentSchema = z.object({
    fulfillment: z.nativeEnum(OrderFulfillment),
  });