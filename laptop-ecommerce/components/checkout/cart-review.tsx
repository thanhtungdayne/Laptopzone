"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import { formatPrice } from "@/lib/utils"
import { useCheckout } from "@/context/checkout-context"

export default function CartReview() {
  const { state: cartState } = useCart()
  const { dispatch } = useCheckout()

  const subtotal = cartState.total
  const shippingCost = subtotal > 500 ? 0 : 29.99
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shippingCost + tax

  const handleContinue = () => {
    dispatch({ type: "SET_STEP", payload: 2 })
  }

  if (cartState.items.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Button onClick={() => (window.location.href = "/")}>Continue Shopping</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cartState.items.map((item) => (
            <div key={item.laptop.id} className="flex space-x-4">
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
                <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatPrice(item.laptop.price * item.quantity)}</p>
                <p className="text-sm text-muted-foreground">{formatPrice(item.laptop.price)} each</p>
              </div>
            </div>
          ))}

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {shippingCost === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">🎉 You qualify for free shipping!</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleContinue} size="lg">
          Continue to Shipping
        </Button>
      </div>
    </div>
  )
}
