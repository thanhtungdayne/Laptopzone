export interface Laptop {
  id: number;
  name: string;
  brand: string;
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
  category: "gaming" | "business" | "ultrabook" | "workstation";
  features: string[];
}

export interface CartItem {
  laptop: Laptop;
  quantity: number;
}

export interface FilterState {
  brands: string[];
  priceRange: [number, number];
  categories: string[];
}
