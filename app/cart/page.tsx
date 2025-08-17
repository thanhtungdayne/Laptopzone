"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/header";
import ProductCard from "@/components/product-card";
import { useCart } from "@/context/cart-context";
import Footer from "@/components/footer";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import toast from "react-hot-toast";

// Hàm định dạng giá tiền với VND
const formatPriceVND = (price: number) => `${price.toLocaleString()} VND`;

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const { items, total, updateQuantity, removeItem, fetchCart } = useCart();
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);

  const subtotal = total ?? 0;

  // Sử dụng useMemo để ổn định excludeIds
  const excludeIds = useMemo(() => items.map((item) => item.variantId), [items]);
  // Giả sử categoryId lấy từ sản phẩm đầu tiên trong giỏ hàng (nếu có)
  const categoryId = items.length > 0 ? items[0].categoryId : undefined;

  // Đồng bộ giỏ hàng khi component mount hoặc khi items thay đổi
  useEffect(() => {
    if (isAuthenticated&& items.length === 0) {
      fetchCart(); // Lấy dữ liệu giỏ hàng mới từ server
    }
  }, [isAuthenticated, items.length, fetchCart]);

  // Log để debug state giỏ hàng
  useEffect(() => {
    console.log('CartPage - Current items:', items);
    console.log('CartPage - Current total:', total);
  }, [items, total]);

  // Hàm lấy sản phẩm gợi ý
  useEffect(() => {
    async function fetchRelatedProducts() {
      try {
        if (!categoryId) {
          setRecommendedProducts([]);
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/product?category=${categoryId}`
        );
        const data = await res.json();

        const products = data.result || [];
        // Lọc sản phẩm không nằm trong giỏ hàng và lấy 4 sản phẩm đầu tiên
        const filteredProducts = products
          .filter((item: any) => !excludeIds.includes(item._id))
          .slice(0, 4);

        // Chỉ cập nhật nếu dữ liệu mới khác dữ liệu hiện tại
        setRecommendedProducts((prev) =>
          JSON.stringify(prev) !== JSON.stringify(filteredProducts)
            ? filteredProducts
            : prev
        );
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm liên quan:", error);
        setRecommendedProducts([]);
      }
    }

    fetchRelatedProducts();
  }, [categoryId, excludeIds]);

  // Hiển thị toast khi giỏ hàng trống
  useEffect(() => {
    if (items.length === 0) {
      toast.error("Chưa có sản phẩm trong giỏ hàng");
    }
  }, [items]);

  // Nếu chưa đăng nhập
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="w-[85%] mx-auto px-4 py-8 text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold mb-4">Vui lòng đăng nhập</h1>
          <p className="text-muted-foreground mb-8">
            Bạn cần đăng nhập để xem giỏ hàng của mình.
          </p>
          <Button asChild size="lg">
            <Link href="/login">
              <ArrowLeft className="h-4 w-4 mr-2" /> Đăng nhập
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Nếu chưa load giỏ hàng
  if (!items || total === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="w-[85%] mx-auto px-4 py-8 text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold mb-4">Đang tải giỏ hàng...</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="w-[85%] mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" /> Tiếp tục mua sắm
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Giỏ hàng</h1>
          <p className="text-muted-foreground">
            {items.length} sản phẩm trong giỏ hàng
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Danh sách sản phẩm */}
          <div
            className={`lg:w-2/3 space-y-4 ${
              items.length === 0 || items.length < 2 ? "min-h-[400px]" : ""
            }`}
          >
            <Card className="h-full border-none">
              <CardContent className="p-6">
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <div key={item.variantId}>
                      <div className="flex space-x-4">
                        <div className="relative w-24 h-24">
                          <Image
                            src={item.productImage || "/placeholder.svg"}
                            alt={item.productName}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <div>
                              <Link
                                href={`/product/${item.variantId}`}
                                className="font-semibold hover:text-primary"
                              >
                                {item.productName}
                              </Link>
                              <div className="text-sm text-muted-foreground mt-2">
                                {item.attributes.map((attr) => (
                                  <div key={attr.name}>
                                    {attr.name}: {attr.value}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="font-bold text-lg">
                              {formatPriceVND(item.price)}
                            </div>
                          </div>
                          <div className="flex justify-between mt-4">
                            <div className="flex items-center space-x-3">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  updateQuantity(item.variantId, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-12 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  updateQuantity(item.variantId, item.quantity + 1)
                                }
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <div className="text-sm text-muted-foreground">
                                Tổng phụ: {formatPriceVND(item.price * item.quantity)}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.variantId)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> Xóa
                            </Button>
                          </div>
                        </div>
                      </div>
                      {index < items.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))
                ) : (
                  <div className="text-center">
                    <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
                    <h2 className="text-xl font-semibold mb-2">Giỏ hàng trống</h2>
                    <p className="text-muted-foreground mb-4">
                      Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng.
                    </p>
                    <Button asChild>
                      <Link href="/products">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Tiếp tục mua sắm
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tóm tắt đơn hàng */}
          <div
            className={`lg:w-1/3 ${
              items.length === 0 || items.length < 2 ? "min-h-[400px]" : ""
            }`}
          >
            <Card className="h-full border-none">
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>
                    Tổng phụ ({items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm)
                  </span>
                  <span>{formatPriceVND(subtotal)}</span>
                </div>
                <Separator className="my-6" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Tổng cộng</span>
                  <span>{formatPriceVND(subtotal)}</span>
                </div>
                <div className="space-y-2">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-[#923ce9] to-[#644feb] text-white"
                    size="lg"
                    disabled={items.length === 0 || subtotal === 0}
                  >
                    <Link href="/checkout">Tiến hành thanh toán</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/products">Tiếp tục mua sắm</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sản phẩm gợi ý */}
        {recommendedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Bạn có thể thích</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((laptop) => (
                <ProductCard key={laptop._id} laptop={laptop} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}