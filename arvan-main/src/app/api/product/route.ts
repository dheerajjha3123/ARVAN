// app/api/product/route.ts
import prisma from "@/lib/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 12;
    const sortBy = searchParams.get('sortBy') || "createdAt";
    const sortOrder = searchParams.get('sortOrder') || "desc";
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const status = searchParams.get('status') || "PUBLISHED";

    const skip = (page - 1) * limit;

    const where = {
      status: status as "PUBLISHED" | "DRAFT",
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
        select : {
          id: true,
          name: true,
          price: true,
          assets : {
            select : {
              asset_url: true,
            }
          },
          discountPrice: true,
          createdAt: true,
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        cacheStrategy: { ttl: 60 },
      }, 
    ),
      prisma.product.count({ 
        where,
        cacheStrategy: { ttl: 60 },
      }),
    ]);
      return NextResponse.json({
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalItems: totalCount,
        },
      }, {
        headers: {
          'Cache-Control': 's-maxage=600, stale-while-revalidate=30'
        }
      });
  } catch (error) {
    console.error("API error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}