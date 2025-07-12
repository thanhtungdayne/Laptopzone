"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Header from "@/components/header";
import ProductCard from "@/components/product-card";
import { useSearch } from "@/context/search-context";
import Footer from "@/components/footer";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const { state, dispatch, search } = useSearch();
  const [showFilters, setShowFilters] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Memoize URL parameters to prevent unnecessary re-renders
  const urlParams = useMemo(
    () => ({
      query: searchParams.get("q") || "",
      brand: searchParams.get("brand") || "",
      category: searchParams.get("category") || "",
    }),
    [searchParams]
  );

  // Initialize search only once when component mounts or URL changes
  useEffect(() => {
    if (!hasInitialized) {
      const filters: any = {};
      if (urlParams.brand) filters.brand = urlParams.brand;
      if (urlParams.category) filters.category = urlParams.category;

      search(urlParams.query, filters);
      setHasInitialized(true);
    }
  }, [urlParams.query, urlParams.brand, urlParams.category, hasInitialized, search]);

  // Reset initialization when URL changes
  useEffect(() => {
    setHasInitialized(false);
  }, [urlParams.query, urlParams.brand, urlParams.category]);

  const handleFilterChange = useCallback(
    (filterType: string, value: any) => {
      dispatch({ type: "SET_FILTERS", payload: { [filterType]: value } });

      // Re-search with new filters
      const newFilters = { ...state.filters, [filterType]: value };
      search(state.query, newFilters);
    },
    [dispatch, state.filters, state.query, search]
  );

  const handleSortChange = useCallback(
    (sortBy: string) => {
      dispatch({ type: "SET_SORT", payload: sortBy });
      search(state.query, state.filters);
    },
    [dispatch, state.query, state.filters, search]
  );

  const clearFilters = useCallback(() => {
    const defaultFilters = {
      category: "",
      brand: "",
      priceRange: [0, 5000] as [number, number],
      inStock: false,
    };
    dispatch({ type: "SET_FILTERS", payload: defaultFilters });
    search(state.query, defaultFilters);
  }, [dispatch, state.query, search]);

  const getSearchTitle = useCallback(() => {
    if (urlParams.brand) return `${urlParams.brand} Laptop`;
    if (urlParams.category)
      return `${
        urlParams.category.charAt(0).toUpperCase() + urlParams.category.slice(1)
      } Laptop`;
    if (urlParams.query) return `Kết quả tìm kiếm cho "${urlParams.query}"`;
    return "Kết quả tìm kiếm";
  }, [urlParams.brand, urlParams.category, urlParams.query]);

  const brands = useMemo(() => ["Apple", "Dell", "ASUS", "Lenovo", "HP", "MSI"], []);
  const categories = useMemo(
    () => [
      { value: "gaming", label: "Gaming" },
      { value: "business", label: "Doanh nghiệp" },
      { value: "ultrabook", label: "Ultrabook" },
      { value: "workstation", label: "Máy trạm" },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="w-full">
        <div className="w-[85%] max-w-none mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full justify-between"
                >
                  <div className="flex items-center">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Bộ lọc
                  </div>
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              {/* Filters */}
              <div className={`space-y-4 ${showFilters ? "block" : "hidden lg:block"}`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Bộ lọc</h2>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Xóa tất cả
                  </Button>
                </div>

                {/* Price Range */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Khoảng giá</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Slider
                      value={state.filters.priceRange}
                      onValueChange={(value) => handleFilterChange("priceRange", value)}
                      max={5000}
                      min={0}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>${state.filters.priceRange[0]}</span>
                      <span>${state.filters.priceRange[1]}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Brands */}
                <Card>
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
                        <CardTitle className="text-sm">Thương hiệu</CardTitle>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="space-y-3">
                        {brands.map((brandOption) => (
                          <div key={brandOption} className="flex items-center space-x-2">
                            <Checkbox
                              id={brandOption}
                              checked={state.filters.brand === brandOption}
                              onCheckedChange={(checked) =>
                                handleFilterChange("brand", checked ? brandOption : "")
                              }
                            />
                            <Label
                              htmlFor={brandOption}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {brandOption}
                            </Label>
                          </div>
                        ))}
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>

                {/* Categories */}
                <Card>
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
                        <CardTitle className="text-sm">Danh mục</CardTitle>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="space-y-3">
                        {categories.map((categoryOption) => (
                          <div
                            key={categoryOption.value}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={categoryOption.value}
                              checked={state.filters.category === categoryOption.value}
                              onCheckedChange={(checked) =>
                                handleFilterChange(
                                  "category",
                                  checked ? categoryOption.value : ""
                                )
                              }
                            />
                            <Label
                              htmlFor={categoryOption.value}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {categoryOption.label}
                            </Label>
                          </div>
                        ))}
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>

                {/* In Stock */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="inStock"
                        checked={state.filters.inStock}
                        onCheckedChange={(checked) =>
                          handleFilterChange("inStock", checked)
                        }
                      />
                      <Label
                        htmlFor="inStock"
                        className="text-sm font-normal cursor-pointer"
                      >
                        Chỉ hiển thị có hàng
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Search Results */}
            <div className="lg:col-span-3">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold">{getSearchTitle()}</h1>
                  <p className="text-muted-foreground">
                    {state.isLoading
                      ? "Đang tìm kiếm..."
                      : `${state.results.length} sản phẩm được tìm thấy`}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Sắp xếp theo:</span>
                  <Select value={state.sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Liên quan</SelectItem>
                      <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                      <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                      <SelectItem value="name">Tên A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results Grid */}
              {state.isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted rounded-lg h-64 mb-4" />
                      <div className="bg-muted rounded h-4 mb-2" />
                      <div className="bg-muted rounded h-4 w-3/4" />
                    </div>
                  ))}
                </div>
              ) : state.results.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    Không tìm thấy sản phẩm nào
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Xóa bộ lọc
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {state.results.map((laptop) => (
                    <ProductCard key={laptop.id} laptop={laptop} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
