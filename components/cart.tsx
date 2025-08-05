"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Plus, Minus, Trash2, ExternalLink, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { formatPrice } from "@/lib/utils";

export default function Cart() {
  const { items, total, clearCart, removeItem, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  
  if (!isAuthenticated) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md flex items-center justify-center">
          <div className="text-center space-y-4">
            <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              Vui lòng{" "}
              <Link href="/login" className="text-primary underline">
                đăng nhập
              </Link>{" "}
              để xem giỏ hàng
            </p>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {items.reduce((sum, item) => sum + item.quantity, 0)}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="flex items-center justify-between">
            Giỏ hàng
            {items.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearCart}>
                Xóa tất cả
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-6">
                Giỏ hàng của bạn đang trống
              </p>
              <Button onClick={() => setIsOpen(false)}>Tiếp tục mua sắm</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4 min-h-0">
              <div className="space-y-4 pr-2">
                {items.slice(0, 3).map((item, index) => (
                  <div
                    key={index}
                    className="flex space-x-4 p-4 border rounded-lg"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.productImage || "/placeholder.svg"}
                        alt={item.productName}
                        fill
                        className="object-cover rounded"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2">
                        {item.productName}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price)}
                      </p>
                      <div className="text-xs mt-1 space-y-1">
                        {item.attributes.map((attr, i) => (
                          <div key={i} className="text-muted-foreground">
                            {attr.name}: {attr.value}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>

                        <div className="text-sm">{item.quantity}</div>

                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:text-destructive"
                          onClick={() => {
                           
                            removeItem(item.variantId);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                    </div>
                  </div>
                ))}

                {items.length > 3 && (
                  <div className="text-center py-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/cart" onClick={() => setIsOpen(false)}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Xem thêm {items.length - 3} sản phẩm
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-shrink-0 border-t bg-background">
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Tổng cộng:</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <div className="space-y-3">
                  <Button asChild className="w-full" size="lg">
                    <Link href="/cart" onClick={() => setIsOpen(false)}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Xem giỏ hàng
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/checkout" onClick={() => setIsOpen(false)}>
                      Thanh toán nhanh
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Tiếp tục mua sắm
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
