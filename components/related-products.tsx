import ProductCard from "./product-card"
import type { Laptop } from "@/types/product"

interface RelatedProductsProps {
  currentProduct: Laptop
  allProducts: Laptop[]
}

export default function RelatedProducts({ currentProduct, allProducts }: RelatedProductsProps) {
  

  const relatedProducts = allProducts
    .filter(
      (product) =>
        product._id !== currentProduct._id &&
        (
          product.brand?.brandId === currentProduct.brand?.brandId ||
          product.category?.categoryId === currentProduct.category?.categoryId
        )
    )
    .slice(0, 4)

  if (relatedProducts.length === 0) {
    return null
  }

 return (
  <div className="space-y-6 mt-16 w-[85%] mx-auto">
    <div className="text-center">
      <h2 className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Sản phẩm tương tự
      </h2>
      <p className="text-muted-foreground text-sm">
        Dựa theo thương hiệu hoặc danh mục tương tự
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {relatedProducts.map((product) => (
        <ProductCard key={product._id} laptop={product} />
      ))}
    </div>
  </div>
);

}