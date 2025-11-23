'use server';

import prisma from "@/lib/prisma-client";
import type { Product } from "@prisma/client";

export async function getProductsFromServer({
  page = 1,
  limit = 12,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  minPrice,
  maxPrice,
  status = 'PUBLISHED',
}: {
  page?: number;
  limit?: number;
  sortBy?: keyof Product;
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  status?: 'PUBLISHED' | 'DRAFT';
}) {
  const skip = (page - 1) * limit;

  const where: {
    status: 'PUBLISHED' | 'DRAFT';
    price?: {
      gte?: number;
      lte?: number;
    };
  } = {
    status,
    ...(minPrice !== undefined && maxPrice !== undefined
      ? { price: { gte: minPrice, lte: maxPrice } }
      : minPrice !== undefined
      ? { price: { gte: minPrice } }
      : maxPrice !== undefined
      ? { price: { lte: maxPrice } }
      : {}),
  };
  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { assets: true },
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalItems: totalCount,
    },
  };
}
