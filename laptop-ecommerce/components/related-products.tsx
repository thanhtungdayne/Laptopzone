import ProductCard from "./product-card"
import type { Laptop } from "@/types/product"

interface RelatedProductsProps {
  currentProduct: Laptop
  allProducts: Laptop[]
}

export default function RelatedProducts({ currentProduct, allProducts }: RelatedProductsProps) {
  // Get related products based on brand or category
  const relatedProducts = allProducts
    .filter(
      (product) =>
        product.id !== currentProduct.id &&
        (product.brand === currentProduct.brand || product.category === currentProduct.category),
    )
    .slice(0, 4)

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Sản phẩm tương tự</h2>
        <p className="text-muted-foreground">Sản phẩm cùng thương hiệu hoặc loại máy</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((laptop) => (
          <ProductCard key={laptop.id} laptop={laptop} />
        ))}
      </div>
    </div>
  )
}
