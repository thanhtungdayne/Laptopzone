"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductCard from "./product-card";
import type { Laptop } from "@/types/product";
import axios from "axios";
import { laptops as fallbackLaptops } from "@/data/laptops";

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Laptop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("http://localhost:3000/product/");

        // Check if API returned data
        if (response.data && response.data.result && response.data.result.length > 0) {
          const products = response.data.result.slice(0, 6);
          setFeaturedProducts(products);
          console.log("Fetched featured products from API");
        } else {
          // Use fallback data if API returns null or empty
          const products = fallbackLaptops.slice(0, 6);
          setFeaturedProducts(products);
          console.log("Using fallback featured products data");
        }
      } catch (err) {
        // Use fallback data on error
        const products = fallbackLaptops.slice(0, 6);
        setFeaturedProducts(products);
        console.log("API failed, using fallback featured products data");
        console.error("Error fetching featured products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sản phẩm nổi bật</h2>
            <p className="text-gray-600">Khám phá các sản phẩm nổi bật của chúng tôi</p>
          </div>
          <Link href="/products">
            <Button variant="outline">Xem tất cả</Button>
          </Link>
        </div>
        <div className="text-center py-8">
          <div className="text-lg text-gray-600">Đang tải sản phẩm nổi bật...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 mb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Sản phẩm nổi bật</h2>
          <p className="text-gray-600">Khám phá các sản phẩm nổi bật của chúng tôi</p>
        </div>
        <Link href="/products">
          <Button variant="outline">Xem tất cả</Button>
        </Link>
      </div>

      {featuredProducts.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-lg text-gray-600">Không có sản phẩm nổi bật</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((laptop) => (
            <ProductCard key={laptop.id} laptop={laptop} />
          ))}
        </div>
      )}
    </div>
  );
}
