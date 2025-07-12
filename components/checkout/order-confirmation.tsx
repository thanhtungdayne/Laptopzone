"use client"

import Image from "next/image"
import { CheckCircle, Download, Truck, Calendar, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCheckout } from "@/context/checkout-context"

export default function OrderConfirmation() {
  const { state, dispatch } = useCheckout()

  if (!state.order) {
    return null
  }

  const { order } = state

  const handleNewOrder = () => {
    dispatch({ type: "RESET_CHECKOUT" })
    window.location.href = "/"
  }

  const handleDownloadReceipt = () => {
    // In a real app, this would generate and download a PDF receipt
    alert("Receipt download would start here")
  }

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <Card className="text-center">
        <CardContent className="p-8">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-4">
            Thank you for your purchase. Your order has been confirmed and will be shipped soon.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 inline-block">
            <p className="text-sm text-muted-foreground">Order Number</p>
            <p className="font-mono font-bold text-lg">{order.id}</p>
          </div>
        </CardContent>
      </Card>

      {/* Order Details */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex space-x-4">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover rounded" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{order.shipping_cost === 0 ? "Free" : `$${order.shipping_cost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery & Payment Info */}
        <div className="space-y-6">
          {/* Shipping Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-5 w-5" />
                <span>Shipping Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="font-medium">
                  {order.shipping.firstName} {order.shipping.lastName}
                </p>
                <p>{order.shipping.address}</p>
                <p>
                  {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}
                </p>
                <p>{order.shipping.country}</p>
                <p className="text-muted-foreground">{order.shipping.email}</p>
                <p className="text-muted-foreground">{order.shipping.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Estimated Delivery */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Estimated Delivery</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">
                {new Date(order.estimatedDelivery).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                You'll receive tracking information via email once your order ships.
              </p>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payment Method</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">•••• •••• •••• {order.payment.cardLast4}</p>
              <p className="text-sm text-muted-foreground">{order.payment.cardholderName}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={handleDownloadReceipt} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Receipt
        </Button>
        <Button onClick={handleNewOrder}>Continue Shopping</Button>
      </div>
    </div>
  )
}
