// types/product.ts
export interface Laptop {
  id: string;
  name: string;
  description: string;
  brand: {
    brandId: string;
    brandName: string;
  };
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  processor: string;
  ram: string;
  storage: string;
  display: string;
  graphics: string;
  stock: number;
  inStock: boolean;
  category: {
    categoryId: string;
    categoryName: string;
  };
  features: string[];
  rating: number;
  color: string[];
  new: boolean;
  hot: boolean;
  view: number;
  status: boolean;
}

export interface FilterState {
  brands: string[];
  priceRange: [number, number];
  categories: string[];
}