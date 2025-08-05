"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/header";
import ProductCard from "@/components/product-card";
import { useCart } from "@/context/cart-context";
import { laptops } from "@/data/laptops";
import Footer from "@/components/footer";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

// Hàm định dạng giá tiền với VND sau giá
const formatPriceVND = (price: number) => `${price.toLocaleString()} VND`;

interface ShippingOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  description: string;
}

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const { items, total, updateQuantity, removeItem } = useCart();
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);

  // Tính toán tổng và sản phẩm gợi ý trước mọi return
  const subtotal = total ?? 0; // Sử dụng 0 nếu total undefined
  const shippingCost = 0; // Mặc định là 0 vì không có phí vận chuyển
  const tax = (subtotal + shippingCost) * 0.08; // Tính thuế dựa trên subtotal + shippingCost
  const totalAmount = subtotal + shippingCost + tax;

  const recommendedProducts = useMemo(() => {
    if (!items || items.length === 0) return laptops.slice(0, 4);
    const cartIds = items.map((item) => item.variantId);
    return laptops
      .filter((laptop) => !cartIds.includes(laptop.id))
      .slice(0, 4);
  }, [items]);

  // Kiểm tra trạng thái đăng nhập
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="w-[85%] max-w-none mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-3xl font-bold mb-4">Vui lòng đăng nhập</h1>
            <p className="text-muted-foreground mb-8">
              Bạn cần đăng nhập để xem giỏ hàng của mình.
            </p>
            <Button asChild size="lg">
              <Link href="/login">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Đăng nhập
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Kiểm tra trạng thái giỏ hàng
  if (!items || total === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="w-[85%] max-w-none mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-3xl font-bold mb-4">Đang tải giỏ hàng...</h1>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="w-[85%] max-w-none mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tiếp tục mua sắm
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Giỏ hàng</h1>
          <p className="text-muted-foreground">
            {items.length} sản phẩm trong giỏ hàng
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {/* Danh sách sản phẩm trong giỏ hàng */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="min-h-[400px]">
              <CardContent className="p-6">
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <div key={item.variantId}>
                      <div className="flex space-x-4">
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <Image
                            src={item.productImage || "/placeholder.svg"}
                            alt={item.productName}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <Link
                                href={`/product/${item.variantId}`}
                                className="font-semibold hover:text-primary transition-colors line-clamp-2"
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

                            <div className="text-right ml-4">
                              <div className="font-bold text-lg">{formatPriceVND(item.price)}</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="font-medium w-12 text-center">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Tổng phụ: {formatPriceVND(item.price * item.quantity)}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.variantId)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Xóa
                              </Button>
                            </div>
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
                      Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy bắt đầu mua sắm!
                    </p>
                    <Button asChild>
                      <Link href="/products">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Tiếp tục mua sắm
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="space-y-6">
            <Card className="min-h-[400px]">
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>
                      Tổng phụ ({items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm)
                    </span>
                    <span>{formatPriceVND(subtotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Vận chuyển</span>
                    <span>{subtotal > 0 ? "Miễn phí" : "Chưa áp dụng"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Thuế</span>
                    <span>{subtotal > 0 ? formatPriceVND(tax) : "0 VND"}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Tổng cộng</span>
                    <span>{subtotal > 0 ? formatPriceVND(totalAmount) : "0 VND"}</span>
                  </div>
                </div>

                <Button asChild className="w-full" size="lg" disabled={subtotal === 0}>
                  <Link href="/checkout">Tiến hành thanh toán</Link>
                </Button>

                <div className="text-center">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/">Tiếp tục mua sắm</Link>
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
                <ProductCard key={laptop.id} laptop={laptop} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}