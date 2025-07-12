"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Trash2, Heart, ShoppingBag, ArrowLeft, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import ProductCard from "@/components/product-card";
import ShippingCalculator from "@/components/shipping-calculator";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useCoupon, calculateDiscount } from "@/context/coupon-context";
import { laptops } from "@/data/laptops";
import Footer from "@/components/footer";
import { formatPrice, formatNumber } from "@/lib/utils";

interface ShippingOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  description: string;
}

export default function CartPage() {
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const { dispatch: wishlistDispatch } = useWishlist();
  const { state: couponState, dispatch: couponDispatch, validateCoupon } = useCoupon();

  const [couponCode, setCouponCode] = useState("");
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);

  // Calculate totals
  const subtotal = cartState.total;
  const shippingCost = selectedShipping?.price || (subtotal >= 500 ? 0 : 29.99);
  const discount = calculateDiscount(couponState.appliedCoupon, subtotal);
  const tax = (subtotal - discount + shippingCost) * 0.08;
  const total = subtotal - discount + shippingCost + tax;

  // Get recommended products
  const recommendedProducts = useMemo(() => {
    if (cartState.items.length === 0) return laptops.slice(0, 4);

    const cartBrands = [...new Set(cartState.items.map((item) => item.laptop.brand))];
    const cartCategories = [
      ...new Set(cartState.items.map((item) => item.laptop.category)),
    ];
    const cartIds = cartState.items.map((item) => item.laptop.id);

    return laptops
      .filter(
        (laptop) =>
          !cartIds.includes(laptop.id) &&
          (cartBrands.includes(laptop.brand) || cartCategories.includes(laptop.category))
      )
      .slice(0, 4);
  }, [cartState.items]);

  const updateQuantity = (id: number, quantity: number) => {
    cartDispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const removeItem = (id: number) => {
    cartDispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const saveForLater = (laptop: any) => {
    wishlistDispatch({ type: "ADD_ITEM", payload: laptop });
    cartDispatch({ type: "REMOVE_ITEM", payload: laptop.id });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    await validateCoupon(couponCode, subtotal);
    if (!couponState.error) {
      setCouponCode("");
    }
  };

  const removeCoupon = () => {
    couponDispatch({ type: "REMOVE_COUPON" });
  };

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="w-[85%] max-w-none mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-3xl font-bold mb-4">Giỏ hàng trống</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any items to your cart yet. Start shopping to
              fill it up!
            </p>
            <Button asChild size="lg">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Tiếp tục mua sắm
              </Link>
            </Button>

            {recommendedProducts.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recommendedProducts.map((laptop) => (
                    <ProductCard key={laptop.id} laptop={laptop} />
                  ))}
                </div>
              </div>
            )}
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
              Continue Shopping
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Giỏ hàng</h1>
          <p className="text-muted-foreground">
            {cartState.items.length} items in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartState.items.map((item) => (
              <Card key={item.laptop.id}>
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.laptop.image || "/placeholder.svg"}
                        alt={item.laptop.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Link
                            href={`/product/${item.laptop.id}`}
                            className="font-semibold hover:text-primary transition-colors line-clamp-2"
                          >
                            {item.laptop.name}
                          </Link>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {item.laptop.brand}
                            </Badge>
                            {item.laptop.inStock ? (
                              <Badge
                                variant="default"
                                className="text-xs bg-green-100 text-green-800"
                              >
                                In Stock
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                Out of Stock
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground mt-2">
                            <div>{item.laptop.processor}</div>
                            <div>
                              {item.laptop.ram} • {item.laptop.storage}
                            </div>
                          </div>
                        </div>

                        <div className="text-right ml-4">
                          <div className="font-bold text-lg">
                            {formatPrice(item.laptop.price)}
                          </div>
                          {item.laptop.originalPrice && (
                            <div className="text-sm text-muted-foreground line-through">
                              {formatPrice(item.laptop.originalPrice)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(item.laptop.id, item.quantity - 1)
                              }
                              disabled={!item.laptop.inStock}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-medium w-12 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(item.laptop.id, item.quantity + 1)
                              }
                              disabled={!item.laptop.inStock}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Subtotal: {formatPrice(item.laptop.price * item.quantity)}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => saveForLater(item.laptop)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Heart className="h-4 w-4 mr-1" />
                            Save for Later
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.laptop.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Coupon Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Tag className="h-5 w-5" />
                  <span>Promo Code</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {couponState.appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div>
                      <div className="font-medium text-green-800">
                        {couponState.appliedCoupon.code}
                      </div>
                      <div className="text-sm text-green-600">
                        {couponState.appliedCoupon.description}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeCoupon}
                      className="text-green-800"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Label htmlFor="couponCode">Enter promo code</Label>
                      <Input
                        id="couponCode"
                        placeholder="WELCOME10"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        onKeyPress={(e) => e.key === "Enter" && handleApplyCoupon()}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={handleApplyCoupon}
                        disabled={couponState.isValidating || !couponCode.trim()}
                      >
                        {couponState.isValidating ? "Applying..." : "Apply"}
                      </Button>
                    </div>
                  </div>
                )}
                {couponState.error && (
                  <p className="text-sm text-red-500">{couponState.error}</p>
                )}

                <div className="text-xs text-muted-foreground">
                  <p>Available codes: WELCOME10, SAVE50, LAPTOP20</p>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Calculator */}
            <ShippingCalculator
              subtotal={subtotal}
              onShippingChange={setSelectedShipping}
            />

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>
                      Tổng phụ (
                      {cartState.items.reduce((sum, item) => sum + item.quantity, 0)} sản
                      phẩm)
                    </span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({couponState.appliedCoupon?.code})</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Vận chuyển</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `$${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Thuế</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Tổng cộng</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {subtotal >= 500 && shippingCost === 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      🎉 You qualify for free shipping!
                    </p>
                  </div>
                )}

                <Button asChild className="w-full" size="lg">
                  <Link href="/checkout">Tiến hành thanh toán</Link>
                </Button>

                <div className="text-center">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/">Continue Shopping</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
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
