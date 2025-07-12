"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/header";
import ProductCard from "@/components/product-card";
import Filters from "@/components/filters";
import { laptops } from "@/data/laptops";
import type { FilterState } from "@/types/product";
import Footer from "@/components/footer";
import { useSearchParams } from "next/navigation";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    priceRange: [0, 5000],
    categories: categoryParam ? [categoryParam] : [],
  });

  const [sortBy, setSortBy] = useState("featured");

  // Update filters when category parameter changes
  useEffect(() => {
    if (categoryParam) {
      setFilters((prev) => ({
        ...prev,
        categories: [categoryParam],
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        categories: [],
      }));
    }
  }, [categoryParam]);

  const filteredAndSortedLaptops = useMemo(() => {
    const filtered = laptops.filter((laptop) => {
      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(laptop.brand)) {
        return false;
      }

      // Price filter
      if (laptop.price < filters.priceRange[0] || laptop.price > filters.priceRange[1]) {
        return false;
      }

      // Category filter
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(laptop.category)
      ) {
        return false;
      }

      return true;
    });

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Featured - keep original order
        break;
    }

    return filtered;
  }, [filters, sortBy]);

  const getPageTitle = () => {
    if (categoryParam === "workstation") {
      return "Workstations Laptops";
    }
    if (categoryParam === "ultrabook") {
      return "Ultrabooks Laptops";
    }
    if (categoryParam === "gaming") {
      return "Gaming Laptops";
    }
    if (categoryParam === "business") {
      return "Business Laptops";
    }
    if (categoryParam) {
      return categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1) + " Laptops";
    }

    return "Laptops";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <div className="w-full flex flex-col items-center">
        <div className="w-[85%] max-w-none mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Filters filters={filters} onFiltersChange={setFilters} />
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    {getPageTitle()}
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-semibold">
                      {filteredAndSortedLaptops.length}
                    </span>{" "}
                    products found
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-sm text-muted-foreground font-medium">
                    Sort by:
                  </span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px] border-2 border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 border-blue-100">
                      <SelectItem
                        value="featured"
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                      >
                        Featured
                      </SelectItem>
                      <SelectItem
                        value="price-low"
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                      >
                        Price: Low to High
                      </SelectItem>
                      <SelectItem
                        value="price-high"
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                      >
                        Price: High to Low
                      </SelectItem>
                      <SelectItem
                        value="rating"
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                      >
                        Highest Rated
                      </SelectItem>
                      <SelectItem
                        value="name"
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                      >
                        Name: A-Z
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Products Grid */}
              {filteredAndSortedLaptops.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border border-gray-200">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306A7.962 7.962 0 0112 5c-2.34 0-4.29 1.009-5.824 2.562"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-600 mb-2">
                      No products found
                    </p>
                    <p className="text-sm text-gray-500">
                      Try adjusting your filters or search terms
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700"
                    onClick={() =>
                      setFilters({
                        brands: [],
                        priceRange: [0, 5000],
                        categories: [],
                      })
                    }
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredAndSortedLaptops.map((laptop) => (
                    <div
                      key={laptop.id}
                      className="transform transition-all duration-300 hover:scale-105"
                    >
                      <ProductCard laptop={laptop} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
