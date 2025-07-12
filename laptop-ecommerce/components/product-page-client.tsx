"use client";

import { useState } from "react";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Info,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ImageGallery from "@/components/image-gallery";
import Specifications from "@/components/specifications";
import RelatedProducts from "@/components/related-products";
import Breadcrumb from "@/components/breadcrumb";
import { useCart } from "@/context/cart-context";
import { laptops } from "@/data/laptops";
import { formatPrice } from "@/lib/utils";
import type { Laptop } from "@/types/product";

interface ProductPageClientProps {
  laptop: Laptop;
}

export default function ProductPageClient({ laptop }: ProductPageClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [isSpecsDialogOpen, setIsSpecsDialogOpen] = useState(false);
  const { dispatch } = useCart();

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: "ADD_ITEM", payload: laptop });
    }
  };

  const breadcrumbItems = [
    { label: "Laptop", href: "/" },
    { label: laptop.category.charAt(0).toUpperCase() + laptop.category.slice(1) },
    { label: laptop.name },
  ];

  return (
    <div className="w-[85%] max-w-none mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="grid lg:grid-cols-2 gap-12 mb-12">
        {/* Image Gallery - Bigger container */}
        <div className="flex w-full">
          <ImageGallery images={laptop.images} productName={laptop.name} />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline">{laptop.brand}</Badge>
              <Badge
                variant={laptop.inStock ? "default" : "secondary"}
                className={
                  laptop.inStock
                    ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0"
                    : ""
                }
              >
                {laptop.inStock ? "Còn hàng" : "Hết hàng"}
              </Badge>
              {laptop.stock && laptop.stock <= 5 && laptop.stock > 0 && (
                <Badge variant="destructive">Chỉ còn {laptop.stock} sản phẩm</Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-4">{laptop.name}</h1>

            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {formatPrice(laptop.price)}
              </span>
              {laptop.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(laptop.originalPrice)}
                  </span>
                  <Badge variant="destructive">
                    Tiết kiệm {formatPrice(laptop.originalPrice - laptop.price)}
                  </Badge>
                </>
              )}
            </div>
          </div>

          {/* Key Specs - Shortened */}
          <Card className="border-2 border-transparent bg-gradient-to-br from-blue-50 to-purple-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Thông số chính
                </h3>
                <Dialog open={isSpecsDialogOpen} onOpenChange={setIsSpecsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1"
                    >
                      <Info className="h-4 w-4 mr-1" />
                      Xem chi tiết
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">
                        Thông số kỹ thuật chi tiết - {laptop.name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <Specifications laptop={laptop} />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Shortened specs - only show 2 rows instead of 4 */}
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bộ xử lý:</span>
                  <span className="font-medium text-right">{laptop.processor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">RAM / Lưu trữ:</span>
                  <span className="font-medium text-right">
                    {laptop.ram} / {laptop.storage}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Màn hình:</span>
                  <span className="font-medium text-right">{laptop.display}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="quantity" className="text-sm font-medium">
                Số lượng:
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
                className="border rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!laptop.inStock}
              >
                {[...Array(Math.min(10, laptop.stock || 1))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              {laptop.stock && laptop.stock < 10 && (
                <span className="text-sm text-muted-foreground">
                  (Còn {laptop.stock} sản phẩm)
                </span>
              )}
            </div>

            <div className="flex space-x-3">
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                onClick={handleAddToCart}
                disabled={!laptop.inStock || !laptop.stock}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Thêm vào giỏ
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 hover:text-white hover:border-transparent"
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 hover:text-white hover:border-transparent"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Shipping & Returns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2 text-sm p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <Truck className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium">Miễn phí vận chuyển</div>
                <div className="text-muted-foreground">Đơn hàng trên $500</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium">Bảo hành 2 năm</div>
                <div className="text-muted-foreground">Bảo hành nhà sản xuất</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm p-3 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
              <RotateCcw className="h-5 w-5 text-orange-600" />
              <div>
                <div className="font-medium">Đổi trả 30 ngày</div>
                <div className="text-muted-foreground">Chính sách đổi trả dễ dàng</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="specifications" className="mb-12">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="specifications">Thông số kỹ thuật</TabsTrigger>
          <TabsTrigger value="shipping">Vận chuyển & Đổi trả</TabsTrigger>
        </TabsList>

        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Thông số kỹ thuật</h3>
                <Dialog open={isSpecsDialogOpen} onOpenChange={setIsSpecsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Info className="h-4 w-4 mr-1" />
                      Xem chi tiết đầy đủ
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>

              {/* Shortened specifications table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Bộ xử lý</span>
                    <span className="text-right">{laptop.processor}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Bộ nhớ RAM</span>
                    <span className="text-right">{laptop.ram}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Ổ cứng</span>
                    <span className="text-right">{laptop.storage}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Màn hình</span>
                    <span className="text-right">{laptop.display}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Card đồ họa</span>
                    <span className="text-right">{laptop.graphics}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Tình trạng</span>
                    <span className="text-right">
                      {laptop.inStock ? "Còn hàng" : "Hết hàng"}
                      {laptop.stock && ` (${laptop.stock} sản phẩm)`}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Thông tin vận chuyển</h3>
                  <div className="space-y-2 text-sm">
                    <p>• Miễn phí vận chuyển tiêu chuẩn cho đơn hàng trên $500</p>
                    <p>• Vận chuyển nhanh với phí $29.99</p>
                    <p>• Giao hàng tiêu chuẩn: 3-5 ngày làm việc</p>
                    <p>• Giao hàng nhanh: 1-2 ngày làm việc</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Chính sách đổi trả</h3>
                  <div className="space-y-2 text-sm">
                    <p>• Thời gian đổi trả 30 ngày kể từ ngày giao hàng</p>
                    <p>• Sản phẩm phải ở tình trạng và bao bì ban đầu</p>
                    <p>• Miễn phí vận chuyển đổi trả cho sản phẩm lỗi</p>
                    <p>• Có thể áp dụng phí tái kho cho phần mềm đã mở</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Bảo hành
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>• Bảo hành nhà sản xuất 2 năm</p>
                    <p>• Có thể mở rộng bảo hành</p>
                    <p>• Hỗ trợ kỹ thuật bao gồm</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      <RelatedProducts currentProduct={laptop} allProducts={laptops} />
    </div>
  );
}
