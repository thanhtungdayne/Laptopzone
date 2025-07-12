export interface Laptop {
  id: string; // từ _id trong Mongo
  name: string;
  brand: string; // bạn nên map từ brand.brandName
  price: number;
  originalprice?: number; // từ originalprice (cẩn thận: schema là string!)
  image: string;
  images: string[];
  processor: string[]; // vì schema là mảng
  ram: string;
  storage: string;
  display: string;
  graphics: string[]; // vì schema là mảng
  color: string[];
  stock: number;
  inStock: boolean;
  category: string; // map từ category.categoryName
  features: string[];
  resolution?: string;
  panelType?: string;
  refreshRate?: string;
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
