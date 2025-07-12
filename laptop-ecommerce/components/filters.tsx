"use client";

import { useState } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FilterState } from "@/types/product";

interface FiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const brands = ["Apple", "Dell", "ASUS", "Lenovo", "HP", "MSI"];
const categories = [
  { value: "gaming", label: "Gaming" },
  { value: "business", label: "Văn phòng" },
  { value: "ultrabook", label: "Ultrabook" },
  { value: "workstation", label: "Workstation" },
];

export default function Filters({ filters, onFiltersChange }: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters.brands, brand]
      : filters.brands.filter((b) => b !== brand);

    onFiltersChange({ ...filters, brands: newBrands });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter((c) => c !== category);

    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handlePriceChange = (value: number[]) => {
    onFiltersChange({ ...filters, priceRange: [value[0], value[1]] });
  };

  const clearFilters = () => {
    onFiltersChange({
      brands: [],
      priceRange: [0, 5000],
      categories: [],
    });
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between"
        >
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Bộ lọc
          </div>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </Button>
      </div>

      {/* Filters */}
      <div className={`space-y-4 ${isOpen ? "block" : "hidden lg:block"}`}>
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
              value={filters.priceRange}
              onValueChange={handlePriceChange}
              max={5000}
              min={0}
              step={100}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </CardContent>
        </Card>

        {/* Brands */}
        <Card>
          <Collapsible defaultOpen>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="text-sm flex items-center justify-between">
                  Thương hiệu
                  <ChevronDown className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-3">
                {brands.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={brand}
                      checked={filters.brands.includes(brand)}
                      onCheckedChange={(checked) =>
                        handleBrandChange(brand, checked as boolean)
                      }
                    />
                    <Label htmlFor={brand} className="text-sm font-normal cursor-pointer">
                      {brand}
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
                <CardTitle className="text-sm flex items-center justify-between">
                  Loại máy
                  <ChevronDown className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-3">
                {categories.map((category) => (
                  <div key={category.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.value}
                      checked={filters.categories.includes(category.value)}
                      onCheckedChange={(checked) =>
                        handleCategoryChange(category.value, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={category.value}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {category.label}
                    </Label>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>
    </>
  );
}
