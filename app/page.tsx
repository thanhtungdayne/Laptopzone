"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
import CarouselBanner from "@/components/carousel-banner";
import PromotionalFeatures from "@/components/promotional-features";
import PromotionalBanners from "@/components/promotional-banners";
import FeaturedProducts from "@/components/featured-products";
import BlogSection from "@/components/blog-section";
import type { FilterState, Laptop } from "@/types/product";
import Footer from "@/components/footer";
import { Suspense } from "react";
import axios from "axios";
import { laptops as fallbackLaptops } from "@/data/laptops";

export default function HomePage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    priceRange: [0, 5000],
    categories: categoryParam ? [categoryParam] : [],
  });

  const [sortBy, setSortBy] = useState("featured");

  // Fetch laptops data
  useEffect(() => {
    const fetchLaptops = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("http://localhost:5000/product/");

        // Check if API returned data
        if (response.data && response.data.result && response.data.result.length > 0) {
          setLaptops(response.data.result);
          console.log("Fetched laptops from API:", response.data.result);
        } else {
          // Use fallback data if API returns null or empty
          setLaptops(fallbackLaptops);
          console.log("Using fallback laptops data");
        }
      } catch (err) {
        // Use fallback data on error
        setLaptops(fallbackLaptops);
        console.log("API failed, using fallback laptops data");
        console.error("Error fetching laptops:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLaptops();
  }, []);

  // Update filters when category parameter changes
  useEffect(() => {
    if (categoryParam) {
      setFilters((prev) => ({
        ...prev,
        categories: [categoryParam],
      }));
    }
  }, [categoryParam]);

  const filteredAndSortedLaptops = useMemo(() => {
    // Add safety check for laptops array
    if (!laptops || laptops.length === 0) {
      return [];
    }

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
  }, [laptops, filters, sortBy]);

  const getCategoryTitle = () => {
    if (categoryParam) {
      const categoryNames: { [key: string]: string } = {
        gaming: "Gaming",
        business: "Văn phòng",
        ultrabook: "Ultrabook",
        workstation: "Workstation",
      };
      return categoryNames[categoryParam] + " Laptop";
    }
    return "Laptop";
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="w-full">
          <div className="w-[85%] max-w-none mx-auto px-4">
            <CarouselBanner />
            <PromotionalFeatures />
            <div className="text-center py-12">
              <div className="text-lg">Đang tải dữ liệu...</div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="w-full">
        <div className="w-[85%] max-w-none mx-auto px-4">
          <CarouselBanner />
          <PromotionalFeatures />
          <Suspense
            fallback={<div className="text-center py-8">Đang tải sản phẩm...</div>}
          >
            <FeaturedProducts />
          </Suspense>
          <PromotionalBanners />

          {/* Blog Section */}
          <BlogSection />

          {/* Only show filters and products if there's a category parameter */}
          {categoryParam && (
            <div className="py-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1">
                  <Filters filters={filters} onFiltersChange={setFilters} />
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                      <h1 className="text-2xl font-bold">{getCategoryTitle()}</h1>
                      <p className="text-muted-foreground">
                        {filteredAndSortedLaptops.length} sản phẩm được tìm thấy
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Sắp xếp theo:</span>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="featured">Nổi bật</SelectItem>
                          <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                          <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                          <SelectItem value="name">Tên A-Z</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Products Grid */}
                  {filteredAndSortedLaptops.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">Không tìm thấy sản phẩm nào</p>
                      <Button
                        variant="outline"
                        className="mt-4 bg-transparent"
                        onClick={() =>
                          setFilters({
                            brands: [],
                            priceRange: [0, 5000],
                            categories: [],
                          })
                        }
                      >
                        Xóa bộ lọc
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredAndSortedLaptops.map((laptop) => (
                        <ProductCard key={laptop.id} laptop={laptop} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
