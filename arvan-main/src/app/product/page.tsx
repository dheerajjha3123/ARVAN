"use client";
import PageLoader from "@/components/Loader";
import Navigation from "@/components/navigation";
import ProductGrid from "@/components/product-grid";
import { Button } from "@/components/ui/button";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import React, { useState, useMemo, useEffect, useRef } from "react";
import type { Product } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import axios from "axios";

type SortOption = {
  label: string;
  value: "price_asc" | "price_desc" | "name_asc" | "name_desc" | "newest" | "oldest";
};

const sortOptions: SortOption[] = [
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Name: A to Z", value: "name_asc" },
  { label: "Name: Z to A", value: "name_desc" },
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
];

const filterOptions = {
  priceRanges: ["Under ₹1000", "₹1000 - ₹2000", "₹2000 - ₹3000", "Above ₹3000"],
};

export default function ProductPage() {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState<{ priceRanges: string[] }>({ priceRanges: [] });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (document.readyState === "complete") {
      setPageLoaded(true);
    } else {
      window.addEventListener("load", () => setPageLoaded(true));
    }

    return () => window.removeEventListener("load", () => setPageLoaded(true));
  }, []);

  const fetchProducts = async ({
    pageParam = 1,
  }: {
    pageParam: number;
  }) => {
    const limit = 12;
  
    let minPrice: number | undefined;
    let maxPrice: number | undefined;
  
    const ranges = filters.priceRanges;
  
    if (ranges.includes("Under ₹1000")) {
      minPrice = 0;
      maxPrice = 999;
    }
    if (ranges.includes("₹1000 - ₹2000")) {
      minPrice = minPrice !== undefined ? Math.min(minPrice, 1000) : 1000;
      maxPrice = maxPrice !== undefined ? Math.max(maxPrice, 2000) : 2000;
    }
    if (ranges.includes("₹2000 - ₹3000")) {
      minPrice = minPrice !== undefined ? Math.min(minPrice, 2000) : 2000;
      maxPrice = maxPrice !== undefined ? Math.max(maxPrice, 3000) : 3000;
    }
    if (ranges.includes("Above ₹3000")) {
      minPrice = minPrice !== undefined ? Math.min(minPrice, 3001) : 3001;
    }
  
    const sortFieldMap: Record<string, string> = {
      price_asc: "price",
      price_desc: "price",
      name_asc: "name",
      name_desc: "name",
      newest: "createdAt",
      oldest: "createdAt",
    };
  
    const sortOrderMap: Record<string, "asc" | "desc"> = {
      price_asc: "asc",
      price_desc: "desc",
      name_asc: "asc",
      name_desc: "desc",
      newest: "desc",
      oldest: "asc",
    };
  
    const sortByField = sortFieldMap[sortBy];
    const sortOrder = sortOrderMap[sortBy];
  
    const searchParams = new URLSearchParams({
      page: pageParam.toString(),
      limit: limit.toString(),
      sortBy: sortByField,
      sortOrder,
      status: "PUBLISHED",
    });

    if (minPrice !== undefined) {
      searchParams.append('minPrice', minPrice.toString());
    }
    if (maxPrice !== undefined) {
      searchParams.append('maxPrice', maxPrice.toString());
    }

    const response = await axios.get(`/api/product?${searchParams.toString()}`);
    return response.data;
  };
  const {
    data: products,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["products", filters, sortBy],
    queryFn: ({ pageParam = 1 }) => fetchProducts({ pageParam }),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      return pagination.currentPage < pagination.totalPages
        ? pagination.currentPage + 1
        : undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  const getAllProducts = useMemo(() => {
    if (!products?.pages) return [];

    const all = products.pages.flatMap((group) => group.products);
    return all;
  }, [products]);

  const handleFilterChange = (type: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((v) => v !== value)
        : [...prev[type], value],
    }));
  };

  if (!pageLoaded) return <PageLoader />;

  return (
    <div className="min-h-screen font-montserrat bg-black text-white overflow-x-hidden">
      <Navigation />

      {/* Hero */}
      <section className="h-[60vh] lg:h-[40vh] xl:h-[80vh] relative flex items-center justify-center">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-72 md:h-72 lg:w-96 lg:h-96 rounded-full bg-gray-200/40 blur-3xl"
          style={{ boxShadow: "0 0 80px 120px rgba(255, 255, 255, 0.2)" }} />
        <div className="w-full relative h-full flex justify-center items-center p-2">
          <h1 className="text-[25vw] md:text-[20vw] lg:text-[15vw] absolute top-[45%] left-[25%] lg:left-[35%] -translate-x-1/2 -translate-y-1/2 font-coluna font-bold tracking-wider z-10 text-center">
            STEP
          </h1>
          <Image src="/slides/2.png" alt="Stylish Arvan Slippers" width={500} height={500} className="w-full h-full object-contain relative z-[15] -rotate-12" />
          <h1 className="text-[25vw] md:text-[20vw] lg:text-[15vw] top-[62%] absolute left-[70%] -translate-x-1/2 -translate-y-1/2 font-coluna font-bold tracking-wider z-[20] text-center flex flex-col leading-none">
            <span className="text-4xl inline-block">INTO</span>STYLE.
          </h1>
        </div>
      </section>

      {/* Product Grid */}
      <section className="w-full pb-10">
        <div className="flex justify-between items-center mb-8 px-5">
          <h2 className="text-md md:text-xl font-medium">All Products</h2>
          <div className="flex items-center justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-white border-white/20 text-xs">
                  SORT BY: {sortOptions.find((o) => o.value === sortBy)?.label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/90 border-white/20">
                {sortOptions.map((option) => (
                  <DropdownMenuItem key={option.value} className="text-white hover:bg-white/10"
                    onClick={() => setSortBy(option.value)}>
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-white flex items-center border-white/20">
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black/95 text-white border-white/20">
                <DialogHeader>
                  <DialogTitle>Filter Products</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Price Range</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {filterOptions.priceRanges.map((range) => (
                        <div key={range} className="flex items-center space-x-2">
                          <Checkbox
                            id={range}
                            checked={filters.priceRanges.includes(range)}
                            onCheckedChange={() => handleFilterChange("priceRanges", range)}
                            className="border-white/20"
                          />
                          <Label htmlFor={range} className="text-white">
                            {range}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center my-16">
            <Loader className="animate-spin" />
          </div>
        ) : isError ? (
          <h1 className="text-center mt-16">Something went wrong</h1>
        ) : getAllProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0">
            {getAllProducts.map((product: Product, i: number) => (
              //@ts-expect-error: Product type is not defined yet
              <ProductGrid key={`${product.id}-${i}`} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center my-16">
            <p>No Products available for this range.</p>
          </div>
        )}

        {hasNextPage && (
          <div ref={loadMoreRef} className="flex justify-center mt-16">
            <Loader className="animate-spin" />
          </div>
        )}
      </section>
    </div>
  );
}
