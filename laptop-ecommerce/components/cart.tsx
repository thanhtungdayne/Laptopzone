"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Plus, Minus, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/lib/utils"

export default function Cart() {
  const { state, dispatch } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const removeItem = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {state.items.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {state.items.reduce((sum, item) => sum + item.quantity, 0)}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="flex items-center justify-between">
            Giỏ hàng
            {state.items.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearCart}>
                Xóa tất cả
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        {state.items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-6">Giỏ hàng của bạn đang trống</p>
              <Button onClick={() => setIsOpen(false)}>Tiếp tục mua sắm</Button>
            </div>
          </div>
        ) : (
          <>
            {/* Scrollable Items Area */}
            <div className="flex-1 overflow-auto py-4 min-h-0">
              <div className="space-y-4 pr-2">
                {state.items.slice(0, 3).map((item) => (
                  <div key={item.laptop.id} className="flex space-x-4 p-4 border rounded-lg">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.laptop.image || "/placeholder.svg"}
                        alt={item.laptop.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2">{item.laptop.name}</h4>
                      <p className="text-sm text-muted-foreground">{formatPrice(item.laptop.price)}</p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.laptop.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.laptop.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:text-destructive"
                          onClick={() => removeItem(item.laptop.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {state.items.length > 3 && (
                  <div className="text-center py-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/cart" onClick={() => setIsOpen(false)}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Xem thêm {state.items.length - 3} sản phẩm
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Fixed Bottom Section */}
            <div className="flex-shrink-0 border-t bg-background">
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Tổng cộng:</span>
                  <span>{formatPrice(state.total)}</span>
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
                  <Button variant="ghost" className="w-full" onClick={() => setIsOpen(false)}>
                    Tiếp tục mua sắm
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
