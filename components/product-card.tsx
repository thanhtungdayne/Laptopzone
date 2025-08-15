import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Laptop } from "@/types/product";
import { useCart } from "@/context/cart-context";
import Link from "next/link";


interface ProductCardProps {
  laptop: Laptop;
}

export default function ProductCard({ laptop }: ProductCardProps) {
  const { dispatch,setIsOpen } = useCart();

  const handleAddToCart = () => {
  if (!laptop.productVariants || laptop.productVariants.length === 0) {
    alert("Sản phẩm chưa có biến thể để mua.");
    return;
  }

  // Giả sử bạn muốn chọn biến thể đầu tiên (sau này có thể chọn từ dropdown)
  const variant = laptop.productVariants[0];
  const variantId = variant._id;

  addItem(variantId, 1); // gọi backend để thêm vào giỏ hàng
};

  function fixImageQuality(url: string): string {
    return url.replace(/_AC_[^_]+_/, "_AC_SL1000_");
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-transform duration-300 transform flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
  <img
    src={fixImageQuality(laptop.image || "/placeholder.svg")}
    alt={laptop.name}
    className="w-full h-48 object-contain transition-transform duration-300 group-hover:scale-105"
  />

        {laptop.originalprice && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            Tiết kiệm {(laptop.originalprice - laptop.price).toLocaleString("vi-VN")} ₫
          </Badge>
        )}
        {!laptop.inStock && (
          <Badge variant="secondary" className="absolute top-2 right-2">
            Out of Stock
          </Badge>
        )}
      </div>

      <CardContent className="p-4 flex flex-col flex-1 justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {laptop.brand?.brandName}
            </Badge>
          </div>

          <Link href={`/product/${laptop.id}`}>
            <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem] hover:underline">
              {laptop.name}
            </h3>
          </Link>

          <div className="space-y-1 text-xs text-muted-foreground min-h-[3.5rem]">
            <div>{laptop.processor}</div>
            <div>{laptop.ram} RAM • {laptop.storage}</div>
            <div>{laptop.display}</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg">
                {laptop.price.toLocaleString("vi-VN")} ₫
              </span>
              {laptop.originalprice && (
                <span className="text-sm text-muted-foreground line-through hidden sm:inline">
                  {laptop.originalprice.toLocaleString("vi-VN")} ₫
                </span>
              )}
            </div>

          </div>

          <Button
  size="sm"
  onClick={(e) => {
    e.preventDefault();
    handleAddToCart();
  }}
  disabled={!laptop.inStock}
  className="shrink-0 bg-[#5440DB] hover:bg-[#4430c2] text-white"
>
  <ShoppingCart className="h-4 w-4 mr-1" />
  Mua ngay
</Button>
        </div>
      </CardContent>
    </Card>
  );
}